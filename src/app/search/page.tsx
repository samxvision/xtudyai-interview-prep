
"use client";

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { Search, Loader2, AlertCircle, Tag, ArrowLeft, Database, Mic, Sparkles, Lock } from 'lucide-react';
import { searchQuestions } from '@/lib/searchSystem';
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { correctVoiceQuery } from '@/lib/voice-corrector';

type Match = {
  question: Question;
  totalScore: number;
}

type SearchResult = {
  success: boolean;
  topMatch: Match | null;
  alternativeMatches: Match[];
} | null;

type SearchMode = 'hybrid' | 'db' | 'ai';

// Helper function to parse the AI's JSON response
function parseAiResponse(aiData: any): Question | null {
  try {
    if (!aiData || typeof aiData !== 'object') {
       throw new Error("Invalid AI data format");
    }
    // Adapt the AI data to the Question type
    const questionData: Question = {
      ...aiData,
      id: aiData.id || `ai-${Date.now()}`,
    };
    return questionData;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return null;
  }
}

export default function SmartQuestionSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult>(null);
  const [loading, setLoading] = useState(false);
  const [uiLanguage, setUiLanguage] = useState<'en' | 'hi'>('hi');
  const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>('db');


  const { areQuestionsLoading, questions } = useAppContext();
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
    if (!areQuestionsLoading && questions.length > 0) {
      // Select 4 random questions for examples
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      setExampleQuestions(shuffled.slice(0, 4).map(q => q.question_en));
    }
  }, [areQuestionsLoading, questions]);

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

  const handleAiSearch = async (searchQuery: string) => {
    try {
      const apiResponse = await fetch('/api/ai-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: searchQuery }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "AI API request failed");
      }

      const { answer } = await apiResponse.json();
      const questionData = parseAiResponse(answer);

      if (!questionData) {
        throw new Error("Failed to parse AI response.");
      }

      setResult({
        success: true,
        topMatch: { question: questionData, totalScore: 100 },
        alternativeMatches: [],
      });

    } catch (error: any) {
        console.error("AI search failed:", error);
        toast({
            title: "AI Search Error",
            description: error.message || "Sorry, the AI is unable to answer this question right now.",
            variant: "destructive",
        });
        setResult({ success: false, topMatch: null, alternativeMatches: [] });
    }
  };

  const handleSearch = async (searchQuery: string, isVoiceSearch: boolean = false) => {
    if (!searchQuery.trim() || areQuestionsLoading) return;

    setLoading(true);
    setResult(null);

    let finalQuery = searchQuery;
    if (isVoiceSearch) {
      // Correct the query ONLY if it comes from voice input
      finalQuery = correctVoiceQuery(searchQuery);
      console.log(`🎤 Voice Corrected Query: "${searchQuery}" -> "${finalQuery}"`);
      setQuery(finalQuery); // Update the input box with the corrected query
    }

    startTransition(async () => {
        if (searchMode === 'ai') {
            await handleAiSearch(finalQuery);
            setLoading(false);
            return;
        }

        const matchResult = await searchQuestions(finalQuery, questions);
        
        const topMatch = matchResult.topMatch ? { question: matchResult.topMatch.question, totalScore: matchResult.topMatch.confidence || 0 } : null;
        
        const alternativeMatches = (matchResult.alternativeMatches || []).map((match: any) => ({
             question: match.question,
             totalScore: match.confidence || 0
        }));

        if (searchMode === 'hybrid' && (!matchResult || !matchResult.success)) {
            await handleAiSearch(finalQuery);
        } else {
            setResult({ success: matchResult.success, topMatch, alternativeMatches });

            if (!matchResult.success && searchMode === 'db') {
                 sendQuestionToAutomation(finalQuery);
            }
        }
        
        setLoading(false);
    });
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
    return typeof category === 'string' ? (colors[category.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30') : 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
    // A slight delay to ensure the final transcript is processed
    setTimeout(() => {
        // Important: Set isVoiceSearch to true here
        handleSearch(transcript || query, true);
    }, 300);
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
          <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as SearchMode)} className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hybrid" disabled className="flex items-center gap-2">
                    Hybrid <Lock className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="db">Database</TabsTrigger>
                <TabsTrigger value="ai" disabled className="flex items-center gap-2">
                    AI <Lock className="h-3 w-3" />
                </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-slate-50">
        <div className="container mx-auto p-4 space-y-6">

          {/* Result - Question(s) */}
          {result && result.success && result.topMatch && (
            <div className="space-y-6">
              <AnswerCard 
                question={result.topMatch.question} 
                initialLang={uiLanguage} 
                isAiGenerated={searchMode === 'ai'} 
              />
              
              {result.alternativeMatches.map((match, index) => (
                 <div key={index}>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium mb-4">
                    Related Result
                  </div>
                  <AnswerCard question={match.question} initialLang={uiLanguage} />
                </div>
              ))}
            </div>
          )}

          {/* Not Found */}
          {result && !result.success && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mt-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {uiLanguage === 'hi' ? 'डेटा नहीं मिला' : 'Data not found'}
              </h3>
              <p className="text-slate-500 mb-4">
                {uiLanguage === 'hi' 
                  ? 'यह प्रश्न हमारे डेटाबेस में नहीं मिला। हम इसे भविष्य के लिए जोड़ देंगे।'
                  : 'This question was not found in our database. We will add it for the future.'}
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
                           <p className="text-slate-700 whitespace-normal">"{q}"</p>
                        </Button>
                    ))}
                </div>
            </div>
          )}

          {loading && (
             <div className="flex flex-col items-center gap-4 text-center mt-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <h2 className="text-lg font-semibold text-muted-foreground">
                    {searchMode === 'ai' ? "AI is thinking..." : "Searching..."}
                </h2>
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

    