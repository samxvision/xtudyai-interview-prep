"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Sparkles, Layers, Loader2 } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { useAppContext } from '@/context/AppContext';
import { Logo } from '@/components/logo';

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
  const { isLoading: areQuestionsLoading } = useAppContext();
  const CurrentModeIcon = modeConfig[mode].icon;

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

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        {areQuestionsLoading ? (
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Preparing the knowledge base...</p>
            </div>
        ) : (
            <>
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10`}>
                    <CurrentModeIcon className={`h-10 w-10 ${modeConfig[mode].color}`} />
                </div>
                <h1 className="font-headline text-3xl sm:text-4xl font-bold mb-2">{modeConfig[mode].title}</h1>
                <p className="text-muted-foreground max-w-md mb-8">
                    {modeConfig[mode].description}
                </p>
                <SearchForm className="w-full max-w-2xl shadow-lg" />
            </>
        )}
      </main>
    </div>
  );
}
