/**
 * Multiple Choice Exercise Component Exports
 * This file exports all components and types for the Multiple Choice exercise type
 */

// Export the main component
export { default as MultipleChoiceExercise } from './MultipleChoiceExercise';

// Export subcomponents if needed elsewhere
export { default as QuestionDisplay } from './QuestionDisplay';
export { default as OptionsList } from './OptionsList';
export { default as OptionItem } from './OptionItem';
export { default as FeedbackDisplay } from './FeedbackDisplay';

// Export sample data and helpers
export { 
  multipleChoiceMultipleAnswers,
  multipleChoiceSingleAnswer,
  multipleChoiceWithRichText,
  transformApiResponseToMultipleChoice
} from './sampleData';
