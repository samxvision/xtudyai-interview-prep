"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { AnswerCard } from '@/components/answer-card';
import { SearchForm } from '@/components/search-form';
import type { Question } from '@/types';
import { notFound } from 'next/navigation';

export default function AnswerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { getQuestionById, isLoading } = useAppContext();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [initialLang, setInitialLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    if (params.id && !isLoading) {
      const foundQuestion = getQuestionById(params.id as string);
      if (foundQuestion) {
        setQuestion(foundQuestion as Question);
        const langParam = searchParams.get('lang');
        if (langParam === 'hi' || langParam === 'en') {
          setInitialLang(langParam);
        }
      } else {
        notFound();
      }
    }
  }, [params.id, getQuestionById, isLoading, searchParams]);

  if (isLoading || !question) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/search">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <span className="font-semibold text-sm py-1 px-2.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Database
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-4">
        <AnswerCard question={question} initialLang={initialLang} />
      </main>

      <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-t">
        <div className="container mx-auto max-w-2xl">
          <p className="text-sm font-semibold text-center mb-2">Ask another question</p>
          <SearchForm 
            initialQuery={question[`question_${initialLang}`]} 
            isFixed={true} 
          />
        </div>
      </footer>
    </div>
  );
}
