export { default as FillInBlankExercise } from './FillInBlankExercise';
export { default as PassageDisplay } from './PassageDisplay';
export { default as BlankInput } from './BlankInput';
export { default as WordSelector } from './WordSelector';

// Utils
export * from './util/passageParser';
export * from './util/validation';

// Data transformation
export const transformApiResponseToFillInBlank = (response) => {
  // If already in the right format, return as is
  if (response.passage && response.blanks) {
    return response;
  }
  
  // Handle different response formats
  if (response.exercise_type === 'fill_in_blank') {
    return {
      id: response.id || `fill-in-blank-${Date.now()}`,
      instructions: response.instructions || 'Fill in the blanks with the correct words.',
      passage: response.passage,
      blanks: response.blanks.map(blank => ({
        id: blank.id,
        acceptedAnswers: blank.acceptedAnswers || [blank.answer]
      })),
      explanation: response.explanation,
      caseSensitive: response.case_sensitive || false
    };
  }
  
  // Return null if can't transform
  return null;
};