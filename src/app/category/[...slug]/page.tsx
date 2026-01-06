
'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { AnswerCard } from '@/components/answer-card';
import { Loader2, ArrowLeft, AlertCircle, ChevronRight, Folder, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import type { Question } from '@/types';
import { Card } from '@/components/ui/card';

// Helper function to get unique values for a specific level, respecting parent filters
const getUniqueValuesForLevel = (questions: Question[], levelKey: keyof Question, parentFilters: Record<string, string>): string[] => {
  const filtered = questions.filter(q => 
    Object.entries(parentFilters).every(([filterKey, filterValue]) => {
      const questionValue = q[filterKey as keyof Question];
      return Array.isArray(questionValue) 
        ? (questionValue as string[]).includes(filterValue)
        : questionValue === filterValue;
    })
  );
  
  const values = new Set<string>();
  filtered.forEach(q => {
    const value = q[levelKey];
    if (typeof value === 'string' && value) {
      values.add(value);
    } else if (Array.isArray(value)) {
      value.forEach(v => v && values.add(v));
    }
  });

  return [...values].sort((a, b) => a.localeCompare(b));
};


export default function CategoryHierarchyPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const { questions, areQuestionsLoading } = useAppContext();

  const decodedSlug = useMemo(() => (Array.isArray(slug) ? slug.map(s => decodeURIComponent(s)) : [decodeURIComponent(slug as string)]), [slug]);
  
  const currentPathParts = decodedSlug;
  const [primaryDomain, module, section, topic] = currentPathParts;

  const breadcrumbs = useMemo(() => {
    let path = '/category';
    const crumbs = currentPathParts.map(part => {
      path += `/${encodeURIComponent(part)}`;
      return { name: part, href: path };
    });
    return crumbs;
  }, [currentPathParts]);

  const { currentLevel, items, filteredQuestions } = useMemo(() => {
    if (areQuestionsLoading) {
      return { currentLevel: 'loading', items: [], filteredQuestions: [] };
    }

    const filters: Record<string, string> = {};
    let nextLevelKey: keyof Question | null = null;
    let items: string[] = [];
    let filteredQuestions: Question[] = [];
    let currentLevel: 'modules' | 'sections' | 'topics' | 'questions' = 'modules';

    if (primaryDomain) filters.primaryDomain = primaryDomain;

    if (!module) {
      currentLevel = 'modules';
      nextLevelKey = 'module';
      items = ['All Questions', ...getUniqueValuesForLevel(questions, nextLevelKey, filters)];
    } else if (module && !section) {
       if (module.toLowerCase() === 'all questions') {
         currentLevel = 'questions';
         filteredQuestions = questions.filter(q => q.primaryDomain === primaryDomain).sort((a,b) => (a.order || 0) - (b.order || 0));
       } else {
        filters.module = module;
        currentLevel = 'sections';
        nextLevelKey = 'section';
        items = getUniqueValuesForLevel(questions, nextLevelKey, filters);
       }
    } else if (section && !topic) {
        filters.module = module;
        filters.section = section;
        currentLevel = 'topics';
        nextLevelKey = 'topic';
        items = getUniqueValuesForLevel(questions, nextLevelKey, filters);
    } else {
        currentLevel = 'questions';
        filters.module = module;
        filters.section = section;
        if (topic) filters.topic = topic;
        
        filteredQuestions = questions.filter(q =>
            Object.entries(filters).every(([key, value]) => q[key as keyof Question] === value)
        ).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    // If we are at a listing level (modules, sections, topics) but there are no sub-items,
    // we should show the questions for the current level instead.
    if (items.length === 0 && currentLevel !== 'questions' && currentLevel !== 'loading') {
        currentLevel = 'questions';
        filteredQuestions = questions.filter(q =>
            Object.entries(filters).every(([key, value]) => q[key as keyof Question] === value)
        ).sort((a, b) => (a.order || 0) - (b.order || 0));
    }


    return { currentLevel, items, filteredQuestions };

  }, [decodedSlug, questions, areQuestionsLoading, primaryDomain, module, section, topic]);

  if (areQuestionsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Loading Knowledge Base...</h2>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  const renderList = (title: string, listItems: string[]) => {
    const Icon = currentLevel === 'modules' ? Folder : 
                 currentLevel === 'sections' ? Folder : 
                 FileText;
    return (
        <>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon className="h-6 w-6 text-primary" />
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listItems.map(item => (
                    <Link key={item} href={`/category/${currentPathParts.join('/')}/${encodeURIComponent(item)}`} className="group">
                        <Card className="hover:border-primary/40 transition-all shadow-sm hover:shadow-md border-border h-full bg-card">
                            <div className="p-4 flex items-center justify-between">
                                <span className="font-semibold text-slate-700">{item}</span>
                                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
  }

  const getPageTitle = () => {
    switch(currentLevel) {
      case 'modules': return `Modules in ${primaryDomain}`;
      case 'sections': return `Sections in ${module}`;
      case 'topics': return `Topics in ${section}`;
      case 'questions': return `Questions`;
      default: return 'Browse';
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-slate-500 self-start sm:self-center ml-10 sm:ml-0 overflow-x-auto whitespace-nowrap py-1">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.name}>
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.name}
                </Link>
                {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-slate-50">
        <div className="container mx-auto p-4 space-y-6">
          {currentLevel !== 'questions' && items.length > 0 && renderList(getPageTitle(), items)}
          
          {currentLevel === 'questions' && (
            <>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(question => (
                  <AnswerCard key={question.id} question={question} initialLang={'hi'} />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mt-8">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Questions Found</h3>
                  <p className="text-slate-500">
                    There are currently no questions available for this selection.
                  </p>
                </div>
              )}
            </>
          )}

          {currentLevel !== 'questions' && items.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mt-8">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Content Found</h3>
                <p className="text-slate-500">
                  There are currently no sub-categories available here.
                </p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}

    