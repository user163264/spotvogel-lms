/**
 * Select Component
 * 
 * A minimalist select dropdown component with various states and styles.
 * 
 * @author Finny Frontend
 * @date March 31, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = '',
  helper = '',
  required = false,
  className = '',
  selectClassName = '',
  labelClassName = '',
  fullWidth = true,
  ...props
}) => {
  // Container classes
  const containerClasses = `${fullWidth ? 'w-full' : ''} ${className}`;
  
  // Label classes
  const labelClasses = `block text-sm font-medium text-neutral-700 mb-1 ${labelClassName}`;
  
  // Base select classes - minimalist approach with clean styling
  const baseSelectClasses = `
    px-3 py-2 
    bg-white 
    rounded-md 
    shadow-sm 
    border 
    focus:outline-none 
    focus:ring-2 
    transition-colors 
    duration-200
    appearance-none
    pr-8
    bg-no-repeat
    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]
    bg-[length:1.25rem_1.25rem]
    bg-[right_0.5rem_center]
    ${fullWidth ? 'w-full' : ''}
    ${selectClassName}
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
      
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${baseSelectClasses} ${stateClasses[inputState]}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && helper && <p className="mt-1 text-sm text-neutral-500">{helper}</p>}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helper: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Select;