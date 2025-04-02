import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModernInput Component
 * 
 * A clean, minimalist input field with optional label and validation state.
 */
export const ModernInput = ({
  id,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-2 text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 text-sm transition-colors
            placeholder:text-slate-400 focus:ring-2 focus:ring-offset-0 focus:outline-none
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-rose-300 focus:border-rose-300 focus:ring-rose-100' 
              : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
            }`}
          {...props}
        />
        
        {type === 'search' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {(error || helper) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-rose-500' : 'text-slate-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};

/**
 * ModernTextarea Component
 * 
 * A clean, minimalist textarea field with optional label and validation state.
 */
export const ModernTextarea = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-2 text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 text-sm transition-colors
          placeholder:text-slate-400 focus:ring-2 focus:ring-offset-0 focus:outline-none
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error 
            ? 'border-rose-300 focus:border-rose-300 focus:ring-rose-100' 
            : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
          }`}
        {...props}
      />
      
      {(error || helper) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-rose-500' : 'text-slate-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};

/**
 * ModernSelect Component
 * 
 * A clean, minimalist select field with optional label and validation state.
 */
export const ModernSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  error,
  helper,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-2 text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 text-sm transition-colors
            appearance-none bg-white focus:ring-2 focus:ring-offset-0 focus:outline-none
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-rose-300 focus:border-rose-300 focus:ring-rose-100' 
              : 'border-slate-200 focus:border-blue-300 focus:ring-blue-100'
            }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {(error || helper) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-rose-500' : 'text-slate-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};

/**
 * ModernCheckbox Component
 * 
 * A clean, minimalist checkbox with label.
 */
export const ModernCheckbox = ({
  id,
  label,
  checked,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-100
              disabled:opacity-70 disabled:cursor-not-allowed
              ${error ? 'border-rose-300' : ''}`}
            {...props}
          />
        </div>
        
        <div className="ml-3 text-sm">
          <label 
            htmlFor={id} 
            className={`font-medium ${disabled ? 'text-slate-500' : 'text-slate-700'}`}
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
          
          {error && (
            <p className="mt-1 text-sm text-rose-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ModernRadio Component
 * 
 * A clean, minimalist radio button with label.
 */
export const ModernRadio = ({
  id,
  name,
  label,
  value,
  checked,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-2 ${className}`}>
      <div className="flex items-center">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="h-4 w-4 border-slate-300 text-blue-500 focus:ring-blue-100
            disabled:opacity-70 disabled:cursor-not-allowed"
          {...props}
        />
        
        <label 
          htmlFor={id} 
          className={`ml-3 text-sm font-medium ${disabled ? 'text-slate-500' : 'text-slate-700'}`}
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      </div>
    </div>
  );
};

/**
 * ModernRadioGroup Component
 * 
 * A group of radio buttons with a label.
 */
export const ModernRadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  helper,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <ModernRadio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled || option.disabled}
            required={required}
            {...props}
          />
        ))}
      </div>
      
      {(error || helper) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-rose-500' : 'text-slate-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};

/**
 * ModernButton Component
 * 
 * A clean, minimalist button component with several variants.
 */
export const ModernButton = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-200',
    outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-200',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-200',
    text: 'bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-200',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      {children}
      
      {rightIcon && !loading && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

// Define prop types for all components
ModernInput.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  helper: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

ModernTextarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  helper: PropTypes.string,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

ModernSelect.propTypes = {
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
  error: PropTypes.string,
  helper: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

ModernCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

ModernRadio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

ModernRadioGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  helper: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

ModernButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

// Export form elements as a group
const ModernFormElements = {
  Input: ModernInput,
  Textarea: ModernTextarea,
  Select: ModernSelect,
  Checkbox: ModernCheckbox,
  Radio: ModernRadio,
  RadioGroup: ModernRadioGroup,
  Button: ModernButton,
};

export default ModernFormElements;
