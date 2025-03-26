import React from 'react';

/**
 * Empty state component for when no data is available
 * @param {Object} props - Component props
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state description message
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {React.ReactNode} props.action - Optional action button/link
 */
const EmptyState = ({ 
  title = 'No data found', 
  message = 'There are no items to display.', 
  icon, 
  action,
  children
}) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      
      <h3 className="empty-state-title">{title}</h3>
      
      <p className="empty-state-message">{message}</p>
      
      {action && <div className="empty-state-action">{action}</div>}
      
      {children}
    </div>
  );
};

export default EmptyState;
