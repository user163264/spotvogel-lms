import React from 'react';

/**
 * Component for displaying a passage with embedded blank inputs
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode[]} props.processedPassage - The text passage with blanks already processed
 * @returns {JSX.Element} The rendered component
 */
const PassageDisplay = ({ processedPassage }) => {
  return (
    <div className="text-lg text-slate-800 mb-6 leading-relaxed whitespace-pre-line">
      {processedPassage}
    </div>
  );
};

export default PassageDisplay;