"use client";

import { useState } from 'react';
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

interface AnswerCardProps {
  question: Question;
  initialLang: 'en' | 'hi';
}

export function AnswerCard({ question, initialLang }: AnswerCardProps) {
  const [lang, setLang] = useState<'en' | 'hi'>(initialLang);

  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const difficultyColors = {
    easy: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    medium: 'bg-orange-100 text-orange-800 border-orange-300',
    hard: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge
            variant="outline"
            className={`uppercase ${difficultyColors[question.difficulty]}`}
          >
            {question.difficulty}
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20">{question.category}</Badge>
        </div>
        <CardTitle className="font-headline text-3xl mb-2">
          {question[`question_${lang}`]}
        </CardTitle>
        <div className="flex justify-between items-center">
          <Button variant="link" onClick={toggleLanguage} className="p-0 h-auto">
            {lang === 'en' ? 'Switch to Hinglish' : 'Switch to English'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
            Quick Answer
          </h3>
          <p className="text-lg leading-relaxed">
            {question[`shortAnswer_${lang}`]}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-sm font-semibold uppercase text-green-800 dark:text-green-300 mb-4">
            Key Takeaways
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {question[`summaryPoints_${lang}`].map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-semibold uppercase text-muted-foreground">
              Detailed Explanation
            </AccordionTrigger>
            <AccordionContent className="prose prose-lg dark:prose-invert max-w-none pt-4 text-foreground/80">
              {question[`longAnswer_${lang}`].split('\n').map((para, i) => <p key={i}>{para}</p>)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
         <p className="text-sm text-muted-foreground">Was this helpful?</p>
         <div className="flex gap-2">
            <Button variant="outline"><ThumbsUp className="mr-2 h-4 w-4"/> Yes</Button>
            <Button variant="outline"><ThumbsDown className="mr-2 h-4 w-4"/> No</Button>
         </div>
      </CardFooter>
    </Card>
  );
}
