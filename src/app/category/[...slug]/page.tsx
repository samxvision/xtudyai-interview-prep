
'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { AnswerCard } from '@/components/answer-card';
import { Loader2, ArrowLeft, AlertCircle, ChevronRight, Folder, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Question } from '@/types';
import { Card } from '@/components/ui/card';

// Helper to normalize strings for comparison (lowercase, trim spaces)
const normalizeValue = (value: string | undefined | null): string => {
  if (!value) return '';
  return String(value).toLowerCase().trim();
};

const NDT_SECTION_ORDER: Record<string, string[]> = {
  'dpt': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface Condition', 'Penetrant Type', 'Penetrant Removal Method', 'Sensitivity Level', 'Consumables',
    'Equipment & Tools', 'Process / Procedure', 'Process Parameters', 'Inspection Technique', 'Detectable Defects',
    'Non-Detectable Defects', 'Indication Type', 'Acceptance Criteria', 'Codes & Standards', 'Safety & Caution',
    'Common Field Mistakes', 'Advantages', 'Limitations', 'Application', 'Inspector Level Responsibility',
    'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'ut': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface Condition', 'UT Technique Type', 'Probe / Transducer Type', 'Wave Mode', 'Display / Presentation Type',
    'Equipment & Instruments', 'Consumables', 'Process / Procedure', 'Process Parameters', 'Detectable Defects',
    'Non-Detectable / Limited Detection', 'Indication Classification', 'Acceptance Criteria', 'Codes & Standards',
    'Safety & Caution', 'Common Field Mistakes', 'Advantages', 'Limitations', 'Application',
    'Inspector Level Responsibility', 'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'vt': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface Condition', 'VT Technique Type', 'Viewing Method / Access', 'Illumination Type', 'Measurement & Gauging Tools',
    'Equipment & Tools', 'Process / Procedure', 'Process Parameters', 'Inspection Stage', 'Detectable Defects',
    'Non-Detectable / Limited Detection', 'Discontinuity / Indication Type', 'Acceptance Criteria', 'Codes & Standards',
    'Safety & Caution', 'Common Field Mistakes', 'Advantages', 'Limitations', 'Application',
    'Inspector Level Responsibility', 'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'mt': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface Condition', 'Magnetization Method', 'Particle Type', 'Visibility Type', 'Current Type',
    'Equipment & Tools', 'Consumables', 'Process / Procedure', 'Process Parameters', 'Detectable Defects',
    'Non-Detectable / Limited Detection', 'Indication Type', 'Acceptance Criteria', 'Codes & Standards',
    'Safety & Caution', 'Common Field Mistakes', 'Advantages', 'Limitations', 'Application',
    'Inspector Level Responsibility', 'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'rt': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface / Access Condition', 'Radiation Source Type', 'Radiographic Technique', 'Image Recording Method',
    'Image Quality Indicators (IQI)', 'Equipment & Tools', 'Consumables', 'Process / Procedure', 'Process Parameters',
    'Detectable Defects', 'Non-Detectable / Limited Detection', 'Indication Type', 'Acceptance Criteria',
    'Codes & Standards', 'Safety & Caution', 'Common Field Mistakes', 'Advantages', 'Limitations',
    'Application', 'Inspector Level Responsibility', 'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'ect': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface Condition', 'Probe Type', 'Testing Technique', 'Frequency Selection', 'Signal Display / Presentation',
    'Equipment & Instruments', 'Consumables', 'Process / Procedure', 'Process Parameters', 'Detectable Defects',
    'Non-Detectable / Limited Detection', 'Indication Classification', 'Acceptance Criteria', 'Codes & Standards',
    'Safety & Caution', 'Common Field Mistakes', 'Advantages', 'Limitations', 'Application',
    'Inspector Level Responsibility', 'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'lt': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface / Joint Condition', 'Leak Testing Method Type', 'Detection Technique', 'Test Medium', 'Sensitivity Level',
    'Equipment & Instruments', 'Consumables', 'Process / Procedure', 'Process Parameters', 'Detectable Defects',
    'Non-Detectable / Limited Detection', 'Leak Indication Type', 'Acceptance Criteria', 'Codes & Standards',
    'Safety & Caution', 'Common Field Mistakes', 'Advantages', 'Limitations', 'Application',
    'Inspector Level Responsibility', 'Reporting & Documentation', 'Training & Certification', 'Interview Question Mapping'
  ],
  'paut': [
    'Method Identity', 'Introduction', 'Principle', 'Scientific / Physical Basis', 'Material Compatibility',
    'Surface / Geometry Condition', 'PAUT Technique Type', 'Probe / Transducer Type', 'Wave Mode',
    'Data Display / Imaging Type', 'Equipment & Instruments', 'Consumables', 'Process / Procedure',
    'Process Parameters', 'Detectable Defects', 'Non-Detectable / Limited Detection', 'Indication Classification',
    'Acceptance Criteria', 'Codes & Standards', 'Safety & Caution', 'Common Field Mistakes', 'Advantages',
    'Limitations', 'Application', 'Inspector Level Responsibility', 'Reporting & Documentation',
    'Training & Certification', 'Interview Question Mapping'
  ]
};

const NDT_MODULE_ALIASES: Record<string, string[]> = {
  'dpt': ['dpt', 'dye penetrant testing', 'penetrant testing', 'pt'],
  'ut': ['ut', 'ultrasonic testing'],
  'vt': ['vt', 'visual testing'],
  'mt': ['mt', 'magnetic particle testing', 'mpt'],
  'rt': ['rt', 'radiographic testing'],
  'ect': ['ect', 'eddy current testing', 'et'],
  'lt': ['lt', 'leak testing'],
  'paut': ['paut', 'phased array ultrasonic testing'],
};

const HIERARCHY_KEYS: (keyof Question)[] = ['primaryDomain', 'module', 'section'];

// Helper to find the canonical name for an NDT module from its aliases
const getCanonicalNdtModuleName = (name: string): string | null => {
  const normalizedName = normalizeValue(name);
  for (const [canonical, aliases] of Object.entries(NDT_MODULE_ALIASES)) {
    if (aliases.includes(normalizedName)) {
      return canonical;
    }
  }
  return null;
};

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
    let listItems: { name: string }[] = [];
    
    const pageTitle = currentPathParts[currentLevelIndex - 1] || 'Browse';
    const nextLevelKey = HIERARCHY_KEYS[currentLevelIndex];

    const isNdtDomain = normalizeValue(filters.primaryDomain).includes('ndt');
    const canonicalNdtModule = getCanonicalNdtModuleName(filters.module);

    // If we are at the section level inside a recognized NDT module
    if (isNdtDomain && canonicalNdtModule && currentLevelIndex === 2 && nextLevelKey === 'section') {
      const sectionOrder = NDT_SECTION_ORDER[canonicalNdtModule];
      if (sectionOrder) {
        const availableSections = new Set<string>();
        questions.forEach(q => {
          const qDomain = normalizeValue(q.primaryDomain);
          const qModuleCanonical = getCanonicalNdtModuleName(q.module);

          if (qDomain.includes('ndt') && qModuleCanonical === canonicalNdtModule && q.section) {
            const sections = Array.isArray(q.section) ? q.section : String(q.section).split(',').map(s => s.trim());
            sections.forEach(sec => availableSections.add(normalizeValue(sec)));
          }
        });
        
        listItems = sectionOrder
          .filter(sectionName => availableSections.has(normalizeValue(sectionName)))
          .map(name => ({ name }));
      }
    } else if (nextLevelKey) { // For domains and non-NDT modules
      const uniqueValues = new Map<string, string>();
      questions.filter(q =>
        Object.entries(filters).every(([filterKey, filterValue]) => {
          const qValue = q[filterKey as keyof Question];
          if (!qValue) return false;
          if (Array.isArray(qValue)) {
            return qValue.map(normalizeValue).includes(normalizeValue(filterValue));
          }
          return normalizeValue(String(qValue)) === normalizeValue(filterValue);
        })
      ).forEach(q => {
        const value = q[nextLevelKey as keyof Question];
        if (value) {
          const values = Array.isArray(value) ? value : String(value).split(',').map(s => s.trim());
          values.forEach(v => {
            if (v && !uniqueValues.has(normalizeValue(v))) {
              uniqueValues.set(normalizeValue(v), v);
            }
          });
        }
      });
      listItems = Array.from(uniqueValues.values()).map(name => ({ name }));
    }

    // Filter out empty modules (except "All Questions")
    if (currentLevelIndex === 1) { // We are at Module level
        listItems = listItems.filter(item => {
            const normalizedItemName = normalizeValue(item.name);
            if (normalizedItemName === 'all questions') return true;

            const canonicalItemName = getCanonicalNdtModuleName(item.name);

            return questions.some(q => {
                const domainMatch = normalizeValue(q.primaryDomain) === normalizeValue(filters.primaryDomain);
                if (!domainMatch) return false;

                const qModuleCanonical = getCanonicalNdtModuleName(q.module);

                if(canonicalItemName) { // It's a known NDT module
                    return qModuleCanonical === canonicalItemName;
                }
                
                // For non-NDT or general modules
                const qModule = q.module;
                const moduleMatch = Array.isArray(qModule)
                  ? qModule.map(normalizeValue).includes(normalizedItemName)
                  : normalizeValue(qModule) === normalizedItemName;
                return moduleMatch;
            });
        });
    }

    // Add "All Questions" option at the module level
    if (currentLevelIndex === 1) {
        if (!listItems.some(item => normalizeValue(item.name) === 'all questions')) {
             listItems.unshift({ name: 'All Questions' });
        }
        
        const customOrder = ['all questions', 'introduction', 'ultrasonic testing (ut)', 'magnetic particle testing (mpt)', 'dye penetrant testing (dpt)', 'radiographic testing (rt)'];
        listItems.sort((a, b) => {
            const aIndex = customOrder.indexOf(normalizeValue(a.name));
            const bIndex = customOrder.indexOf(normalizeValue(b.name));
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.name.localeCompare(b.name);
        });
    }
    
    // Determine if we should show questions
    if (!nextLevelKey || (normalizeValue(filters.module) === 'all questions' && currentLevelIndex === 2)) {
        let questionFilter = { ...filters };
        if (normalizeValue(filters.module) === 'all questions') {
            delete questionFilter.module;
        }

        finalQuestions = questions.filter(q =>
            Object.entries(questionFilter).every(([key, value]) => {
              const qValue = q[key as keyof Question];
              if (!qValue) return false;
              
              if(isNdtDomain && (key === 'module' || key === 'section')) {
                  const canonicalModuleFilter = getCanonicalNdtModuleName(value);
                  if (key === 'module' && canonicalModuleFilter) {
                      const qModuleCanonical = getCanonicalNdtModuleName(q.module);
                      return qModuleCanonical === canonicalModuleFilter;
                  }
              }

              const values = Array.isArray(qValue) ? qValue : String(qValue).split(',').map(s => s.trim());
              return values.map(normalizeValue).includes(normalizeValue(value));
            })
        ).sort((a, b) => (a.order || 9999) - (b.order || 9999));
    }


    return { items: listItems, filteredQuestions: finalQuestions, pageTitle };

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

  const Icon = HIERARCHY_KEYS[currentLevelIndex] ? Folder : FileText;

  const renderList = (listItems: {name: string}[]) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {listItems.map(item => (
                    <Link key={item.name} href={`/category/${currentPathParts.join('/')}/${encodeURIComponent(item.name)}`} className="group">
                        <Card className="hover:border-primary/40 transition-all shadow-sm hover:shadow-md border-border h-full bg-card">
                            <div className="p-3 md:p-4 flex items-center justify-between">
                                <span className="font-medium text-sm md:text-base text-slate-700">{item.name}</span>
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
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between py-2 md:h-14">
            <div className="flex items-center gap-2 min-w-0">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0 h-8 w-8">
                    <ArrowLeft className="h-5 w-5 text-slate-700" />
                </Button>
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-base md:text-lg font-bold text-slate-800 truncate">{pageTitle}</h1>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-medium text-slate-500 overflow-x-auto whitespace-nowrap mt-1 md:mt-0 pl-10 md:pl-0">
                {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.name}>
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.name}
                    </Link>
                    {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 shrink-0" />}
                </React.Fragment>
                ))}
            </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-slate-50">
        <div className="container mx-auto p-4 space-y-6">
          {items.length > 0 && renderList(items)}
          
          {filteredQuestions.length > 0 && (
            <>
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
