/**
 * Button Component
 * 
 * A versatile button component styled with Tailwind CSS following minimalist design principles.
 * 
 * @author Finny Frontend
 * @date March 30, 2025
 */

import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  fullWidth = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };
  
  // Variant classes - following minimalist design principles
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-primary',
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-500',
    link: 'text-primary underline hover:text-primary-dark p-0 focus:ring-primary',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-red-500',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Handle icon positioning
  const iconElement = icon && (
    <span className={`${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
      {icon}
    </span>
  );

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${widthClasses}
        ${disabledClasses}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'link', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
};

export default Button;
