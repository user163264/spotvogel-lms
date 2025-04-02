/**
 * CSS Utility Functions
 * 
 * Provides utilities for CSS handling, fallbacks, and debugging
 * 
 * @author Finny Frontend
 * @date April 1, 2025
 */

/**
 * CSS variable fallback values for critical UI elements
 */
export const cssVars = {
  colors: {
    primary: '#3B82F6',
    primaryDark: '#2563eb',
    primaryLight: '#6b8afc',
    secondary: '#10B981',
    secondaryDark: '#059669',
    secondaryLight: '#34d399',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    neutralBg: '#f9fafb',
    neutralText: '#1f2937',
    neutralBorder: '#e5e7eb'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  }
};

/**
 * Check if CSS stylesheet is loaded and contains Tailwind classes
 * @returns {boolean} True if Tailwind CSS is loaded
 */
export const isTailwindLoaded = () => {
  if (typeof document === 'undefined') return false;
  
  const styles = document.querySelectorAll('style');
  return Array.from(styles).some(style => 
    style.textContent.includes('@tailwind') || style.textContent.includes('tailwind')
  );
};

/**
 * Get inline styles as fallback for basic Tailwind classes
 * @param {string} className Tailwind class name
 * @returns {Object} React style object
 */
export const getFallbackStyle = (className = '') => {
  const classes = className.split(' ');
  const styles = {};
  
  classes.forEach(cls => {
    if (cls.startsWith('bg-primary')) {
      styles.backgroundColor = cssVars.colors.primary;
    } else if (cls.startsWith('bg-secondary')) {
      styles.backgroundColor = cssVars.colors.secondary;
    } else if (cls.startsWith('bg-error')) {
      styles.backgroundColor = cssVars.colors.error;
    } else if (cls.startsWith('text-primary')) {
      styles.color = cssVars.colors.primary;
    } else if (cls.startsWith('text-secondary')) {
      styles.color = cssVars.colors.secondary;
    } else if (cls.startsWith('text-white')) {
      styles.color = '#ffffff';
    } else if (cls.startsWith('p-')) {
      // Extract padding value
      const value = cls.substring(2);
      const paddingSize = getSpacingValue(value);
      if (paddingSize) styles.padding = paddingSize;
    } else if (cls.startsWith('shadow')) {
      styles.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    } else if (cls.startsWith('rounded')) {
      styles.borderRadius = '0.375rem';
    } else if (cls.startsWith('border')) {
      styles.borderWidth = '1px';
      styles.borderStyle = 'solid';
      styles.borderColor = cssVars.colors.neutralBorder;
    }
  });
  
  return styles;
};

/**
 * Convert Tailwind spacing to CSS value
 * @param {string} value Tailwind spacing identifier
 * @returns {string} CSS size value
 */
const getSpacingValue = (value) => {
  const map = {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '6': '1.5rem',
    '8': '2rem',
    '12': '3rem',
    '16': '4rem'
  };
  
  return map[value] || null;
};

/**
 * Create component props with both className and inline style fallbacks
 * @param {string} className Tailwind classes
 * @param {Object} additionalProps Additional props to include
 * @returns {Object} Props with className and style
 */
export const withFallbackStyles = (className, additionalProps = {}) => {
  return {
    className,
    style: getFallbackStyle(className),
    ...additionalProps
  };
};

export default {
  cssVars,
  isTailwindLoaded,
  getFallbackStyle,
  withFallbackStyles
};
