import React from 'react';
import ExerciseTester from '../components/testing/ExerciseTester';

/**
 * Page component for the Exercise Testing Ground
 * This provides the proper layout and centering for the ExerciseTester component
 * 
 * @component
 */
const ExerciseTestingPage = () => {
  return (
    <div className="flex justify-center items-start w-full">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <header className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-800">Exercise Testing Ground</h1>
            <p className="text-sm text-gray-500 mt-1">
              Test and preview exercise components before integration
            </p>
          </header>
          
          <div className="h-[calc(100vh-120px)]">
            <ExerciseTester />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTestingPage;