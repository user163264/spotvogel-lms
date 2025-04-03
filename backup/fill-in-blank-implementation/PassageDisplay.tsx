import React from 'react';
import { PassageDisplayProps } from './types';

/**
 * Component for displaying a passage with embedded blank inputs
 * 
 * @component
 */
const PassageDisplay: React.FC<PassageDisplayProps> = ({ processedPassage }) => {
  return (
    <div className="text-lg text-slate-800 mb-6 leading-relaxed whitespace-pre-line">
      {processedPassage}
    </div>
  );
};

export default PassageDisplay;