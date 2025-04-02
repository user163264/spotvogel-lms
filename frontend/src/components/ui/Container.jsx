/**
 * Container Component
 * 
 * A responsive container component for layout consistency following minimalist design principles.
 * 
 * @author Finny Frontend
 * @date March 30, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const Container = ({
  children,
  className = '',
  maxWidth = 'default',
  padding = true,
  centered = true,
  ...props
}) => {
  // Max width classes - minimalist approach with fewer options
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    default: 'max-w-7xl', // Default max width
    full: 'max-w-full',
  };
  
  // Padding classes
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  
  // Center alignment
  const centerClasses = centered ? 'mx-auto' : '';

  return (
    <div
      className={`
        ${maxWidthClasses[maxWidth] || maxWidthClasses.default}
        ${paddingClasses}
        ${centerClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'default', 'full']),
  padding: PropTypes.bool,
  centered: PropTypes.bool,
};

export default Container;
