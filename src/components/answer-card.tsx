
"use client";

import { useState, useEffect } from 'react';
import type { Question } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Bookmark, Share, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import React from 'react';

interface AnswerCardProps {
  question: Question;
  initialLang: 'en' | 'hi';
}

// Simple markdown to HTML renderer
const renderMarkdown = (text: string) => {
    if (!text) return [];
    // Process bold first
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Then split into paragraphs
    const paragraphs = processedText.split('\n').filter(p => p.trim() !== '');
  
    return paragraphs.map((para, i) => (
      <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: para }} />
    ));
  };


export function AnswerCard({ question, initialLang }: AnswerCardProps) {
  const [lang, setLang] = useState<'en' | 'hi'>(initialLang);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang, question]);


  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const difficultyColors: { [key: string]: string } = {
    easy: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200', // Using same for medium
    hard: 'bg-red-100 text-red-800 border-red-200',
  };

  const categoryColors: { [key: string]: string } = {
    piping: 'bg-gray-100 text-gray-800 border-gray-200',
    welding: 'bg-gray-100 text-gray-800 border-gray-200',
    // Add other categories as needed
  };

  const getCategoryColor = (category?: string) => {
    if (typeof category === 'string') {
      return categoryColors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-slate-200 mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge
            variant="outline"
            className={`uppercase text-xs font-bold ${difficultyColors[question.difficulty] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
          >
            {question.difficulty}
          </Badge>
          <Badge 
            variant="outline"
            className={`text-xs font-bold ${getCategoryColor(question.category)}`}
          >
            {question.category || 'General'}
          </Badge>
        </div>
        <CardTitle className="font-bold text-2xl text-slate-800 mb-2">
          {question[`question_${lang}`]}
        </CardTitle>
        <div className="flex justify-between items-center">
          <Button variant="link" onClick={toggleLanguage} className="p-0 h-auto text-orange-600 font-semibold">
            {lang === 'en' ? 'Switch to Hinglish' : 'Switch to English'}
          </Button>
          <div className="flex items-center gap-1 text-slate-500">
            <Button variant="ghost" size="icon">
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">
            Quick Answer
          </h3>
          <p className="text-base leading-relaxed text-slate-700">
            {question[`shortAnswer_${lang}`]}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-xs font-bold uppercase text-green-800 mb-3">
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {question[`summaryPoints_${lang}`] && question[`summaryPoints_${lang}`].map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-base text-slate-800">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="text-xs font-bold uppercase text-slate-500 hover:no-underline py-2">
              Detailed Explanation
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-slate-700 text-base leading-relaxed">
                {renderMarkdown(question[`longAnswer_${lang}`])}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 pt-4 border-t bg-slate-50 p-4">
         <p className="text-sm text-slate-600">Was this helpful?</p>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white"><ThumbsUp className="mr-2 h-4 w-4"/> Yes</Button>
            <Button variant="outline" size="sm" className="bg-white"><ThumbsDown className="mr-2 h-4 w-4"/> No</Button>
         </div>
      </CardFooter>
    </Card>
  );
}
