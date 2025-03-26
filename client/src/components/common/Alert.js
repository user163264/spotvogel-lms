import React from 'react';

/**
 * Alert component for displaying messages
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type ('success', 'danger', 'warning', 'info')
 * @param {string} props.message - Alert message
 * @param {string} props.title - Optional alert title
 * @param {Function} props.onDismiss - Optional function to call when alert is dismissed
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 */
const Alert = ({ 
  type = 'info', 
  message, 
  title, 
  onDismiss, 
  dismissible = true,
  children
}) => {
  const alertClasses = {
    success: 'alert-success',
    danger: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  };
  
  const alertClass = alertClasses[type] || alertClasses.info;
  
  return (
    <div className={`alert ${alertClass} ${dismissible ? 'alert-dismissible' : ''}`} role="alert">
      {title && <h4 className="alert-heading">{title}</h4>}
      
      {message && <p className="mb-0">{message}</p>}
      
      {children}
      
      {dismissible && onDismiss && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close" 
          onClick={onDismiss}
        ></button>
      )}
    </div>
  );
};

export default Alert;
