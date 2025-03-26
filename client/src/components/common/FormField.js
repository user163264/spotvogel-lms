import React from 'react';

/**
 * Reusable form field component with validation
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.className - Additional classes for the form group
 * @param {Object} props.inputProps - Additional props for the input element
 * @param {string} props.helpText - Help text to show below the input
 */
const FormField = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  className = '',
  inputProps = {},
  helpText,
  children
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          required={required}
          {...inputProps}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-select ${error ? 'is-invalid' : ''}`}
          required={required}
          {...inputProps}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          required={required}
          {...inputProps}
        />
      )}
      
      {helpText && !error && <small className="form-text text-muted">{helpText}</small>}
      
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormField;
