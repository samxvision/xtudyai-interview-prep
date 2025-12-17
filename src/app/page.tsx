
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Flame, ScanLine, Search, Bot } from 'lucide-react';
import { Logo } from '@/components/logo';

const features = [
  { 
    name: 'Welding', 
    description: 'Master welding techniques and standards with over 150+ targeted questions.',
    icon: Flame,
    href: '/search?category=Welding',
  },
  { 
    name: 'NDT', 
    description: 'Excel in Non-Destructive Testing with a bank of 200+ expert-curated questions.',
    icon: ScanLine,
    href: '/search?category=NDT',
  },
  { 
    name: 'Piping', 
    description: 'Deepen your piping knowledge. Explore 180+ questions on design, inspection, and more.',
    icon: Bot, // Using Bot as a placeholder for Piping
    href: '/search?category=Piping',
  },
];

const keyBenefits = [
  "AI-Powered Mock Interviews",
  "Huge Question Bank",
  "Multi-Language Support (English & Hinglish)",
  "Detailed, Expert-Vetted Answers"
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between">
          <Logo />
          <Button asChild>
            <Link href="/search">
              Start Prep <Search className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
           <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
             <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C4D8FB,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3B82F622,transparent)]"></div>
           </div>

          <div className="container max-w-7xl py-20 lg:py-32">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-center text-center lg:text-left">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Your AI Co-Pilot for QA/QC Interview Success
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  The ultimate companion for Oil & Gas inspection professionals. AI-powered interview prep to help you land your dream job.
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Button asChild size="lg">
                    <Link href="/search">
                      <Search className="mr-2" />
                      Start Interview Prep
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#features">
                      Learn More
                    </Link>
                  </Button>
                </div>
                 <ul className="mt-8 flex flex-col items-center gap-x-6 gap-y-2 text-muted-foreground sm:flex-row sm:justify-center lg:justify-start">
                    {keyBenefits.slice(0,2).map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {benefit}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="flex items-center justify-center">
                 <div className="relative w-full max-w-md">
                   <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-primary/50 to-accent/50 opacity-20 blur-2xl"></div>
                   <Image
                      src="https://picsum.photos/seed/interview-prep/600/400"
                      alt="AI helping with interview preparation"
                      width={600}
                      height={400}
                      className="relative rounded-2xl border border-border/20 shadow-2xl shadow-primary/20"
                      data-ai-hint="AI assistant interview"
                    />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-secondary/50">
          <div className="container max-w-7xl">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold sm:text-4xl">All The Tools You Need</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                In-depth questions across critical QA/QC disciplines.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.name} className="flex flex-col text-left shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{feature.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                     <p className="text-muted-foreground flex-grow">{feature.description}</p>
                     <Button asChild variant="outline" className="mt-6 w-fit">
                        <Link href={feature.href}>
                          Explore {feature.name}
                        </Link>
                     </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 bg-background">
          <div className="container text-center text-muted-foreground text-sm">
             &copy; {new Date().getFullYear()} XtudyAI. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
