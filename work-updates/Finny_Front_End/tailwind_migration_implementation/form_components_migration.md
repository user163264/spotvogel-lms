# Form Components Tailwind Migration Plan

Finny Frontend  
March 31, 2025

## Overview

This document outlines the plan for expanding our form component library using Tailwind CSS. We currently have an Input component, but need to develop additional form components to create a complete system.

## Current Status

We have:
- ✅ Input.jsx: A Tailwind-styled input component

We need to create:
- ❌ Select.jsx: For dropdown selectors
- ❌ Checkbox.jsx: For checkbox inputs
- ❌ Radio.jsx: For radio button inputs
- ❌ TextArea.jsx: For multi-line text input
- ❌ FormGroup.jsx: For grouping related form elements
- ❌ FormLabel.jsx: For consistent form labeling
- ❌ FormHelperText.jsx: For hints and validation messages
- ❌ FormError.jsx: For displaying validation errors

## Implementation Plan

For each component, I'll create a consistent Tailwind implementation that:
1. Follows our design system principles
2. Maintains accessibility standards
3. Works across all screen sizes
4. Has proper hover, focus, and disabled states

## Detailed Component Designs

### Select Component

The Select component will use Tailwind classes for styling:

```jsx
const Select = ({
  id,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  error = '',
  helper = '',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-3 py-2 bg-white rounded-md shadow-sm border 
          focus:outline-none focus:ring-2 transition-colors duration-200
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' 
            : 'border-neutral-300 focus:border-primary focus:ring-primary/30'}
          ${disabled ? 'bg-neutral-50 border-neutral-200 text-neutral-500 cursor-not-allowed' : ''}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && helper && <p className="mt-1 text-sm text-neutral-500">{helper}</p>}
    </div>
  );
};
```

### TextArea Component

```jsx
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
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
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
        className={`
          w-full px-3 py-2 bg-white rounded-md shadow-sm border 
          focus:outline-none focus:ring-2 transition-colors duration-200
          resize-vertical
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' 
            : 'border-neutral-300 focus:border-primary focus:ring-primary/30'}
          ${disabled ? 'bg-neutral-50 border-neutral-200 text-neutral-500 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && helper && <p className="mt-1 text-sm text-neutral-500">{helper}</p>}
    </div>
  );
};
```

### Checkbox Component

```jsx
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
            w-4 h-4 text-primary border rounded
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
            ${error ? 'border-red-300' : 'border-neutral-300'}
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
        {helper && <p className="text-neutral-500">{helper}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};
```

### Radio Component

```jsx
const Radio = ({
  id,
  name,
  label,
  value,
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
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-4 h-4 text-primary border-neutral-300 rounded-full
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
            ${error ? 'border-red-300' : ''}
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
        {helper && <p className="text-neutral-500">{helper}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};
```

### FormGroup Component

```jsx
const FormGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
```

## Form Layouts & Patterns

Beyond individual components, I'll create form layout patterns for:

1. **Stacked Layout**
   - Labels above inputs
   - Full width components
   - Consistent vertical spacing

2. **Horizontal Layout**
   - Labels to the left of inputs
   - Responsive behavior for small screens
   - Consistent alignment

3. **Inline Fields**
   - For forms with multiple fields on one line
   - Responsive collapsing on mobile
   - Proper spacing between elements

## Integration with Existing Components

These form components will integrate with our existing UI components:
- They'll work with our Button component for form submission
- They'll use the same color scheme as other components
- They'll follow our minimalist design principles

## Implementation Steps

1. **Create Base Components**
   - Implement the core form components
   - Document props and behaviors
   - Test for accessibility

2. **Build Form Layout Components**
   - Create reusable layout patterns
   - Test responsive behavior
   - Ensure consistent spacing

3. **Create Example Forms**
   - Build complete form examples
   - Include validation patterns
   - Document best practices

4. **Migration Plan for Existing Forms**
   - Identify forms in the application that need updating
   - Create a phased approach for migration
   - Prioritize high-visibility forms

## Success Criteria

The form component implementation will be successful when:
1. All components are built and documented
2. They match our design system aesthetic
3. They're fully accessible (keyboard navigation, screen readers)
4. They work responsively across devices
5. They handle all necessary states (disabled, error, focus, etc.)

## Timeline

1. **Week 1**: Implement core input components (Select, TextArea, Checkbox, Radio)
2. **Week 2**: Implement layout components and helper components
3. **Week 3**: Create documentation and examples
4. **Week 4**: Begin migration of existing forms

This systematic approach will ensure we have a complete, consistent form system using Tailwind CSS that maintains our design principles while providing a great user experience.
