"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Sparkles, Layers, Loader2 } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { useAppContext } from '@/context/AppContext';
import { Logo } from '@/components/logo';
import { AnswerCard } from '@/components/answer-card';
import type { Question } from '@/types';
import { detectLanguage } from '@/lib/language';
import { generateAiAnswer, GenerateAiAnswerOutput } from '@/ai/flows/generate-ai-answer';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { findBestMatch, normalizeText } from '@/lib/matching';
import { AcronymMatch } from '@/lib/acronyms';

type SearchMode = 'database' | 'ai' | 'hybrid';

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

export default function SearchPage() {
  const [mode, setMode] = useState<SearchMode>('database');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [initialLang, setInitialLang] = useState<'en' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);

  const { areQuestionsLoading, questions, addLearnedQuestion } = useAppContext();
  const { toast } = useToast();
  const CurrentModeIcon = modeConfig[mode].icon;
  const firestore = useFirestore();
  const [isPending, startTransition] = useTransition();

  const saveNewQuestion = useCallback(async (query: string, language: 'en' | 'hi', aiResponse: GenerateAiAnswerOutput, source: 'ai-generated' | 'hybrid-learning' | 'expert-database') => {
    if (!firestore) return;
    
    // Use the advanced matcher to check for duplicates before saving
    const existingMatches = findBestMatch(query, questions);
    const hasGoodMatch = existingMatches.some(m => m.type === 'question' && m.score > 90);
    if (hasGoodMatch) {
      console.log("Duplicate question detected with high confidence, not saving to Firestore.");
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
                console.log("New question saved and added to local context:", docRef.id);
            }
        });

    } catch (error) {
        console.error("Failed to save new question:", error);
    }
  }, [firestore, addLearnedQuestion, questions]);

  const performAiSearch = useCallback(async (query: string, language: 'en' | 'hi') => {
      setIsLoading(true);
      setActiveQuestion(null);
      setUiMessage(null);
      try {
          const aiResult = await generateAiAnswer({ question: query, language: language });
          const aiQuestion: Question = {
              ...aiResult,
              id: `ai-${Date.now()}`,
              question_en: language === 'en' ? query : aiResult.shortAnswer_en,
              question_hi: language === 'hi' ? query : aiResult.shortAnswer_hi,
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
          setInitialLang(language);
          setActiveQuestion(aiQuestion);
          return aiResult; 
      } catch (error) {
          console.error("AI search failed:", error);
          toast({ variant: "destructive", title: "AI Search Failed", description: "Could not get a response from the AI expert." });
          setUiMessage("AI failed to respond. Please try again.");
          return null;
      } finally {
          setIsLoading(false);
      }
  }, [toast]);

  const createAcronymQuestion = (match: AcronymMatch): Question => {
    return {
        id: `acronym-${match.acronym}`,
        question_en: `What is ${match.acronym}?`,
        question_hi: `${match.acronym} क्या है?`,
        shortAnswer_en: match.full,
        shortAnswer_hi: match.full_hi,
        longAnswer_en: `Category: ${match.category}.`,
        longAnswer_hi: `श्रेणी: ${match.category}.`,
        summaryPoints_en: match.variations,
        summaryPoints_hi: match.variations,
        category: match.category,
        difficulty: 'easy',
        tags: ['acronym', match.category],
        source: 'acronym-db',
        viewCount: 0,
        normalized_en: normalizeText(match.acronym),
        normalized_hi: normalizeText(match.acronym),
        keywords_en: [match.acronym.toLowerCase()],
        keywords_hi: [match.acronym.toLowerCase()],
    };
  };

  const handleSearch = async (query: string) => {
    setActiveQuestion(null);
    setUiMessage(null);
    setIsLoading(true);

    const detectedLang = detectLanguage(query);
    setInitialLang(detectedLang);
    
    const results = findBestMatch(query, questions);
    const bestResult = results.length > 0 ? results[0] : null;

    if (bestResult?.type === 'acronym') {
        const acronymQuestion = createAcronymQuestion(bestResult.data);
        setActiveQuestion(acronymQuestion);
        setIsLoading(false);
        return;
    }

    if (mode === 'database') {
        if (bestResult?.type === 'question') {
            setActiveQuestion(bestResult.document);
        } else {
            setUiMessage("Data not found. Please search after some time.");
            startTransition(() => {
                generateAiAnswer({ question: query, language: detectedLang }).then(aiResult => {
                    if (aiResult) {
                        saveNewQuestion(query, detectedLang, aiResult, 'expert-database');
                    }
                });
            });
        }
        setIsLoading(false);

    } else if (mode === 'ai') {
        const aiResult = await performAiSearch(query, detectedLang);
        if (aiResult) {
             startTransition(() => {
                saveNewQuestion(query, detectedLang, aiResult, 'ai-generated');
            });
        }

    } else if (mode === 'hybrid') {
        if (bestResult?.type === 'question' && bestResult.score > 70) { // Stricter threshold for hybrid
            setActiveQuestion(bestResult.document);
            setIsLoading(false);
        } else { 
            const aiResult = await performAiSearch(query, detectedLang);
            if(aiResult) {
                startTransition(() => {
                    saveNewQuestion(query, detectedLang, aiResult, 'hybrid-learning');
                });
            }
        }
    }
  };


  const isPageLoading = areQuestionsLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
       <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
             <Logo />
          </div>
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-full">
              <Button
                variant={mode === 'database' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('database')}
                className={`rounded-full px-3 text-sm ${mode === 'database' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <Database className="mr-2 h-4 w-4" /> Database
              </Button>
              <Button
                 variant={mode === 'ai' ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setMode('ai')}
                 className={`rounded-full px-3 text-sm ${mode === 'ai' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <Sparkles className="mr-2 h-4 w-4" /> AI
              </Button>
               <Button
                 variant={mode === 'hybrid' ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setMode('hybrid')}
                 className={`rounded-full px-3 text-sm ${mode === 'hybrid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <Layers className="mr-2 h-4 w-4" /> Hybrid
              </Button>
            </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 pt-8 pb-32">
        {isPageLoading && !activeQuestion ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Preparing knowledge base...</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        ) : isLoading ? (
             <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Consulting Expert...</h2>
                <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        ) : activeQuestion ? (
          <div className="w-full max-w-4xl">
            <AnswerCard question={activeQuestion} initialLang={initialLang} />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center max-w-lg">
             {uiMessage ? (
                <div className="flex flex-col items-center gap-4 text-center">
                    <h2 className="text-xl font-semibold">Result</h2>
                    <p className="text-muted-foreground">{uiMessage}</p>
                </div>
             ) : (
                <>
                    <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${modeConfig[mode].bgColor}`}>
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-card`}>
                            <CurrentModeIcon className={`h-10 w-10 ${modeConfig[mode].color}`} />
                        </div>
                    </div>
                    <h1 className="font-headline text-3xl sm:text-4xl font-bold mb-3">{modeConfig[mode].title}</h1>
                    <p className="text-muted-foreground mb-8">
                        {modeConfig[mode].description}
                    </p>
                </>
             )}
          </div>
        )}
      </main>

      {!areQuestionsLoading && (
        <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent pt-8 pb-4">
          <div className="container mx-auto max-w-2xl px-4">
            <SearchForm
              onSearch={handleSearch}
              isSearching={isLoading || isPending}
              initialQuery={activeQuestion ? activeQuestion[`question_${initialLang}`] : ''}
              className="shadow-2xl shadow-primary/10"
            />
          </div>
        </footer>
      )}
    </div>
  );
}
