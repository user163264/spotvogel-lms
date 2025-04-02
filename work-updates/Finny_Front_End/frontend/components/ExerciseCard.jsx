import React from 'react';
import PropTypes from 'prop-types';

/**
 * ExerciseCard Component
 * 
 * A flexible card component for displaying exercise information in the LMS system.
 * Built with Tailwind CSS for consistent styling and responsive design.
 */
const ExerciseCard = ({
  title,
  description,
  type,
  difficulty,
  completionTime,
  author,
  createdAt,
  tags = [],
  completionStatus = null,
  onClick,
  className = '',
}) => {
  // Map difficulty level to appropriate colors
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800',
    expert: 'bg-red-100 text-red-800',
  };

  // Map exercise types to appropriate colors
  const typeColors = {
    matching: 'bg-yellow-100 text-yellow-800',
    'multiple-choice': 'bg-pink-100 text-pink-800',
    'fill-in-blank': 'bg-indigo-100 text-indigo-800',
    essay: 'bg-emerald-100 text-emerald-800',
    coding: 'bg-cyan-100 text-cyan-800',
    default: 'bg-gray-100 text-gray-800',
  };

  // Map completion status to appropriate colors
  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    'not-started': 'bg-gray-300',
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className={`relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Completion status indicator */}
      {completionStatus && (
        <div className="absolute top-0 right-0 h-6 w-6">
          <div className={`absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] ${
            statusColors[completionStatus] || 'bg-gray-300'
          } border-b-transparent border-l-transparent`}></div>
        </div>
      )}

      <div className="p-5">
        {/* Card header with exercise type and difficulty */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || typeColors.default}`}>
            {type}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
            {difficulty}
          </span>
        </div>

        {/* Exercise title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Exercise description - truncated for clean UI */}
        <p className="text-gray-700 mb-3 line-clamp-2">{description}</p>

        {/* Tags section */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card footer with metadata */}
        <div className="pt-3 mt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <div className="text-gray-500">
              <span className="font-medium text-gray-700">{author}</span>
              <span className="mx-1">•</span>
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="text-gray-500">
              <span>
                {completionTime} {completionTime === 1 ? 'min' : 'mins'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ExerciseCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(['beginner', 'intermediate', 'advanced', 'expert']).isRequired,
  completionTime: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  completionStatus: PropTypes.oneOf(['completed', 'in-progress', 'not-started', null]),
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ExerciseCard;
