export interface Question {
  id: string;
  question_en: string;
  question_hi: string;
  normalized_en: string;
  normalized_hi: string;
  keywords_en: string[];
  keywords_hi: string[];
  shortAnswer_en: string;
  shortAnswer_hi: string;
  longAnswer_en: string;
  longAnswer_hi: string;
  summaryPoints_en: string[];
  summaryPoints_hi: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  source: string;
  viewCount: number;
}
