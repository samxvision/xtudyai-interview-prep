
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { AnswerCard } from '@/components/answer-card';
import { Loader2, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import type { Question } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const { categoryName: encodedCategoryName } = params;
  const categoryName = decodeURIComponent(encodedCategoryName as string);

  const { questions, areQuestionsLoading } = useAppContext();
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [uiLanguage, setUiLanguage] = useState<'en' | 'hi'>('hi');

  useEffect(() => {
    if (!areQuestionsLoading && questions.length > 0) {
      const filtered = questions.filter(q => 
        q.category && typeof q.category === 'string' && q.category.toLowerCase().split(',').map(c => c.trim()).includes(categoryName.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  }, [categoryName, questions, areQuestionsLoading]);

  if (areQuestionsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Loading Questions...</h2>
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
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpen className="h-5 w-5" />
            <span>{categoryName}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-slate-50">
        <div className="container mx-auto p-4 space-y-6">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map(question => (
              <AnswerCard key={question.id} question={question} initialLang={uiLanguage} />
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mt-8">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Questions Found</h3>
              <p className="text-slate-500">
                There are currently no questions available for the "{categoryName}" category.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

    