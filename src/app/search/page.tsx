"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Sparkles, Layers, Loader2 } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { useAppContext } from '@/context/AppContext';
import { Logo } from '@/components/logo';
import { AnswerCard } from '@/components/answer-card';
import type { Question } from '@/types';
import { detectLanguage } from '@/lib/language';

type SearchMode = 'database' | 'ai' | 'hybrid';

const modeConfig = {
  database: {
    icon: Database,
    title: 'Database Search',
    description: 'Searches our curated list of QA/QC interview questions.',
    color: 'text-foreground',
  },
  ai: {
    icon: Sparkles,
    title: 'AI Expert Mode',
    description: 'Get answers directly from our trained AI expert. (Coming Soon)',
    color: 'text-purple-500',
  },
  hybrid: {
    icon: Layers,
    title: 'Hybrid Search',
    description: 'Searches database first, then consults AI expert if no match is found. (Coming Soon)',
    color: 'text-green-500',
  },
};

export default function SearchPage() {
  const [mode, setMode] = useState<SearchMode>('database');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [initialLang, setInitialLang] = useState<'en' | 'hi'>('en');
  
  const { isLoading: areQuestionsLoading, findBestMatch } = useAppContext();
  const CurrentModeIcon = modeConfig[mode].icon;

  const handleSearch = (query: string) => {
    const result = findBestMatch(query);
    if (result) {
      setActiveQuestion(result.question);
      setInitialLang(detectLanguage(query));
    } else {
      setActiveQuestion(null);
    }
  };

  const handleBackToSearch = () => {
    setActiveQuestion(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <Button variant="ghost" asChild className="self-start">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
        <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
          <Button
            variant={mode === 'database' ? 'default' : 'ghost'}
            onClick={() => setMode('database')}
            className={`flex-1 justify-center ${mode === 'database' ? 'bg-foreground text-background' : ''}`}
          >
            <Database className="mr-2 h-4 w-4" /> Database
          </Button>
          <Button variant="ghost" disabled>
            <Sparkles className="mr-2 h-4 w-4" /> AI Expert
          </Button>
          <Button variant="ghost" disabled>
            <Layers className="mr-2 h-4 w-4" /> Hybrid
          </Button>
        </div>
        <div className="hidden lg:block">
            <Logo />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        {areQuestionsLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Preparing the knowledge base...</p>
          </div>
        ) : activeQuestion ? (
          <div className="w-full">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 -mx-4 -mt-8 mb-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                    <Button variant="ghost" onClick={handleBackToSearch}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Search
                    </Button>
                    <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mode:</span>
                    <span className="font-semibold text-sm py-1 px-2.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Database
                    </span>
                    </div>
                </div>
            </header>
            <AnswerCard question={activeQuestion} initialLang={initialLang} />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10`}>
                <CurrentModeIcon className={`h-10 w-10 ${modeConfig[mode].color}`} />
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold mb-2">{modeConfig[mode].title}</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                {modeConfig[mode].description}
            </p>
          </div>
        )}
      </main>

      {!areQuestionsLoading && (
        <footer className="sticky bottom-0 z-10 bg-transparent py-4">
          <div className="container mx-auto max-w-2xl">
            <SearchForm
              onSearch={handleSearch}
              initialQuery={activeQuestion ? activeQuestion[`question_${initialLang}`] : ''}
              className="shadow-lg"
            />
          </div>
        </footer>
      )}
    </div>
  );
}
