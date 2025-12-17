
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, User, MessageSquare, BookOpen, Sparkles, TrendingUp, ChevronRight, Crown } from 'lucide-react';
import { Logo } from '@/components/logo';

const categories = [
  {
    name: 'Welding',
    description: 'SMAW, GTAW, defects, and inspection criteria.',
    questions: '150+ Questions',
    href: '/search?category=Welding',
    icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12C22 10.1667 21.3333 8.83333 20 8C20 6.5 18.5 4 16.5 2.5C14.5 1 12.5 0 10.5 0C8.5 0 6.5 1 4.5 2.5C2.5 4 1 6.5 1 8H2.8C3.2 7.13333 3.86667 6.46667 4.8 6C5.73333 5.53333 6.6 5.3 7.4 5.3C8.2 5.3 9.06667 5.53333 10 6C10.9333 6.46667 11.6 7.13333 12 8H20C18.6667 8.83333 18 10.1667 18 12H22ZM12 10C11.3333 10 10.7083 9.854 10.125 9.562C9.54167 9.27 9.08333 8.79167 8.75 8.125C8.08333 8.625 7.54167 9.20833 7.125 9.875C6.70833 10.5417 6.5 11.25 6.5 12H17.5C17.5 11.25 17.2917 10.5417 16.875 9.875C16.4583 9.20833 15.9167 8.625 15.25 8.125C14.9167 8.79167 14.4583 9.27 13.875 9.562C13.2917 9.854 12.6667 10 12 10ZM7 24C5.33333 24 4.04167 23.646 3.125 22.938C2.20833 22.23 1.75 21.3333 1.75 20.25V17H10V24H7ZM12 24V17H22.25V20.25C22.25 21.3333 21.7917 22.23 21.875 22.938C21.9583 23.646 20.6667 24 19 24H12Z" fill="#FF5722"/></svg>,
    bgColor: 'bg-orange-50',
    circleColor: 'bg-orange-100',
  },
  {
    name: 'NDT',
    description: 'RT, UT, PT, MT methods and interpretation.',
    questions: '120+ Questions',
    href: '/search?category=NDT',
    icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10 17L15 12L10 7V17Z" fill="#8A2BE2"/></svg>,
    bgColor: 'bg-purple-50',
    circleColor: 'bg-purple-100',
  },
  {
    name: 'Piping',
    description: 'Codes (ASME B31.3), materials, and pressure testing.',
    questions: '200+ Questions',
    href: '/search?category=Piping',
    icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21H5V3H3ZM8 3V21H10V3H8ZM13 3V21H15V3H13ZM18 3V21H20V3H18Z" fill="#3385FF"/></svg>,
    bgColor: 'bg-blue-50',
    circleColor: 'bg-blue-100',
  },
  {
    name: 'Coating',
    description: 'Surface prep, application, and holiday testing.',
    questions: '80+ Questions',
    href: '/search?category=Coating',
    icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#4CAF50"/></svg>,
    bgColor: 'bg-green-50',
    circleColor: 'bg-green-100',
  },
];

const trendingQuestions = [
    { text: 'What is the difference between WPS and PQR?' },
    { text: 'Explain the acceptance criteria for Undercut in ASME B31.3' },
    { text: 'What are the safety precautions for Radiography testing?' },
    { text: 'How to identify electrode classification numbers?' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Master Your QA/QC Career</h1>
          <p className="text-muted-foreground text-lg">The ultimate companion for Oil & Gas inspection professionals.</p>
        </section>

        <section className="mb-12 space-y-4">
          <Link href="/search" passHref>
            <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">Start Interview Prep</h3>
                  <p className="text-sm text-muted-foreground">Practice with Database & AI modes</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          
          <Card className="bg-slate-900 text-white border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  PREMIUM
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Unlock Interview Simulator</h3>
              <p className="text-slate-400 mb-4 text-sm">Practice with real-time AI voice interviews, get performance scoring, and access offline mode.</p>
              <Button className="bg-white text-slate-900 hover:bg-slate-200 w-full font-bold">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              Browse Categories
            </h2>
            <Link href="/search" className="text-sm font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link href={category.href} key={category.name}>
                 <Card className={`relative overflow-hidden hover:shadow-md transition-shadow ${category.bgColor}`}>
                    <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${category.circleColor}`}></div>
                    <CardContent className="p-4 relative">
                      <div className="mb-3 h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm">
                        <category.icon />
                      </div>
                      <h3 className="font-bold">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2 h-8">{category.description}</p>
                      <p className="text-xs text-muted-foreground font-semibold">{category.questions}</p>
                    </CardContent>
                 </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Trending Questions
            </h2>
            <Card>
                <ul className="divide-y">
                    {trendingQuestions.map((q, index) => (
                        <li key={index} className="p-4 flex justify-between items-center hover:bg-secondary/30">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-muted-foreground bg-secondary/80 rounded-full h-6 w-6 flex items-center justify-center">{index + 1}</span>
                                <span className="text-sm font-medium">{q.text}</span>
                            </div>
                            <Sparkles className="h-4 w-4 text-amber-400" />
                        </li>
                    ))}
                </ul>
            </Card>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} XtudyAI. All rights reserved.
      </footer>
    </div>
  );
}
