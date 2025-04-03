import React from 'react';
import ExerciseTester from '../components/testing/ExerciseTester';

/**
 * Exercise Testing Page
 * 
 * A dedicated page for testing exercise components using the split-screen interface
 */
const ExerciseTestingPage = () => {
  return (
    <div className="flex justify-center items-start w-full">
      <div className="w-full max-w-7xl mx-auto">
        <ExerciseTester />
      </div>
    </div>
  );
};

export default ExerciseTestingPage;
