import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModernExerciseCard Component
 * 
 * A clean, minimalist card for displaying exercise information in the LMS system.
 * Features a lighter design with more white space and subtle visual cues.
 */
const ModernExerciseCard = ({
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
  // Map exercise types to appropriate colors (more subtle than previous version)
  const typeColors = {
    matching: 'bg-amber-50 text-amber-700 border-amber-200',
    'multiple-choice': 'bg-rose-50 text-rose-700 border-rose-200',
    'fill-in-blank': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    essay: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    coding: 'bg-sky-50 text-sky-700 border-sky-200',
    default: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  // Map difficulty level to more subtle indicator colors
  const difficultyIndicators = {
    beginner: 'bg-emerald-400',
    intermediate: 'bg-blue-400',
    advanced: 'bg-violet-400',
    expert: 'bg-rose-400',
  };

  // Map completion status to subtle colors
  const statusColors = {
    completed: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    'in-progress': 'bg-amber-100 border-amber-200 text-amber-800',
    'not-started': 'bg-slate-100 border-slate-200 text-slate-800',
  };

  // Format date to be more human-readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl border border-slate-100 hover:border-slate-200 
      shadow-sm hover:shadow transition-all duration-200 overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Difficulty indicator - subtle line at the top */}
      <div 
        className={`h-1 w-full ${difficultyIndicators[difficulty] || 'bg-slate-200'}`} 
        aria-hidden="true"
      />

      <div className="p-6">
        {/* Card header with type badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border 
            ${typeColors[type] || typeColors.default}`}>
            {type}
          </span>
          
          {/* Completion status badge - only show if status exists */}
          {completionStatus && (
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border
              ${statusColors[completionStatus] || 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              {completionStatus === 'completed' ? 'Completed' : 
               completionStatus === 'in-progress' ? 'In Progress' : 'Not Started'}
            </span>
          )}
        </div>

        {/* Exercise title */}
        <h3 className="text-lg font-medium text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Exercise description - cleaner with slightly larger line height */}
        <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed text-sm">
          {description}
        </p>

        {/* Tags - more subtle design */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card footer with metadata */}
        <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3 mt-2">
          <div className="flex items-center">
            <span className="font-medium">{author}</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-3.5 h-3.5 mr-1 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{completionTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ModernExerciseCard.propTypes = {
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

export default ModernExerciseCard;
