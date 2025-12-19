
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle, HelpCircle, Tag, ArrowLeft, BookOpen, Layers, Database, Sparkles } from 'lucide-react';
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

type SearchMode = 'database' | 'ai' | 'hybrid';
type AcronymResult = {
  type: 'acronym';
  data: AcronymData & { acronym: string };
  score: number;
};
type QuestionResult = {
  type: 'question';
  document: Question;
  score: number;
  intent: string[];
};
type NotFoundResult = { notFound: true };
type SearchResult = AcronymResult | QuestionResult | NotFoundResult | null;

const renderMarkdown = (text: string) => {
  if (!text) return [];
  let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const paragraphs = processedText.split('\n').filter(p => p.trim() !== '');
  return paragraphs.map((para, i) => (
    <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: para }} />
  ));
};


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

    const detectedLang = detectLanguage(query);
    setUiLanguage(detectedLang);

    const matches = findBestMatch(query, questions);
    const bestMatch = matches.length > 0 ? matches[0] : null;

    if (mode === 'database') {
      if (bestMatch) {
        setResult(bestMatch as any);
      } else {
        setResult({ notFound: true });
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
      const aiResponse = await performAiSearch(query, detectedLang);
      if (aiResponse) {
        startTransition(() => {
          saveNewQuestion(query, detectedLang, aiResponse, 'ai-generated');
        });
      }
      setLoading(false);
    } else if (mode === 'hybrid') {
      if (bestMatch && bestMatch.score > 70) {
        setResult(bestMatch as any);
        setLoading(false);
      } else {
        const aiResponse = await performAiSearch(query, detectedLang);
        if (aiResponse) {
          startTransition(() => {
            saveNewQuestion(query, detectedLang, aiResponse, 'hybrid-learning');
          });
        }
        setLoading(false);
      }
    }
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
      return aiResult;
    } catch (error) {
      console.error("AI search failed:", error);
      setResult({ notFound: true });
      return null;
    }
  };
  
  const saveNewQuestion = async (query: string, language: 'en' | 'hi', aiResponse: GenerateAiAnswerOutput, source: 'ai-generated' | 'hybrid-learning' | 'expert-database') => {
    if (!firestore) return;

    const existingMatches = findBestMatch(query, questions);
    const hasGoodMatch = existingMatches.some(m => m.type === 'question' && m.score > 90);
    if (hasGoodMatch) {
      console.log("Duplicate question detected, not saving.");
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


  const getCategoryBadge = (category?: string) => {
    const colors: { [key: string]: string } = {
      welding: 'bg-red-500/20 text-red-400',
      quality: 'bg-blue-500/20 text-blue-400',
      testing: 'bg-green-500/20 text-green-400',
      material: 'bg-purple-500/20 text-purple-400',
      standard: 'bg-yellow-500/20 text-yellow-400',
      piping: 'bg-cyan-500/20 text-cyan-400',
      equipment: 'bg-orange-500/20 text-orange-400'
    };
    return category ? (colors[category] || 'bg-slate-500/20 text-slate-400') : 'bg-slate-500/20 text-slate-400';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 font-body">
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="h-5 w-5 text-white" />
                </Link>
            </Button>
             <Logo />
          </div>
            <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-full border border-slate-700">
              <Button
                variant={mode === 'database' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('database')}
                className={`rounded-full px-3 text-sm ${mode === 'database' ? 'bg-orange-500 text-white' : 'text-slate-300'}`}
              >
                <Database className="mr-2 h-4 w-4" /> Database
              </Button>
              <Button
                 variant={mode === 'ai' ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setMode('ai')}
                 className={`rounded-full px-3 text-sm ${mode === 'ai' ? 'bg-orange-500 text-white' : 'text-slate-300'}`}
              >
                <Sparkles className="mr-2 h-4 w-4" /> AI
              </Button>
               <Button
                 variant={mode === 'hybrid' ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setMode('hybrid')}
                 className={`rounded-full px-3 text-sm ${mode === 'hybrid' ? 'bg-orange-500 text-white' : 'text-slate-300'}`}
              >
                <Layers className="mr-2 h-4 w-4" /> Hybrid
              </Button>
            </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto pt-8">
        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setUiLanguage('en')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              uiLanguage === 'en'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setUiLanguage('hi')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              uiLanguage === 'hi'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Search Box */}
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={uiLanguage === 'hi' ? 'सवाल या Acronym सर्च करें...' : 'Search questions or acronyms...'}
            className="w-full px-6 py-4 pr-14 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading || isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 rounded-lg transition"
          >
            {loading || isPending ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Result - Acronym */}
        {result && result.type === 'acronym' && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Tag className="w-6 h-6 text-white" />
                <div>
                  <div className="text-white text-sm font-medium">Industry Acronym</div>
                  <div className="text-orange-100 text-xs">{result.data.category}</div>
                </div>
              </div>
            </div>
            
            <div className="p-8 text-center">
              <div className="inline-block px-6 py-3 bg-orange-500/20 rounded-xl mb-4">
                <div className="text-5xl font-bold text-orange-400 mb-2">
                  {result.data.acronym}
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-6">
                {uiLanguage === 'hi' ? result.data.full_hi : result.data.full}
              </h2>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg">
                <span className={`px-3 py-1 rounded-md text-sm font-medium ${getCategoryBadge(result.data.category)}`}>
                  {result.data.category}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Result - Question */}
        {result && result.type === 'question' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-b border-slate-700">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-orange-400 text-sm font-medium">
                      {result.intent[0] === 'what' ? 'Definition' : result.intent[0] === 'how' ? 'Method' : 'Purpose'}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold">
                  {result.score.toFixed(0)}% Match
                </span>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">
                {uiLanguage === 'hi' ? result.document.question_hi : result.document.question_en}
              </h2>
            </div>

            <div className="px-6 py-4 bg-slate-900/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                    Quick Answer
                  </h3>
                  <p className="text-white leading-relaxed">
                    {uiLanguage === 'hi' ? result.document.shortAnswer_hi : result.document.shortAnswer_en}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">
                Key Takeaways
              </h3>
              <div className="space-y-2">
                {(uiLanguage === 'hi' ? result.document.summaryPoints_hi : result.document.summaryPoints_en).map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-slate-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1" className="border-t border-slate-700">
                <AccordionTrigger className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase">
                  Detailed Explanation
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-slate-300 prose-lg max-w-none">
                  <div>
                    {renderMarkdown(uiLanguage === 'hi' ? result.document.longAnswer_hi : result.document.longAnswer_en)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Not Found */}
        {result && 'notFound' in result && result.notFound && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {uiLanguage === 'hi' ? 'कोई रिजल्ट नहीं मिला' : 'No Results Found'}
            </h3>
            <p className="text-slate-400">
              {uiLanguage === 'hi' 
                ? 'कृपया अपने सवाल को दोबारा लिखें'
                : 'Please rephrase your question'}
            </p>
          </div>
        )}

        {/* Examples */}
        {!result && (
          <div className="mt-8">
            <p className="text-slate-500 text-sm mb-3 text-center font-medium">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-xs text-slate-600 font-semibold uppercase px-2">Acronyms</div>
                {['WPS', 'what is NDT', 'PQR kya hai'].map(ex => (
                  <button
                    key={ex}
                    onClick={() => setQuery(ex)}
                    className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-left text-slate-300 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <Tag className="w-4 h-4 text-orange-400" />
                    <span>{ex}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-600 font-semibold uppercase px-2">Questions</div>
                {['heat exchanger kya hai', 'serration area', 'what is flange'].map(ex => (
                  <button
                    key={ex}
                    onClick={() => setQuery(ex)}
                    className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-left text-slate-300 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>{ex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-center text-slate-600 text-xs">
          <div className="flex items-center justify-center gap-4">
            <span>✓ Fuzzy Matching</span>
            <span>✓ Intent Detection</span>
            <span>✓ {Object.keys(OilGasAcronyms).length}+ Acronyms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

    