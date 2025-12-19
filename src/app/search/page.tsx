
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle, HelpCircle, Tag, ArrowLeft, BookOpen, Layers, Database, Sparkles, Bookmark, Share, ThumbsUp, ThumbsDown } from 'lucide-react';
import { OilGasAcronyms, AcronymData } from '@/lib/acronyms';
import { findBestMatch, normalizeText } from '@/lib/matching';
import { useAppContext } from '@/context/AppContext';
import { generateAiAnswer, GenerateAiAnswerOutput } from '@/ai/flows/generate-ai-answer';
import type { Question } from '@/types';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { detectLanguage } from '@/lib/language';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnswerCard } from '@/components/answer-card';

type SearchMode = 'database' | 'ai' | 'hybrid';
type AcronymResult = {
  type: 'acronym';
  data: AcronymData & { acronym: string };
};
type QuestionResult = {
  type: 'question';
  document: Question;
  score: number;
  intent: string[];
};
type NotFoundResult = { notFound: true };
type SearchResult = AcronymResult | QuestionResult | NotFoundResult | null;

const modeConfig = {
  database: {
    icon: Database,
    title: 'Database Search',
    description: 'Searches our curated list of QA/QC interview questions.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  ai: {
    icon: Sparkles,
    title: 'AI Expert Mode',
    description: 'Get answers directly from our trained AI expert.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  hybrid: {
    icon: Layers,
    title: 'Hybrid Search',
    description: 'Searches database first, then consults AI if no match is found.',
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
};

export default function SmartQuestionSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult>(null);
  const [loading, setLoading] = useState(false);
  const [uiLanguage, setUiLanguage] = useState<'en' | 'hi'>('hi');
  const [mode, setMode] = useState<SearchMode>('database');

  const { questions, areQuestionsLoading, addLearnedQuestion } = useAppContext();
  const firestore = useFirestore();
  const [isPending, startTransition] = useTransition();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    const detectedLang = detectLanguage(query);
    setUiLanguage(detectedLang);

    // Using a timeout to give the UI time to show the loader, even for fast searches
    setTimeout(() => {
        const matches = findBestMatch(query, questions);
        const bestMatch = matches.length > 0 ? matches[0] : null;

        if (bestMatch?.type === 'acronym') {
            setResult(bestMatch as AcronymResult);
            setLoading(false);
            return;
        }

        if (mode === 'database') {
            if (bestMatch && bestMatch.type === 'question') {
                setResult(bestMatch as QuestionResult);
            } else {
                setResult({ notFound: true });
                // Optional: Trigger AI in background to learn
                startTransition(() => {
                    generateAiAnswer({ question: query, language: detectedLang }).then(aiResponse => {
                        if (aiResponse) {
                            saveNewQuestion(query, detectedLang, aiResponse, 'expert-database');
                        }
                    });
                });
            }
            setLoading(false);
        } else if (mode === 'ai') {
            performAiSearch(query, detectedLang).finally(() => setLoading(false));
        } else if (mode === 'hybrid') {
            if (bestMatch && bestMatch.type === 'question' && bestMatch.score > 70) {
                setResult(bestMatch as QuestionResult);
                setLoading(false);
            } else {
                performAiSearch(query, detectedLang).finally(() => setLoading(false));
            }
        }
    }, 300);
  };

  const performAiSearch = async (query: string, language: 'en' | 'hi') => {
    try {
      const aiResult = await generateAiAnswer({ question: query, language: language });
      const aiQuestion: Question = {
        ...aiResult,
        id: `ai-${Date.now()}`,
        question_en: language === 'en' ? query : '(AI Generated Answer)',
        question_hi: language === 'hi' ? query : '(एआई जनरेटेड उत्तर)',
        normalized_en: normalizeText(language === 'en' ? query : aiResult.shortAnswer_en),
        normalized_hi: normalizeText(language === 'hi' ? query : aiResult.shortAnswer_hi),
        keywords_en: [],
        keywords_hi: [],
        category: 'AI Generated',
        difficulty: 'medium',
        tags: ['AI'],
        source: 'ai-generated',
        viewCount: 0
      };
      setResult({ type: 'question', document: aiQuestion, score: 100, intent: ['what'] });
      
      startTransition(() => {
          saveNewQuestion(query, language, aiResult, 'ai-generated');
      });

    } catch (error) {
      console.error("AI search failed:", error);
      setResult({ notFound: true });
    }
  };
  
  const saveNewQuestion = async (query: string, language: 'en' | 'hi', aiResponse: GenerateAiAnswerOutput, source: 'ai-generated' | 'hybrid-learning' | 'expert-database') => {
    if (!firestore) return;

    const existingMatches = findBestMatch(query, questions);
    const hasGoodMatch = existingMatches.some(m => m.type === 'question' && m.score > 95);
    if (hasGoodMatch) {
      console.log("Duplicate question detected with high confidence, not saving.");
      return;
    }

    try {
      const questionsCollection = collection(firestore, 'questions');
      const newQuestionDoc: Omit<Question, 'id'> = {
        ...aiResponse,
        question_en: language === 'en' ? query : '(AI Generated Answer)',
        question_hi: language === 'hi' ? query : '(एआई जनरेटेड उत्तर)',
        normalized_en: normalizeText(language === 'en' ? query : aiResponse.shortAnswer_en),
        normalized_hi: normalizeText(language === 'hi' ? query : aiResponse.shortAnswer_hi),
        keywords_en: [],
        keywords_hi: [],
        category: 'AI Added',
        difficulty: 'medium',
        tags: ['AI-Learned'],
        source: source,
        viewCount: 0,
      };
      const newDocPromise = addDocumentNonBlocking(questionsCollection, newQuestionDoc);

      newDocPromise.then(docRef => {
        if (docRef) {
          const newQuestionWithId: Question = { ...newQuestionDoc, id: docRef.id };
          addLearnedQuestion(newQuestionWithId);
        }
      });
    } catch (error) {
      console.error("Failed to save new question:", error);
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    const colors: { [key: string]: string } = {
      welding: 'bg-red-500/20 text-red-400 border-red-500/30',
      quality: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      testing: 'bg-green-500/20 text-green-400 border-green-500/30',
      material: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      standard: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      piping: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      equipment: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      construction: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      commercial: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      drawing: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      pressure: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
      corrosion: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      procedure: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      inspection: 'bg-violet-500/20 text-violet-400 border-violet-500/30',

    };
    return category ? (colors[category.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30') : 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };
  
  if (areQuestionsLoading) {
      return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Preparing knowledge base...</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="h-5 w-5 text-slate-700" />
                </Link>
            </Button>
             <Logo />
          </div>
            <div className="flex items-center gap-1 p-1 bg-slate-200 rounded-full border border-slate-300">
              <Button
                variant={mode === 'database' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('database')}
                className={`rounded-full px-3 text-sm h-8 ${mode === 'database' ? 'bg-orange-500 text-white' : 'text-slate-600'}`}
              >
                <Database className="mr-2 h-4 w-4" /> Database
              </Button>
              <Button
                 variant={mode === 'ai' ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setMode('ai')}
                 className={`rounded-full px-3 text-sm h-8 ${mode === 'ai' ? 'bg-orange-500 text-white' : 'text-slate-600'}`}
              >
                <Sparkles className="mr-2 h-4 w-4" /> AI
              </Button>
               <Button
                 variant={mode === 'hybrid' ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setMode('hybrid')}
                 className={`rounded-full px-3 text-sm h-8 ${mode === 'hybrid' ? 'bg-orange-500 text-white' : 'text-slate-600'}`}
              >
                <Layers className="mr-2 h-4 w-4" /> Hybrid
              </Button>
            </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-slate-50">
        <div className="container mx-auto p-4">
          {/* Result - Acronym */}
          {result && result.type === 'acronym' && (
            <Card className="w-full max-w-4xl mx-auto shadow-lg border-slate-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                           <Tag className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                           <CardTitle className="text-primary">{result.data.acronym}</CardTitle>
                           <p className="text-sm text-muted-foreground">Industry Acronym</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {result.data.full}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {uiLanguage === 'hi' ? result.data.full_hi : result.data.full}
                    </p>
                </CardContent>
                <CardFooter>
                    <Badge variant="outline" className={getCategoryBadgeColor(result.data.category)}>
                        {result.data.category}
                    </Badge>
                </CardFooter>
            </Card>
          )}


          {/* Result - Question */}
          {result && result.type === 'question' && (
            <AnswerCard question={result.document} initialLang={uiLanguage} />
          )}

          {/* Not Found */}
          {result && 'notFound' in result && result.notFound && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mt-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {uiLanguage === 'hi' ? 'कोई रिजल्ट नहीं मिला' : 'No Results Found'}
              </h3>
              <p className="text-slate-500 mb-4">
                {uiLanguage === 'hi' 
                  ? 'कृपया अपने सवाल को दोबारा लिखें या AI मोड का उपयोग करें।'
                  : 'Please rephrase your question or try AI mode.'}
              </p>
              <Button onClick={() => setMode('ai')}>
                  <Sparkles className="mr-2 h-4 w-4" /> Try AI Mode
              </Button>
            </div>
          )}

          {/* Examples */}
          {!result && !loading && (
            <div className="mt-8">
              <p className="text-slate-500 text-sm mb-3 text-center font-medium">Try these examples:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-semibold uppercase px-2">Acronyms</div>
                  {['WPS', 'what is NDT', 'PQR kya hai'].map(ex => (
                    <button
                      key={ex}
                      onClick={() => {setQuery(ex); handleSearch();}}
                      className="w-full px-4 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-left text-slate-700 rounded-lg text-sm transition flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4 text-orange-500" />
                      <span>{ex}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-semibold uppercase px-2">Questions</div>
                  {['heat exchanger kya hai', 'serration area', 'what is flange'].map(ex => (
                    <button
                      key={ex}
                      onClick={() => {setQuery(ex); handleSearch();}}
                      className="w-full px-4 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-left text-slate-700 rounded-lg text-sm transition flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      <span>{ex}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
             <div className="flex flex-col items-center gap-4 text-center mt-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <h2 className="text-lg font-semibold text-muted-foreground">Searching...</h2>
             </div>
          )}
        </div>
      </main>

       {/* Search Box Footer */}
       <footer className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={uiLanguage === 'hi' ? 'सवाल या Acronym सर्च करें...' : 'Search questions or acronyms...'}
              className="w-full px-4 py-3 pr-24 bg-slate-100 border-slate-200 border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </Button>
              <Button
                onClick={handleSearch}
                disabled={loading || isPending}
                className="p-2 h-9 w-9 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 rounded-lg transition"
              >
                {loading || isPending ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-white" />
                )}
              </Button>
            </div>
          </div>
       </footer>
    </div>
  );
}
