// Base interface for all exercise types
export interface BaseExercise {
  id: string;
  exercise_type: string;
  question: string;
  max_score: number;
  grading_type: 'auto' | 'manual' | 'hybrid';
  difficulty?: 'easy' | 'medium' | 'hard';
  created_at?: string;
  updated_at?: string;
  tags?: string[];
}

// Matching exercise specific interface
export interface MatchingExercise extends BaseExercise {
  exercise_type: 'matching_words';
  word_bank: string[];
  match_options: string[];
  correct_answer: Record<string, string>;
}

// Multiple choice exercise specific interface
export interface MultipleChoiceExercise extends BaseExercise {
  exercise_type: 'multiple_choice';
  options: string[];
  correct_answer: string | string[];
  allow_multiple?: boolean;
}

// Fill in the blank exercise specific interface
export interface FillBlankExercise extends BaseExercise {
  exercise_type: 'fill_blank';
  text: string;
  blanks: Record<string, string[]>;
  correct_answers: Record<string, string[]>;
  case_sensitive?: boolean;
}

// Union type for all exercise types
export type Exercise = MatchingExercise | MultipleChoiceExercise | FillBlankExercise;

// Exercise result interface
export interface ExerciseResult {
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, any>;
  correct_items: string[];
  incorrect_items: string[];
  feedback?: string;
}

// OpenAI request parameters
export interface OpenAIExerciseParams {
  content: string;
  exerciseType: 'matching_words' | 'multiple_choice' | 'fill_blank';
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfItems: number;
  language: string;
  apiKey?: string;
}
