/**
 * Type definitions for Fill-in-the-Blank exercise components
 * These interfaces define the structure of data that will be used
 * for rendering Fill-in-the-Blank exercises
 */

/**
 * Represents a single blank in a fill-in-the-blank exercise
 * @interface BlankItem
 */
export interface BlankItem {
  /** Unique identifier for the blank */
  id: string;
  
  /** The correct answer(s) for this blank */
  acceptedAnswers: string[];
  
  /** Optional hint for this blank */
  hint?: string;
  
  /** Optional specific feedback for this blank */
  feedback?: string;
}

/**
 * Represents a Fill-in-the-Blank exercise
 * @interface FillInBlankExercise
 */
export interface FillInBlankExercise {
  /** Unique identifier for the exercise */
  id: string;
  
  /** Instructions for the exercise */
  instructions: string;
  
  /** 
   * Text passage with blanks marked using {{blank:id:answer}}
   * Example: "The capital of France is {{blank:1:Paris}}."
   */
  passage: string;
  
  /** Array of blank spaces to fill in */
  blanks: BlankItem[];
  
  /** Optional explanation shown after submission */
  explanation?: string;
  
  /** Whether to show case-sensitive validation (default: false) */
  caseSensitive?: boolean;
}

/**
 * Props for the FillInBlankExercise component
 * @interface FillInBlankExerciseProps
 */
export interface FillInBlankExerciseProps {
  /** The exercise data */
  exercise: FillInBlankExercise;
  
  /** Optional callback for when the exercise is submitted */
  onSubmit?: (answers: Record<string, string>) => void;
  
  /** Whether to show the correct answers and feedback */
  showFeedback?: boolean;
}

/**
 * Props for the PassageDisplay component
 * @interface PassageDisplayProps
 */
export interface PassageDisplayProps {
  /** The text passage with blanks already processed */
  processedPassage: React.ReactNode[];
}

/**
 * User answers map - maps blank IDs to user input values
 * @interface UserAnswers
 */
export interface UserAnswers {
  [blankId: string]: string;
}

/**
 * Props for the BlankInput component
 * @interface BlankInputProps
 */
export interface BlankInputProps {
  /** The blank data */
  blank: BlankItem;
  
  /** The current user answer for this blank */
  value: string;
  
  /** Callback for when the input changes */
  onChange: (blankId: string, value: string) => void;
  
  /** Whether to show feedback (correct/incorrect indicators) */
  showFeedback?: boolean;
  
  /** Whether the validation should be case-sensitive */
  caseSensitive?: boolean;
  
  /** Whether the user wants to see a hint */
  showHint?: boolean;
}

/**
 * Props for the FeedbackDisplay component
 * @interface FeedbackDisplayProps
 */
export interface FeedbackDisplayProps {
  /** The blanks with their feedback */
  blanks: BlankItem[];
  
  /** The user's answers */
  userAnswers: UserAnswers;
  
  /** Whether the validation should be case-sensitive */
  caseSensitive?: boolean;
  
  /** Overall explanation text */
  explanation?: string;
}