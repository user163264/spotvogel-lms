/**
 * Type definitions for Multiple Choice exercise components
 * These interfaces define the structure of data that will be used
 * for rendering Multiple Choice exercises
 */

/**
 * Represents a multiple choice exercise
 * @interface MultipleChoiceExercise
 */
export interface MultipleChoiceExercise {
  /** Unique identifier for the exercise */
  id: string;
  
  /** The main question text displayed to the user */
  questionText: string;
  
  /** Optional supplementary instruction text */
  instructions?: string;
  
  /** Array of possible answers */
  options: MultipleChoiceOption[];
  
  /** Whether multiple selections are allowed (checkbox vs radio) */
  allowMultipleSelections: boolean;
  
  /** Optional explanation shown after submission */
  explanation?: string;
}

/**
 * Represents a single option in a multiple choice exercise
 * @interface MultipleChoiceOption
 */
export interface MultipleChoiceOption {
  /** Unique identifier for the option */
  id: string;
  
  /** Display text for this option */
  text: string;
  
  /** Whether this option is part of the correct answer */
  isCorrect: boolean;
  
  /** Optional feedback specific to this option */
  feedback?: string;
}

/**
 * Props for the MultipleChoiceExercise component
 * @interface MultipleChoiceExerciseProps
 */
export interface MultipleChoiceExerciseProps {
  /** The exercise data */
  exercise: MultipleChoiceExercise;
  
  /** Optional callback for when the exercise is submitted */
  onSubmit?: (selectedOptionIds: string[]) => void;
  
  /** Whether to show the correct answers and feedback */
  showFeedback?: boolean;
}

/**
 * Props for the QuestionDisplay component
 * @interface QuestionDisplayProps
 */
export interface QuestionDisplayProps {
  /** The main question text */
  questionText: string;
  
  /** Optional instruction text */
  instructions?: string;
}

/**
 * Props for the OptionsList component
 * @interface OptionsListProps
 */
export interface OptionsListProps {
  /** The options to display */
  options: MultipleChoiceOption[];
  
  /** Whether multiple selections are allowed */
  allowMultipleSelections: boolean;
  
  /** The currently selected option IDs */
  selectedOptionIds: string[];
  
  /** Callback for when an option is selected */
  onOptionSelect: (optionId: string) => void;
  
  /** Whether to show feedback (correct/incorrect indicators) */
  showFeedback?: boolean;
}

/**
 * Props for the OptionItem component
 * @interface OptionItemProps
 */
export interface OptionItemProps {
  /** The option to display */
  option: MultipleChoiceOption;
  
  /** Whether this option is currently selected */
  isSelected: boolean;
  
  /** Whether multiple selections are allowed */
  isMultipleSelect: boolean;
  
  /** Callback for when the option is selected */
  onSelect: () => void;
  
  /** Whether to show feedback (correct/incorrect indicators) */
  showFeedback?: boolean;
}

/**
 * Props for the FeedbackDisplay component
 * @interface FeedbackDisplayProps
 */
export interface FeedbackDisplayProps {
  /** The options with their feedback */
  options: MultipleChoiceOption[];
  
  /** The IDs of the selected options */
  selectedOptionIds: string[];
  
  /** Overall explanation text */
  explanation?: string;
}
