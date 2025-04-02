/**
 * Card Component
 * 
 * A minimalist card component for content display with various style options.
 * 
 * @author Finny Frontend
 * @date March 30, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '',
  variant = 'default',
  padding = 'default',
  hover = false,
  border = false,
  shadow = 'sm',
  ...props 
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Variant styles
  const variantClasses = {
    default: '',
    primary: 'border-l-4 border-l-primary',
    secondary: 'border-l-4 border-l-secondary',
  };
  
  // Padding options
  const paddingClasses = {
    none: '',
    small: 'p-3',
    default: 'p-6',
    large: 'p-8',
  };
  
  // Shadow options - minimalist approach with subtle shadows
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Border option
  const borderClasses = border ? 'border border-neutral-200' : '';
  
  // Hover effects
  const hoverClasses = hover ? 'transition-all duration-300 hover:shadow-md' : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant] || ''}
        ${paddingClasses[padding] || paddingClasses.default}
        ${shadowClasses[shadow] || shadowClasses.default}
        ${borderClasses}
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 pb-3 border-b border-neutral-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-3 border-t border-neutral-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  hover: PropTypes.bool,
  border: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'default', 'md', 'lg']),
};

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
