import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ModernNavigation Component
 * 
 * A clean, minimalist navigation sidebar for the LMS system.
 * Features simplified icons, clear visual hierarchy, and collapsed state.
 */
const ModernNavigation = ({
  userName,
  userRole,
  currentPath,
  onNavigate,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(true);
  
  // Navigation items with modern icons
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'exercises',
      label: 'Exercises',
      path: '/exercises',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
    },
    {
      id: 'progress',
      label: 'Progress',
      path: '/progress',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      id: 'calendar',
      label: 'Calendar',
      path: '/calendar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'messages',
      label: 'Messages',
      path: '/messages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      ),
    },
  ];
  
  // Admin-only navigation items
  const adminItems = [
    {
      id: 'manage-users',
      label: 'Manage Users',
      path: '/admin/users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];
  
  // All navigation items based on user role
  const allNavItems = userRole === 'admin' 
    ? [...navItems, ...adminItems] 
    : navItems;
  
  return (
    <aside 
      className={`bg-white border-r border-slate-100 transition-all duration-300 ease-in-out 
        ${expanded ? 'w-64' : 'w-20'} h-screen sticky top-0 ${className}`}
    >
      {/* Logo and collapse button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
            L
          </div>
          {expanded && (
            <span className="ml-3 font-medium text-slate-900">LMS System</span>
          )}
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {expanded ? (
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {allNavItems.map((item) => {
            const isActive = currentPath === item.path;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors duration-150
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${!expanded && 'justify-center'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {expanded && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User Profile Section */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 ${!expanded && 'flex justify-center'}`}>
        {expanded ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-medium">
              {userName.charAt(0)}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userRole}</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-medium">
            {userName.charAt(0)}
          </div>
        )}
      </div>
    </aside>
  );
};

ModernNavigation.propTypes = {
  userName: PropTypes.string.isRequired,
  userRole: PropTypes.oneOf(['student', 'teacher', 'admin']).isRequired,
  currentPath: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ModernNavigation;
