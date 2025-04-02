/**
 * TextArea Component
 * 
 * A minimalist textarea component for multi-line text input with various states and styles.
 * 
 * @author Finny Frontend
 * @date March 31, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({
  id,
  label,
  value,
  onChange,
  rows = 4,
  placeholder = '',
  disabled = false,
  error = '',
  helper = '',
  required = false,
  className = '',
  textareaClassName = '',
  labelClassName = '',
  fullWidth = true,
  ...props
}) => {
  // Container classes
  const containerClasses = `${fullWidth ? 'w-full' : ''} ${className}`;
  
  // Label classes
  const labelClasses = `block text-sm font-medium text-neutral-700 mb-1 ${labelClassName}`;
  
  // Base input classes - minimalist approach with clean styling
  const baseTextareaClasses = `
    px-3 py-2 
    bg-white 
    rounded-md 
    shadow-sm 
    border 
    focus:outline-none 
    focus:ring-2 
    transition-colors 
    duration-200
    resize-vertical
    ${fullWidth ? 'w-full' : ''}
    ${textareaClassName}
  `;
  
  // Input state classes
  const stateClasses = {
    normal: 'border-neutral-300 focus:border-primary focus:ring-primary/30',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500/30 text-red-900',
    disabled: 'bg-neutral-50 border-neutral-200 text-neutral-500 cursor-not-allowed',
  };
  
  // Determine input state
  let inputState = 'normal';
  if (disabled) inputState = 'disabled';
  else if (error) inputState = 'error';

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${baseTextareaClasses} ${stateClasses[inputState]}`}
        {...props}
      />
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && helper && <p className="mt-1 text-sm text-neutral-500">{helper}</p>}
    </div>
  );
};

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helper: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  textareaClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default TextArea;
