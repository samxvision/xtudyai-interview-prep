
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Sparkles, Layers, Loader2 } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { useAppContext } from '@/context/AppContext';
import { Logo } from '@/components/logo';
import { AnswerCard } from '@/components/answer-card';
import type { Question } from '@/types';
import { detectLanguage } from '@/lib/language';
import { generateAiAnswer } from '@/ai/flows/generate-ai-answer';
import { useToast } from '@/hooks/use-toast';

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
  const [isAiSearching, setIsAiSearching] = useState(false);
  
  const { isLoading: areQuestionsLoading, findBestMatch } = useAppContext();
  const { toast } = useToast();
  const CurrentModeIcon = modeConfig[mode].icon;

  const handleSearch = async (query: string) => {
    setActiveQuestion(null);
    const detectedLang = detectLanguage(query);
    setInitialLang(detectedLang);

    if (mode === 'database') {
      const result = findBestMatch(query);
      if (result) {
        setActiveQuestion(result.question);
      } else {
        toast({ title: "No match found", description: "No relevant question found in the database."});
      }
    } else if (mode === 'ai') {
        setIsAiSearching(true);
        try {
            const aiResult = await generateAiAnswer({ question: query, language: detectedLang });
            const aiQuestion: Question = {
                ...aiResult,
                id: `ai-${Date.now()}`,
                question_en: detectedLang === 'en' ? query : '(AI Generated Answer)',
                question_hi: detectedLang === 'hi' ? query : '(एआई जनरेटेड उत्तर)',
                normalized_en: '',
                normalized_hi: '',
                keywords_en: [],
                keywords_hi: [],
                category: 'AI Generated',
                difficulty: 'medium',
                tags: ['AI'],
                source: 'AI Expert',
                viewCount: 0
            };
            setActiveQuestion(aiQuestion);
        } catch (error) {
            console.error("AI search failed:", error);
            toast({ variant: "destructive", title: "AI Search Failed", description: "Could not get a response from the AI expert." });
        } finally {
            setIsAiSearching(false);
        }
    } else if (mode === 'hybrid') {
        const dbResult = findBestMatch(query);
        if (dbResult) {
            setActiveQuestion(dbResult.question);
        } else {
            setIsAiSearching(true);
            try {
                toast({ title: "No database match.", description: "Consulting AI expert..." });
                const aiResult = await generateAiAnswer({ question: query, language: detectedLang });
                const aiQuestion: Question = {
                    ...aiResult,
                    id: `ai-${Date.now()}`,
                    question_en: detectedLang === 'en' ? query : '(AI Generated Answer)',
                    question_hi: detectedLang === 'hi' ? query : '(एआई जनरेटेड उत्तर)',
                    normalized_en: '',
                    normalized_hi: '',
                    keywords_en: [],
                    keywords_hi: [],
                    category: 'AI Generated',
                    difficulty: 'medium',
                    tags: ['AI', 'Hybrid'],
                    source: 'AI Expert',
                    viewCount: 0
                };
                setActiveQuestion(aiQuestion);
            } catch (error) {
                 console.error("AI search failed:", error);
                 toast({ variant: "destructive", title: "AI Search Failed", description: "Could not get a response from the AI expert." });
            } finally {
                setIsAiSearching(false);
            }
        }
    }
  };


  const handleBackToSearch = () => {
    setActiveQuestion(null);
  };

  const isPageLoading = areQuestionsLoading || isAiSearching;

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
        {isPageLoading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">{isAiSearching ? 'Consulting AI Expert...' : 'Preparing knowledge base...'}</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        ) : activeQuestion ? (
          <div className="w-full max-w-4xl">
            <AnswerCard question={activeQuestion} initialLang={initialLang} />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center max-w-lg">
            <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${modeConfig[mode].bgColor}`}>
                <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-card`}>
                    <CurrentModeIcon className={`h-10 w-10 ${modeConfig[mode].color}`} />
                </div>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold mb-3">{modeConfig[mode].title}</h1>
            <p className="text-muted-foreground mb-8">
                {modeConfig[mode].description}
            </p>
          </div>
        )}
      </main>

      {!areQuestionsLoading && (
        <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent pt-8 pb-4">
          <div className="container mx-auto max-w-2xl px-4">
            <SearchForm
              onSearch={handleSearch}
              isSearching={isAiSearching}
              initialQuery={activeQuestion ? activeQuestion[`question_${initialLang}`] : ''}
              className="shadow-2xl shadow-primary/10"
            />
          </div>
        </footer>
      )}
    </div>
  );
}
