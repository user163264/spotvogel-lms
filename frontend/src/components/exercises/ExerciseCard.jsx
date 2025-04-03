/**
 * ExerciseCard Component
 * 
 * A minimalist card component for displaying exercise information.
 * 
 * @author Finny Frontend
 * @date March 30, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../ui';

const ExerciseCard = ({
  title,
  description,
  category,
  difficulty = 'medium',
  duration = 0,
  completionStatus = null,
  onClick,
  className = '',
  ...props
}) => {
  // Difficulty color mapping - using subtle colors for minimalist design
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  
  // Status color mapping for the status indicator
  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    overdue: 'bg-red-500',
    available: 'bg-blue-500',
  };
  
  // Convert minutes to a readable format
  const formatDuration = (mins) => {
    if (!mins) return 'N/A';
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}min`;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 flex flex-col cursor-pointer ${className}`}
      {...props}
    >
      {/* Status indicator - minimalist dot approach */}
      {completionStatus && (
        <div className={`h-2 w-2 rounded-full mb-4 ${statusColors[completionStatus] || 'bg-gray-300'}`}></div>
      )}
      
      {/* Title and difficulty */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        {difficulty && (
          <Badge
            variant={difficulty === 'easy' ? 'success' : difficulty === 'hard' ? 'error' : 'warning'}
            size="sm"
          >
            {difficulty}
          </Badge>
        )}
      </div>
      
      {/* Description with proper line height */}
      <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>
      
      {/* Category and duration metadata */}
      <div className="mt-auto pt-4 border-t border-neutral-100 flex justify-between text-xs text-neutral-500">
        <span>{category}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  );
};

ExerciseCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string,
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
  duration: PropTypes.number,
  completionStatus: PropTypes.oneOf(['completed', 'in-progress', 'overdue', 'available', null]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default ExerciseCard;
