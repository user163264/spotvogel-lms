/**
 * Exercise Card Demo Page
 * 
 * A demonstration of the ExerciseCard component in various states.
 * 
 * @author Finny Frontend
 * @date March 30, 2025
 */

import React from 'react';
import { Container, Card } from '../../components/ui';
import ExerciseCard from '../../components/exercises/ExerciseCard';

const ExerciseCardDemo = () => {
  // Sample exercise data
  const exercises = [
    {
      id: 1,
      title: 'Matching Vocabulary Words',
      description: 'Match words with their definitions in this vocabulary building exercise.',
      category: 'Vocabulary',
      difficulty: 'easy',
      duration: 15,
      completionStatus: 'completed',
    },
    {
      id: 2,
      title: 'Grammar Correction Challenge',
      description: 'Identify and correct grammatical errors in sentences.',
      category: 'Grammar',
      difficulty: 'medium',
      duration: 25,
      completionStatus: 'in-progress',
    },
    {
      id: 3,
      title: 'Advanced Reading Comprehension',
      description: 'Read a complex text and answer analytical questions about themes and subtext.',
      category: 'Reading',
      difficulty: 'hard',
      duration: 45,
      completionStatus: 'available',
    },
    {
      id: 4,
      title: 'Academic Writing Practice',
      description: 'Write a structured essay following academic writing conventions.',
      category: 'Writing',
      difficulty: 'hard',
      duration: 60,
      completionStatus: 'overdue',
    },
    {
      id: 5,
      title: 'Vocabulary Flashcards',
      description: 'Review vocabulary words with interactive flashcards.',
      category: 'Vocabulary',
      difficulty: 'easy',
      duration: 10,
      completionStatus: null,
    },
    {
      id: 6,
      title: 'Listening Comprehension',
      description: 'Listen to a conversation and answer questions about details and main ideas.',
      category: 'Listening',
      difficulty: 'medium',
      duration: 20,
      completionStatus: null,
    },
  ];

  // Mock click handler
  const handleExerciseClick = (id) => {
    console.log(`Exercise ${id} clicked`);
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Exercise Card Demo</h1>
        <p className="text-neutral-600 max-w-3xl">
          This page showcases our new minimalist ExerciseCard component built with Tailwind CSS.
          The cards display exercise information in a clean, consistent format with visual indicators
          for difficulty and completion status.
        </p>
      </div>
      
      {/* Status indicators section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Completion Status Indicators</h2>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-neutral-700">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-neutral-700">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-neutral-700">Overdue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-neutral-700">Available</span>
            </div>
          </div>
        </Card>
      </section>
      
      {/* Exercise cards grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Exercise Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              title={exercise.title}
              description={exercise.description}
              category={exercise.category}
              difficulty={exercise.difficulty}
              duration={exercise.duration}
              completionStatus={exercise.completionStatus}
              onClick={() => handleExerciseClick(exercise.id)}
            />
          ))}
        </div>
      </section>
    </Container>
  );
};

export default ExerciseCardDemo;
