/**
 * FormGroup Component
 * 
 * A container component for grouping related form elements with consistent spacing.
 * 
 * @author Finny Frontend
 * @date March 31, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({ 
  children, 
  className = '', 
  title = '', 
  description = '',
  ...props 
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {title && (
        <div className="mb-2">
          <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
          {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default FormGroup;