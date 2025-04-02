/**
 * Badge Component
 * 
 * A minimalist badge component for status indicators, counts, and labels.
 * Enhanced with fallback inline styles for when Tailwind CSS fails to load.
 * 
 * @author Finny Frontend
 * @date April 1, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withFallbackStyles, cssVars } from '../../utils/cssUtils';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  
  // Size classes - minimalist approach with fewer options
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Variant classes - using subtle colors for minimalist feel
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-light/20 text-primary-dark',
    secondary: 'bg-secondary-light/20 text-secondary-dark',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  // Rounded corners
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Combine all classes
  const allClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.default}
    ${roundedClasses[rounded] || roundedClasses.full}
    ${className}
  `;

  // Generate fallback styles for the badge
  const getFallbackStyles = () => {
    // Start with basic styles
    const styles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500, // medium
    };

    // Add size-based styles
    if (size === 'sm') {
      styles.padding = '0.125rem 0.5rem';
      styles.fontSize = cssVars.fontSizes.xs;
    } else if (size === 'md') {
      styles.padding = '0.125rem 0.625rem';
      styles.fontSize = cssVars.fontSizes.sm;
    } else if (size === 'lg') {
      styles.padding = '0.25rem 0.75rem';
      styles.fontSize = cssVars.fontSizes.base;
    }

    // Add variant-based styles
    if (variant === 'default') {
      styles.backgroundColor = '#f3f4f6'; // neutral-100
      styles.color = '#1f2937'; // neutral-800
    } else if (variant === 'primary') {
      styles.backgroundColor = 'rgba(107, 138, 252, 0.2)'; // primary-light/20
      styles.color = cssVars.colors.primaryDark;
    } else if (variant === 'secondary') {
      styles.backgroundColor = 'rgba(52, 211, 153, 0.2)'; // secondary-light/20
      styles.color = cssVars.colors.secondaryDark;
    } else if (variant === 'error') {
      styles.backgroundColor = '#fee2e2'; // red-100
      styles.color = '#991b1b'; // red-800
    }

    // Add rounded corners
    if (rounded === 'none') {
      styles.borderRadius = '0';
    } else if (rounded === 'sm') {
      styles.borderRadius = '0.125rem';
    } else if (rounded === 'md') {
      styles.borderRadius = '0.375rem';
    } else if (rounded === 'lg') {
      styles.borderRadius = '0.5rem';
    } else if (rounded === 'full') {
      styles.borderRadius = '9999px';
    }

    return styles;
  };

  return (
    <span
      className={allClasses}
      style={getFallbackStyles()}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  className: PropTypes.string,
};

export default Badge;
