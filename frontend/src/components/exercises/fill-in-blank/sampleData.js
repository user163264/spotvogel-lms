export const sampleExercises = [
  {
    id: 'fib-1',
    instructions: 'Fill in the blanks with the correct words.',
    passage: 'The Declaration of Independence was adopted by the Continental Congress on {{blank:1:July 4, 1776}}. It announced that the {{blank:2:thirteen American colonies}} were now independent states.',
    blanks: [
      {
        id: '1',
        acceptedAnswers: ['July 4, 1776', 'July 4 1776', '4 July 1776', '4th of July 1776']
      },
      {
        id: '2',
        acceptedAnswers: ['thirteen American colonies', '13 American colonies', 'American colonies']
      }
    ],
    explanation: 'The Declaration of Independence was adopted on July 4, 1776, and announced that the thirteen American colonies were now independent from Great Britain.',
    caseSensitive: false
  },
  {
    id: 'fib-code',
    instructions: 'Fill in the blanks with the correct code.',
    passage: 'In JavaScript, you can declare a variable using the {{blank:1:let}} keyword. To create a function, you can use the {{blank:2:function}} keyword or an {{blank:3:arrow}} function.',
    blanks: [
      {
        id: '1',
        acceptedAnswers: ['let', 'var', 'const']
      },
      {
        id: '2',
        acceptedAnswers: ['function']
      },
      {
        id: '3',
        acceptedAnswers: ['arrow', 'arrow function', '=>']
      }
    ],
    explanation: 'JavaScript provides several ways to declare variables (let, var, const) and functions (function keyword, arrow functions).',
    caseSensitive: true
  }
];

export default sampleExercises;