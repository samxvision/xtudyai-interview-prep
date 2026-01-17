
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TrendingUp, ChevronRight, Crown, Sparkles, Menu, User, MessageSquare, Loader2, BrainCircuit, Voicemail, Briefcase, SquareRadical, Lock } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAppContext } from '@/context/AppContext';
import type { Question } from '@/types';
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebase } from '@/firebase/provider';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const categoryConfig = [
  {
    name: 'Welding',
    description: 'SMAW, GTAW, defects, and inspection criteria.',
    href: '/category/Welding',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100"><svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5416 11.25C14.5416 13.79 12.5416 15.872 10.1382 16.216C9.96039 16.24 9.77639 16.25 9.58333 16.25C6.93333 16.25 4.79167 14.1083 4.79167 11.4583C4.79167 9.54167 6.01667 7.94167 7.63333 7.25833C7.63333 7.25833 7.85833 6.025 8.75 5.13333C9.46864 4.41469 10.5183 4.36449 11.2833 5C12.3 5.83333 12.125 7.29167 12.125 7.29167C13.55 7.725 14.5416 9.35 14.5416 11.25Z" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.91669 16.25C7.31484 15.3503 6.94042 14.288 6.84169 13.125" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.9167 12.0833C13.5417 10.6667 13.3333 9 12.125 7.29167" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
    glowColor: 'bg-orange-500/10',
  },
  {
    name: 'NDT',
    description: 'RT, UT, PT, MT methods and interpretation.',
    href: '/category/NDT',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100"><svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9667 10.4167C14.7167 10.4167 16.1333 8.99167 16.1333 7.25C16.1333 5.50833 14.7167 4.08333 12.9667 4.08333C11.225 4.08333 9.8 5.50833 9.8 7.25C9.8 8.99167 11.225 10.4167 12.9667 10.4167Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.84167 11.0583L8.65833 12.2417C6.70833 14.1917 6.70833 17.225 8.65833 19.175C10.6083 21.125 13.6417 21.125 15.5917 19.175L16.775 18C17.55 17.225 17.55 16 16.775 15.225L15.225 13.675C14.45 12.9 13.225 12.9 12.45 13.675L11.0583 15.0667" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.80005 9.80005L1.66675 1.66675" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.75 1.66667H1.66667V3.75" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
    glowColor: 'bg-purple-500/10',
  },
  {
    name: 'Piping',
    description: 'Codes (ASME B31.3), materials, and pressure testing.',
    href: '/category/Piping',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-100"><svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33331 11.6667L7.49998 7.5L12.5 12.5L16.6666 8.33334" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.5 8.33334H16.6667V12.5" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
    glowColor: 'bg-cyan-500/10',
  },
  {
    name: 'Coating',
    description: 'Surface prep, application, and holiday testing.',
    href: '/category/Coating',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-100"><svg width="24" height="24" viewBox="0.0 0.0 20.0 20.0" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="none"><path d="M10 20C12.7614 20 15 17.7614 15 15C15 12.2386 12.7614 10 10 10C7.23858 10 5 12.2386 5 15C5 17.7614 7.23858 20 10 20Z" fill="#10B981" fillOpacity="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"/><path d="M4.31641 15.6836C2.93512 14.3023 2.57812 12.1602 3.42773 10.5L9.5 0L15.5723 10.5C16.4219 12.1602 16.0648 14.3023 14.6836 15.6836C13.3023 17.0648 11.1602 17.4219 9.5 16.5723L9.5 16.5723C8.83984 17.4219 7.69766 17.7793 6.31641 17.0648C5.65625 16.7078 5.09961 16.2051 4.31641 15.6836Z" fill="#10B981" fillOpacity="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"/></svg></div>,
    glowColor: 'bg-green-500/10',
  },
  {
    name: 'Heat Exchanger',
    description: 'Types, components, and inspection of heat exchangers.',
    href: '/category/Heat%20Exchanger',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-100"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 12H10" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 10V14" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#F87171" strokeWidth="1.5"/><path d="M18 18L21 21" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 18L3 21" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 6L21 3" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6L3 3" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
    glowColor: 'bg-red-500/10',
  },
  {
    name: 'Pressure Vessels',
    description: 'Design, codes, and testing of pressure vessels.',
    href: '/category/Pressure%20Vessels',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 12H8.5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8.5V15.5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#60A5FA" strokeWidth="1.5"/><path d="M22 12H2" stroke="#60A5FA" strokeWidth="1.5"/></svg></div>,
    glowColor: 'bg-blue-500/10',
  },
  {
    name: 'Distillation Column',
    description: 'Trays, packing, and operational principles.',
    href: '/category/Distillation%20Column',
    Icon: () => <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-yellow-100"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V22" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 4H15" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 20H15" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 8H18" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 16H18" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12H16" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
    glowColor: 'bg-yellow-500/10',
  },
];

const premiumFeatures = [
    {
        title: "Rexo Mode",
        description: "AI-powered, on-the-spot answers.",
        Icon: BrainCircuit
    },
    {
        title: "Learning Arena",
        description: "Practice with mock tests & scenarios.",
        Icon: SquareRadical
    },
    {
        title: "Real Life Interview",
        description: "Simulate voice interviews with AI.",
        Icon: Voicemail
    },
    {
        title: "Real Work Simulator",
        description: "Solve practical, on-site problems.",
        Icon: Briefcase
    }
]

type TrendingQuestion = { rank: number; text: string };

export default function Home() {
  const { questions, areQuestionsLoading } = useAppContext();
  const [trendingQuestions, setTrendingQuestions] = useState<TrendingQuestion[]>([]);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const { openAuthDialog } = useAuthContext();
  const router = useRouter();


  useEffect(() => {
    if (!areQuestionsLoading && questions.length > 0) {
      // Select 4 random questions for trending
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const randomQuestions = shuffled.slice(0, 4).map((q, index) => ({
        rank: index + 1,
        text: q.question_en, // Or q.question_hi
      }));
      setTrendingQuestions(randomQuestions);
    }
  }, [areQuestionsLoading, questions]);


  const getCategoryCount = (categoryName: string) => {
    if (!questions || questions.length === 0) return 0;
    
    const lowerCaseCategoryName = categoryName.toLowerCase();
    
    return questions.filter(q => {
      if (!q.category) return false;
      
      let questionCategories: string[] = [];
      if (typeof q.category === 'string') {
        questionCategories = q.category.split(',').map(c => c.trim().toLowerCase());
      } else if (Array.isArray(q.category)) {
        questionCategories = q.category.map(c => String(c).trim().toLowerCase());
      }
      
      return questionCategories.includes(lowerCaseCategoryName);
    }).length;
  };

  const handleProtectedClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUserLoading) return; // Do nothing if auth state is loading

    if (user) {
      router.push(href);
    } else {
      openAuthDialog(href);
    }
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

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : <User className="h-5 w-5" />;
  const userAvatar = user?.photoURL;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-600">
                <Menu className="h-6 w-6" />
            </Button>
             { user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="rounded-full">
                             <Avatar className="h-9 w-9">
                                <AvatarImage src={userAvatar || ''} alt={user.displayName || ''} />
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{user.isAnonymous ? 'Guest User' : user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                        <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => auth.signOut()}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button variant="ghost" size="icon" className="text-slate-600" onClick={handleProtectedClick('/')}>
                    <User className="h-6 w-6" />
                </Button>
            )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3 text-foreground">Master Your <span className="text-primary">QA/QC</span> Career</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">The ultimate companion for Oil & Gas inspection professionals.</p>
        </section>

        <section className="mb-6" onClick={handleProtectedClick('/search')}>
             <div className="cursor-pointer">
                <Card className="hover:border-primary/40 transition-all shadow-sm hover:shadow-md border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-100 text-primary">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-foreground">Start Interview Prep</p>
                            <p className="text-sm text-muted-foreground">Practice with Database & AI modes</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 ml-auto" />
                    </CardContent>
                </Card>
            </div>
        </section>
        
        <section className="mb-10">
            <Card className="bg-slate-900 text-white border-slate-700 overflow-hidden shadow-lg">
                <div className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        PREMIUM
                        </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-1">Unlock Interview Simulator</h3>
                    <p className="text-slate-400 mb-4 text-sm">Practice with real-time AI voice interviews, get performance scoring, and access offline mode.</p>
                    <Button
                      className="bg-white text-slate-900 hover:bg-slate-200 font-bold w-full sm:w-auto"
                      onClick={() => {
                        toast({
                          title: 'Pro features not available',
                          description:
                            'Our team is working on it and it will be available in future.',
                        });
                      }}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                </div>
            </Card>
        </section>

        <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {premiumFeatures.map((feature) => (
                    <Card key={feature.title} className="bg-card border-border shadow-sm">
                        <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-primary" />
                                        <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground pl-6">{feature.description}</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap text-amber-600 border-amber-500/30 bg-amber-500/10">
                                    Coming Soon
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                Browse Categories
                </h2>
                <div onClick={handleProtectedClick('/search')} className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                    View All
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryConfig.map((category) => {
                  const count = getCategoryCount(category.name);
                  return (
                    <div onClick={handleProtectedClick(category.href)} key={category.name} className="group cursor-pointer">
                        <Card className="hover:border-primary/40 transition-all shadow-sm hover:shadow-md border-border h-full relative overflow-hidden bg-card">
                            <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${category.glowColor} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                            <CardContent className="p-4 flex items-start gap-3">
                                <category.Icon />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base mb-1">{category.name}</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
                                    <p className="text-xs text-slate-400 mt-2">{count > 0 ? `${count} Questions` : 'Coming Soon'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                  );
                })}
            </div>
        </section>
        
        <section>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Trending Questions
            </h2>
            <Card className="shadow-sm border-border bg-card">
                <ul className="divide-y divide-border">
                    {trendingQuestions.map((q) => (
                        <li key={q.rank} className="p-3 md:p-4 flex items-center gap-4 hover:bg-secondary/50 cursor-pointer">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex-shrink-0">{q.rank}</div>
                            <span className="text-sm font-medium text-foreground flex-grow">{q.text}</span>
                            <Sparkles className="h-5 w-5 text-primary/50 flex-shrink-0" />
                        </li>
                    ))}
                </ul>
            </Card>
        </section>
      </main>
    </div>
  );
}

    

    

    