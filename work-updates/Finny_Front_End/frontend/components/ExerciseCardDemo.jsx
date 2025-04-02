import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';

/**
 * ExerciseCardDemo Component
 * 
 * A demonstration page for the ExerciseCard component showing various configurations
 * and use cases. This helps both developers and stakeholders visualize the component
 * in different states.
 */
const ExerciseCardDemo = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Sample exercise data
  const exercises = [
    {
      id: 'ex1',
      title: 'Matching Parts of Speech',
      description: 'Match the words with their correct parts of speech in this interactive exercise. Great for beginners learning English grammar fundamentals.',
      type: 'matching',
      difficulty: 'beginner',
      completionTime: 5,
      author: 'Alex Ex',
      createdAt: '2025-03-15T10:00:00Z',
      tags: ['grammar', 'parts of speech', 'english'],
      completionStatus: 'completed'
    },
    {
      id: 'ex2',
      title: 'Multiple Choice Vocabulary Quiz',
      description: 'Test your vocabulary knowledge with this multiple-choice quiz covering advanced terminology in various fields.',
      type: 'multiple-choice',
      difficulty: 'intermediate',
      completionTime: 10,
      author: 'Sarah Server',
      createdAt: '2025-03-18T14:30:00Z',
      tags: ['vocabulary', 'quiz', 'english'],
      completionStatus: 'in-progress'
    },
    {
      id: 'ex3',
      title: 'Essay Writing: Argumentation',
      description: 'Practice your persuasive writing skills by writing an essay on a controversial topic. You will be evaluated on structure, evidence, and rhetorical techniques.',
      type: 'essay',
      difficulty: 'advanced',
      completionTime: 45,
      author: 'Finny Frontend',
      createdAt: '2025-03-20T09:15:00Z',
      tags: ['writing', 'essay', 'argumentation'],
      completionStatus: 'not-started'
    },
    {
      id: 'ex4',
      title: 'Fill in the Blank: Phrasal Verbs',
      description: 'Complete sentences by filling in the correct phrasal verbs from a word bank. Focus on commonly used expressions in everyday conversation.',
      type: 'fill-in-blank',
      difficulty: 'intermediate',
      completionTime: 15,
      author: 'Frank De Poorter',
      createdAt: '2025-03-22T16:45:00Z',
      tags: ['phrasal verbs', 'fill-in-blank', 'english'],
      completionStatus: null
    },
    {
      id: 'ex5',
      title: 'JavaScript Coding Challenge',
      description: 'Solve a programming challenge by writing JavaScript code to implement a specific algorithm. Your solution will be automatically evaluated for correctness and efficiency.',
      type: 'coding',
      difficulty: 'expert',
      completionTime: 30,
      author: 'Alex Ex',
      createdAt: '2025-03-25T11:20:00Z',
      tags: ['coding', 'javascript', 'algorithms'],
      completionStatus: 'not-started'
    },
    {
      id: 'ex6',
      title: 'Reading Comprehension: Scientific Articles',
      description: 'Read a scientific article and answer questions to demonstrate your understanding of the content, methodology, and conclusions presented.',
      type: 'multiple-choice',
      difficulty: 'advanced',
      completionTime: 20,
      author: 'Sarah Server',
      createdAt: '2025-03-28T08:00:00Z',
      tags: ['reading', 'science', 'comprehension'],
      completionStatus: null
    }
  ];

  // Filter exercises based on selected filter
  const filteredExercises = selectedFilter === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.difficulty === selectedFilter);

  // Handle card click
  const handleCardClick = (id) => {
    console.log(`Exercise ${id} clicked`);
    alert(`You clicked on exercise: ${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Card Component Demo</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates the ExerciseCard component in various configurations.
      </p>

      {/* Filter controls */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter by difficulty:</h2>
        <div className="flex flex-wrap gap-2">
          {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-lms-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            title={exercise.title}
            description={exercise.description}
            type={exercise.type}
            difficulty={exercise.difficulty}
            completionTime={exercise.completionTime}
            author={exercise.author}
            createdAt={exercise.createdAt}
            tags={exercise.tags}
            completionStatus={exercise.completionStatus}
            onClick={() => handleCardClick(exercise.id)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No exercises found with the selected filter.</p>
          <button
            onClick={() => setSelectedFilter('all')}
            className="mt-4 px-4 py-2 bg-lms-primary text-white rounded-md text-sm font-medium"
          >
            Show all exercises
          </button>
        </div>
      )}

      {/* Component Props Section */}
      <div className="mt-16 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Component Props Reference</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">title</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">The title of the exercise</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">description</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">A brief description of the exercise</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">type</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">Type of exercise (e.g., 'matching', 'multiple-choice')</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">difficulty</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">enum</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">Difficulty level ('beginner', 'intermediate', 'advanced', 'expert')</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">completionTime</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">number</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">Estimated completion time in minutes</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">author</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">Name of the exercise creator</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">createdAt</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">ISO date string of when the exercise was created</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">tags</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string[]</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">No</td>
                <td className="px-6 py-4 text-gray-500">Array of tags related to the exercise</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">completionStatus</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">enum</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">No</td>
                <td className="px-6 py-4 text-gray-500">Completion status ('completed', 'in-progress', 'not-started', null)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">onClick</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">function</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Yes</td>
                <td className="px-6 py-4 text-gray-500">Function to handle click events on the card</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">className</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">No</td>
                <td className="px-6 py-4 text-gray-500">Additional CSS classes to apply to the component</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCardDemo;
