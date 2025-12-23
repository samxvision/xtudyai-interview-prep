
"use client";

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { Search, Loader2, AlertCircle, Tag, ArrowLeft, Database, Sparkles, Layers, Lock, Mic } from 'lucide-react';
import { AcronymData, searchAcronym } from '@/lib/acronyms';
import { findBestMatch, normalizeText } from '@/lib/matching';
import { useAppContext } from '@/context/AppContext';
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnswerCard } from '@/components/answer-card';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/hooks/use-toast';
import { sendQuestionToAutomation } from '@/lib/googleSheet';
import { generateAiAnswer } from '@/ai/flows/generate-ai-answer';

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

const exampleQuestions = [
    "What is the difference between WPS and PQR?",
    "Explain undercut acceptance criteria",
    "Tell me about Radiography Testing",
    "What are the different types of NDT?",
];

export default function SmartQuestionSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult>(null);
  const [loading, setLoading] = useState(false);
  const [uiLanguage, setUiLanguage] = useState<'en' | 'hi'>('hi');
  const [mode, setMode] = useState<SearchMode>('database');

  const { questions, areQuestionsLoading } = useAppContext();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    isSupported: isSpeechSupported,
    error: speechError,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (speechError) {
      toast({
        title: "Voice Error",
        description: speechError,
        variant: "destructive",
      });
    }
  }, [speechError, toast]);

  const performAiSearch = async (searchQuery: string) => {
    try {
      const aiResponse = await generateAiAnswer(searchQuery);
      setResult({
        type: 'question',
        document: aiResponse,
        score: 100, // AI results are considered a perfect match
        intent: [],
      });
    } catch (aiError) {
      console.error("AI search failed:", aiError);
      setResult({ notFound: true });
      toast({
        title: "AI Error",
        description: "The AI expert could not provide an answer. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleSearch = useCallback(async (searchQuery: string) => {
    const finalQuery = searchQuery.trim();
    if (!finalQuery) return;

    setQuery(finalQuery);
    setLoading(true);
    setResult(null);
    
    startTransition(async () => {
        if (mode === 'ai') {
            await performAiSearch(finalQuery);
            setLoading(false);
            return;
        }
        
        const acronymResult = searchAcronym(finalQuery);
        if (acronymResult && finalQuery.trim().split(/\s+/).length <= 3) {
            setResult({
                type: 'acronym',
                data: { ...acronymResult, acronym: acronymResult.acronym },
            });
            setLoading(false);
            return;
        }

        const matches = await findBestMatch(finalQuery, questions);
        const bestMatch = matches.length > 0 ? matches[0] : null;

        if (bestMatch && bestMatch.type === 'question' && bestMatch.score > 60) {
          setResult(bestMatch as QuestionResult);
        } else {
            if (mode === 'hybrid') {
                await performAiSearch(finalQuery);
            } else {
                 setResult({ notFound: true });
                 sendQuestionToAutomation(finalQuery);
            }
        }
        setLoading(false);
    });
  }, [query, questions, mode]);

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

  const handleMicPress = () => {
    if (!isSpeechSupported) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive"
      });
      return;
    }
    const lang = 'en-US';
    startListening(lang);
  };
  
  const handleMicRelease = () => {
    stopListening();
    // Use a timeout to ensure the final transcript is set before searching
    setTimeout(() => {
        handleSearch(transcript || query);
    }, 100);
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
                 className={`rounded-full px-3 text-sm h-8 ${mode === 'ai' ? 'bg-purple-500 text-white' : 'text-slate-600'}`}
              >
                <Sparkles className="mr-2 h-4 w-4" /> AI
              </Button>
               <Button
                variant={mode === 'hybrid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('hybrid')}
                 className={`rounded-full px-3 text-sm h-8 ${mode === 'hybrid' ? 'bg-green-500 text-white' : 'text-slate-600'}`}
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
                        {uiLanguage === 'hi' ? result.data.full_hi : result.data.full}
                    </h2>
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
                {uiLanguage === 'hi' ? 'डेटा नहीं मिला' : 'Data not found'}
              </h3>
              <p className="text-slate-500 mb-4">
                {uiLanguage === 'hi' 
                  ? 'कृपया कुछ समय बाद इस प्रश्न को खोजें।'
                  : 'Search this question after some time.'}
              </p>
            </div>
          )}

          {/* Examples */}
          {!result && !loading && (
            <div className="pt-8 text-center">
                <h2 className="text-lg font-semibold text-slate-600 mb-4">Try asking</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                    {exampleQuestions.map((q, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            className="justify-start h-auto py-3 text-left font-normal bg-white"
                            onClick={() => handleSearch(q)}
                        >
                           <p className="text-slate-700">"{q}"</p>
                        </Button>
                    ))}
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
       <footer className="p-4 bg-white border-t border-slate-200 space-y-4 sticky bottom-0">
          <div className="flex justify-center">
            <Button 
                variant="ghost" 
                size="icon" 
                className={`text-white h-20 w-20 rounded-full shadow-lg transition-transform duration-200 ease-in-out ${isListening ? 'bg-red-500 scale-110' : 'bg-green-500 hover:bg-green-600'}`}
                onMouseDown={handleMicPress}
                onMouseUp={handleMicRelease}
                onTouchStart={handleMicPress}
                onTouchEnd={handleMicRelease}
            >
                <Mic className="h-10 w-10" />
            </Button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder={isListening ? 'Listening...' : (uiLanguage === 'hi' ? 'सवाल या Acronym सर्च करें...' : 'Search questions or acronyms...')}
              className="w-full h-14 px-4 pr-16 bg-slate-100 border-slate-200 border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <Button
                onClick={() => handleSearch(query)}
                disabled={loading || isPending || !query.trim()}
                className="p-2 h-10 w-10 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 rounded-lg transition"
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
