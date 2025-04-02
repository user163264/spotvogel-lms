import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component using Tailwind CSS
 * This demonstrates how to create flexible layout components with Tailwind
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  className = '',
}) => {
  // Base classes for all cards
  const baseClasses = 'rounded-lg overflow-hidden shadow';
  
  // Variant specific classes
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    secondary: 'bg-green-50 border border-green-200',
    accent: 'bg-purple-50 border border-purple-200',
  };
  
  // Header classes based on variant
  const headerClasses = {
    default: 'px-6 py-4 border-b border-gray-200',
    primary: 'px-6 py-4 bg-blue-100 border-b border-blue-200 text-blue-800',
    secondary: 'px-6 py-4 bg-green-100 border-b border-green-200 text-green-800',
    accent: 'px-6 py-4 bg-purple-100 border-b border-purple-200 text-purple-800',
  };
  
  // Footer classes
  const footerClass = 'px-6 py-4 bg-gray-50 border-t border-gray-200';
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {(title || subtitle) && (
        <div className={headerClasses[variant]}>
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>
      
      {footer && (
        <div className={footerClass}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  className: PropTypes.string,
};

export default Card;
