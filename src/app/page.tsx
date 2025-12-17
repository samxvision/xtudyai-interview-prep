import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Search } from 'lucide-react';
import { Logo } from '@/components/logo';

const categories = [
  { name: 'Welding', count: '150+' },
  { name: 'NDT', count: '200+' },
  { name: 'Piping', count: '180+' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-start">
        <Logo />
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="container px-4 text-center">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3B82F6] to-[#9333EA] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
            </div>

            <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Master Your QA/QC Career
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                The ultimate companion for Oil & Gas inspection professionals.
                AI-powered interview preparation to help you land your dream job.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg">
                  <Link href="/search">
                    <Search className="mr-2" />
                    Start Interview Prep
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto py-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.name} className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary p-3 rounded-lg">
                        <Database className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="font-headline">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{category.count} Questions</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
