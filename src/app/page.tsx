
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TrendingUp, ChevronRight, Crown, Sparkles, Bot, ChevronsRight } from 'lucide-react';
import { Logo } from '@/components/logo';

const categories = [
  {
    name: 'Welding',
    questions: '150+ Questions',
    href: '/search?category=Welding',
  },
  {
    name: 'NDT',
    questions: '120+ Questions',
    href: '/search?category=NDT',
  },
  {
    name: 'Piping',
    questions: '200+ Questions',
    href: '/search?category=Piping',
  },
  {
    name: 'Coating',
    questions: '80+ Questions',
    href: '/search?category=Coating',
  },
];

const trendingQuestions = [
    { text: 'What is the difference between WPS and PQR?' },
    { text: 'Explain the acceptance criteria for Undercut in ASME B31.3' },
    { text: 'What are the safety precautions for Radiography testing?' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <Button variant="outline" size="sm">Sign In</Button>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <section className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                The Ultimate QA/QC Interview Companion
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Master Your Oil & Gas Inspection Career</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">Stop searching, start preparing. Your complete guide to acing QA/QC interviews, powered by expert knowledge and AI.</p>
            <div className="flex justify-center items-center gap-4">
                <Button size="lg" asChild>
                   <Link href="/search">Start Interview Prep <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-muted-foreground">Learn More</Button>
            </div>
        </section>

        <section className="mb-16">
          <Card className="bg-slate-900 text-white border-slate-700 overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    PREMIUM
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Unlock the Interview Simulator</h3>
                <p className="text-slate-400 mb-6">Practice with real-time AI voice interviews, get performance scoring, and access offline mode.</p>
                <Button className="bg-white text-slate-900 hover:bg-slate-200 font-bold">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade Now
                </Button>
              </div>
              <div className="bg-slate-800 h-full hidden md:flex items-center justify-center p-8">
                  <Bot className="h-32 w-32 text-slate-600" />
              </div>
            </div>
          </Card>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                    Browse Categories
                    </h2>
                    <Link href="/search" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                    View All <ChevronsRight className="h-4 w-4"/>
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                    <Link href={category.href} key={category.name}>
                        <Card className="hover:border-primary/50 hover:bg-primary/5 transition-all h-full">
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-1">{category.name}</h3>
                                <p className="text-xs text-muted-foreground">{category.questions}</p>
                            </CardContent>
                        </Card>
                    </Link>
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
                Trending Questions
                </h2>
                <Card>
                    <ul className="divide-y">
                        {trendingQuestions.map((q, index) => (
                            <li key={index} className="p-3 flex justify-between items-center hover:bg-secondary/30">
                                <span className="text-sm font-medium pr-4">{q.text}</span>
                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </li>
                        ))}
                    </ul>
                </Card>
            </section>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm border-t mt-16">
          &copy; {new Date().getFullYear()} XtudyAI. All rights reserved.
      </footer>
    </div>
  );
}
