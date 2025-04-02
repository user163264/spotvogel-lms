/**
 * Tailwind CSS Test Component
 * 
 * This component is used to verify that Tailwind CSS is being properly
 * applied and processed within the application.
 * 
 * Created by: Finny Frontend
 * Date: April 1, 2025
 */

import React from 'react';

const TailwindTestComponent = () => {
  return (
    <div className="p-6 max-w-sm mx-auto my-8 bg-white rounded-xl shadow-md flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-primary">Tailwind CSS Test</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Background Colors</h3>
        <div className="flex space-x-2">
          <div className="w-10 h-10 bg-primary rounded"></div>
          <div className="w-10 h-10 bg-secondary rounded"></div>
          <div className="w-10 h-10 bg-neutral-200 rounded"></div>
          <div className="w-10 h-10 bg-success rounded"></div>
          <div className="w-10 h-10 bg-error rounded"></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Text Colors & Sizes</h3>
        <p className="text-primary">Primary Text</p>
        <p className="text-secondary">Secondary Text</p>
        <p className="text-neutral-500">Neutral Text</p>
        <p className="text-error">Error Text</p>
        <p className="text-xs">Extra Small</p>
        <p className="text-sm">Small</p>
        <p className="text-base">Base</p>
        <p className="text-lg">Large</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Border & Shadow</h3>
        <div className="p-2 border border-primary rounded">Border Primary</div>
        <div className="p-2 mt-2 shadow-sm">Shadow Small</div>
        <div className="p-2 mt-2 shadow">Shadow Default</div>
        <div className="p-2 mt-2 shadow-md">Shadow Medium</div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Spacing & Flex</h3>
        <div className="flex space-x-4">
          <div className="p-2 bg-primary text-white">1</div>
          <div className="p-2 bg-primary text-white">2</div>
          <div className="p-2 bg-primary text-white">3</div>
        </div>
      </div>
      
      <button 
        className="btn btn-primary mt-4"
        onClick={() => alert('Tailwind CSS is working!')}
      >
        Test Button
      </button>
      
      <p className="text-sm text-neutral-500 mt-2">
        If you're seeing proper styling for all elements above, Tailwind CSS is working correctly.
      </p>
    </div>
  );
};

export default TailwindTestComponent;
