/**
 * Sample data for Multiple Choice exercises
 * This file contains example data that demonstrates the structure expected
 * for Multiple Choice exercises.
 */

/**
 * Example of a multiple choice exercise with multiple correct answers
 */
export const multipleChoiceMultipleAnswers = {
  id: "mc-example-1",
  questionText: "Which of the following are JavaScript frameworks or libraries? (Select all that apply)",
  instructions: "Select all the options that are JavaScript frameworks or libraries.",
  allowMultipleSelections: true,
  options: [
    {
      id: "option-1",
      text: "React",
      isCorrect: true,
      feedback: "React is a JavaScript library for building user interfaces."
    },
    {
      id: "option-2",
      text: "Java",
      isCorrect: false,
      feedback: "Java is a programming language, not a JavaScript framework or library."
    },
    {
      id: "option-3",
      text: "Vue",
      isCorrect: true,
      feedback: "Vue is a progressive JavaScript framework for building user interfaces."
    },
    {
      id: "option-4",
      text: "Python",
      isCorrect: false,
      feedback: "Python is a programming language, not a JavaScript framework or library."
    },
    {
      id: "option-5",
      text: "Angular",
      isCorrect: true,
      feedback: "Angular is a platform and framework for building single-page client applications using HTML and TypeScript."
    }
  ],
  explanation: "React, Vue, and Angular are all JavaScript frameworks or libraries used for building user interfaces and single-page applications. Java and Python are separate programming languages that are not JavaScript frameworks or libraries."
};

/**
 * Example of a multiple choice exercise with a single correct answer
 */
export const multipleChoiceSingleAnswer = {
  id: "mc-example-2",
  questionText: "What is the capital of France?",
  instructions: "Select the correct answer.",
  allowMultipleSelections: false,
  options: [
    {
      id: "option-1",
      text: "London",
      isCorrect: false,
      feedback: "London is the capital of the United Kingdom, not France."
    },
    {
      id: "option-2",
      text: "Berlin",
      isCorrect: false,
      feedback: "Berlin is the capital of Germany, not France."
    },
    {
      id: "option-3",
      text: "Paris",
      isCorrect: true,
      feedback: "Paris is indeed the capital of France."
    },
    {
      id: "option-4",
      text: "Madrid",
      isCorrect: false,
      feedback: "Madrid is the capital of Spain, not France."
    }
  ],
  explanation: "Paris is the capital and most populous city of France. It is located on the Seine River in northern France and has been a major European city and center for art, fashion, and culture for centuries."
};

/**
 * Example of a multiple choice exercise with rich text
 */
export const multipleChoiceWithRichText = {
  id: "mc-example-3",
  questionText: "Consider the following code snippet: \n\n```javascript\nfunction calculateTotal(items) {\n  return items.reduce((total, item) => {\n    return total + (item.price * item.quantity);\n  }, 0);\n}\n```\n\nWhat does this function do?",
  instructions: "Select the single best answer that describes what the code does.",
  allowMultipleSelections: false,
  options: [
    {
      id: "option-1",
      text: "It calculates the average price of all items.",
      isCorrect: false,
      feedback: "The function does not calculate an average. It adds up all (price × quantity) values."
    },
    {
      id: "option-2",
      text: "It calculates the total price of all items, taking quantity into account.",
      isCorrect: true,
      feedback: "Correct! The function uses the reduce method to sum up the price of each item multiplied by its quantity."
    },
    {
      id: "option-3",
      text: "It counts the number of items in the array.",
      isCorrect: false,
      feedback: "The function does not count items. It calculates a total price based on price and quantity."
    },
    {
      id: "option-4",
      text: "It returns the most expensive item in the array.",
      isCorrect: false,
      feedback: "The function does not find the most expensive item. It calculates a total price."
    }
  ],
  explanation: "The function uses JavaScript's `reduce()` method to iterate over an array of items. For each item, it multiplies the item's price by its quantity, and adds that to a running total. The initial value of the total is set to 0. This pattern is commonly used for calculating order totals in e-commerce applications."
};

/**
 * Helper function to transform API response data to our internal structure
 * 
 * @param {Object} apiData - The API response data
 * @returns {Object} The transformed data in our internal format
 */
export const transformApiResponseToMultipleChoice = (apiData) => {
  return {
    id: apiData.id || `mc-${Date.now()}`,
    questionText: apiData.question || '',
    instructions: apiData.instructions || '',
    allowMultipleSelections: apiData.correct_answer && 
      Array.isArray(apiData.correct_answer) && 
      apiData.correct_answer.length > 1,
    options: (apiData.options || []).map((option, index) => ({
      id: `option-${index + 1}`,
      text: option,
      isCorrect: Array.isArray(apiData.correct_answer) 
        ? apiData.correct_answer.includes(option)
        : apiData.correct_answer === option,
      feedback: '' // API might not provide per-option feedback
    })),
    explanation: apiData.explanation || ''
  };
};