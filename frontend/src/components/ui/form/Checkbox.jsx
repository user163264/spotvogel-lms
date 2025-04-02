/**
 * Checkbox Component
 * 
 * A minimalist checkbox component with Tailwind styling.
 * 
 * @author Finny Frontend
 * @date March 31, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  error = '',
  helper = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-4 h-4 rounded
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
            ${error ? 'border-red-300 text-red-600' : 'border-neutral-300 text-primary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        {label && (
          <label htmlFor={id} className={`font-medium ${disabled ? 'text-neutral-500' : 'text-neutral-700'}`}>
            {label}
          </label>
        )}
        {helper && <p className="text-neutral-500 mt-1">{helper}</p>}
        {error && <p className="text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helper: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;