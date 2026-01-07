
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
const getUniqueValuesForLevel = (
  questions: Question[],
  levelKey: keyof Question,
  parentFilters: Record<string, string>
): { name: string, order: number }[] => {
  const filtered = questions.filter(q =>
    Object.entries(parentFilters).every(([filterKey, filterValue]) => {
      const questionValue = q[filterKey as keyof Question];
      // Handle array categories if needed, though hierarchy fields are likely strings
      if (Array.isArray(questionValue)) {
        return (questionValue as string[]).includes(filterValue);
      }
      return String(questionValue) === filterValue;
    })
  );

  const values = new Map<string, number>();
  filtered.forEach(q => {
    const value = q[levelKey];
    const order = q.order || 9999;
    if (typeof value === 'string' && value) {
      if (!values.has(value) || (values.get(value) ?? 9999) > order) {
        values.set(value, order);
      }
    } else if (Array.isArray(value)) {
      value.forEach(v => {
        if (v && (!values.has(v) || (values.get(v) ?? 9999) > order)) {
            values.set(v, order);
        }
      });
    }
  });

  // Sort values based on the associated order, then alphabetically
  return [...values.entries()]
    .map(([name, order]) => ({ name, order }))
    .sort((a, b) => {
        if (a.order !== b.order) {
            return a.order - b.order;
        }
        return a.name.localeCompare(b.name);
    });
};

const HIERARCHY_KEYS: (keyof Question)[] = ['primaryDomain', 'module', 'section'];

export default function CategoryHierarchyPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const { questions, areQuestionsLoading } = useAppContext();

  const decodedSlug = useMemo(() => (Array.isArray(slug) ? slug.map(s => decodeURIComponent(s)) : [decodeURIComponent(slug as string)]), [slug]);
  
  const currentPathParts = decodedSlug;
  const currentLevelIndex = currentPathParts.length;

  const breadcrumbs = useMemo(() => {
    let path = '/category';
    const crumbs = [{ name: 'Categories', href: '/#categories' }, ...currentPathParts.map(part => {
      path += `/${encodeURIComponent(part)}`;
      return { name: part, href: path };
    })];
    return crumbs;
  }, [currentPathParts]);

  const { items, filteredQuestions, pageTitle } = useMemo(() => {
    if (areQuestionsLoading) {
      return { items: [], filteredQuestions: [], pageTitle: 'Loading...' };
    }

    const filters: Record<string, string> = {};
    currentPathParts.forEach((part, index) => {
      const key = HIERARCHY_KEYS[index];
      if (key) {
        filters[key] = part;
      }
    });

    let finalQuestions: Question[] = [];
    let listItems: { name: string, order: number }[] = [];
    
    const currentFilterKey = HIERARCHY_KEYS[currentLevelIndex - 1];
    const currentFilterValue = currentPathParts[currentLevelIndex - 1];
    const title = currentFilterValue || 'Browse';

    // Special case for "All Questions" module
    if (currentFilterValue?.toLowerCase() === 'all questions' && currentFilterKey === 'module') {
        const domainFilter = { primaryDomain: filters.primaryDomain };
        finalQuestions = questions.filter(q => q.primaryDomain === domainFilter.primaryDomain)
                                  .sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
        const nextLevelKey = HIERARCHY_KEYS[currentLevelIndex];
        if (nextLevelKey) {
            listItems = getUniqueValuesForLevel(questions, nextLevelKey, filters);
        }

        // If there are no more sub-levels or no items in the next level, show questions
        if (!nextLevelKey || listItems.length === 0) {
            finalQuestions = questions.filter(q =>
                Object.entries(filters).every(([key, value]) => {
                  const qValue = q[key as keyof Question];
                  return Array.isArray(qValue) ? qValue.includes(value) : String(qValue) === value;
                })
            ).sort((a, b) => (a.order || 0) - (b.order || 0));
        }

        // Add "All Questions" option and apply custom sort at the module level
        if (currentLevelIndex === 1) {
            if (!listItems.some(item => item.name.toLowerCase() === 'all questions')) {
                listItems.unshift({ name: 'All Questions', order: -Infinity });
            }

            const customOrder = [
                'all questions',
                'introduction',
                'ultrasonic testing (ut)',
                'magnetic particle testing (mpt)',
                'dye penetrant testing (dpt)',
                'radiographic testing (rt)',
            ];
            
            listItems.sort((a, b) => {
                const aNameLower = a.name.toLowerCase();
                const bNameLower = b.name.toLowerCase();
                const aIndex = customOrder.indexOf(aNameLower);
                const bIndex = customOrder.indexOf(bNameLower);

                if (aIndex !== -1 && bIndex !== -1) {
                    return aIndex - bIndex; // Both are in custom order
                }
                if (aIndex !== -1) {
                    return -1; // a is in custom order, b is not
                }
                if (bIndex !== -1) {
                    return 1; // b is in custom order, a is not
                }
                // Neither are in custom order, sort alphabetically
                return a.name.localeCompare(b.name);
            });
        }
    }

    return { items: listItems, filteredQuestions: finalQuestions, pageTitle: title };

  }, [decodedSlug, questions, areQuestionsLoading, currentLevelIndex]);

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

  const renderList = (title: string, listItems: {name: string}[]) => {
    const Icon = Folder;
    return (
        <>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Icon className="h-6 w-6 text-primary" />
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listItems.map(item => (
                    <Link key={item.name} href={`/category/${currentPathParts.join('/')}/${encodeURIComponent(item.name)}`} className="group">
                        <Card className="hover:border-primary/40 transition-all shadow-sm hover:shadow-md border-border h-full bg-card">
                            <div className="p-4 flex items-center justify-between">
                                <span className="font-semibold text-slate-700">{item.name}</span>
                                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
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
          {items.length > 0 && renderList(pageTitle, items)}
          
          {filteredQuestions.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{pageTitle}</h2>
              {filteredQuestions.map(question => (
                <AnswerCard key={question.id} question={question} initialLang={'hi'} />
              ))}
            </>
          )}

          {items.length === 0 && filteredQuestions.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center mt-8">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Content Found</h3>
                <p className="text-slate-500">
                  There are currently no sub-categories or questions available here.
                </p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}
