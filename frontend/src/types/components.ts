import { ReactNode } from 'react';
import { Exercise, ExerciseResult, MatchingExercise, MultipleChoiceExercise, FillBlankExercise } from './exercises';

// Common props for all exercise components
export interface ExerciseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

// Container props for all exercise types
export interface ExerciseContainerProps extends ExerciseComponentProps {
  exerciseData: Exercise;
  onSubmit?: (result: ExerciseResult) => void;
  showFeedback?: boolean;
  allowRetry?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

// Matching exercise component props
export interface MatchingExerciseProps extends ExerciseComponentProps {
  exerciseData: MatchingExercise;
  answers?: Record<string, string>;
  onAnswerChange?: (answers: Record<string, string>) => void;
  disabled?: boolean;
  showCorrectAnswers?: boolean;
}

// Matching exercise item props (for each matching pair)
export interface MatchingItemProps extends ExerciseComponentProps {
  item: string;
  selectedOption: string | null;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  showCorrect?: boolean;
  correctOption?: string;
}

// Multiple choice component props
export interface MultipleChoiceProps extends ExerciseComponentProps {
  exerciseData: MultipleChoiceExercise;
  selectedAnswers?: string[];
  onAnswerChange?: (answers: string[]) => void;
  disabled?: boolean;
  showCorrectAnswers?: boolean;
}

// Fill in the blank component props
export interface FillBlankProps extends ExerciseComponentProps {
  exerciseData: FillBlankExercise;
  answers?: Record<string, string>;
  onAnswerChange?: (answers: Record<string, string>) => void;
  disabled?: boolean;
  showCorrectAnswers?: boolean;
}

// Exercise feedback component props
export interface ExerciseFeedbackProps extends ExerciseComponentProps {
  result: ExerciseResult;
  showCorrectAnswers?: boolean;
}

// Exercise action button props
export interface ExerciseActionButtonProps extends ExerciseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
