/**
 * Router Configuration
 * 
 * This module configures React Router with appropriate future flags
 * to address warnings about upcoming changes in v7.
 * 
 * @author Finny Frontend
 * @date April 1, 2025
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/**
 * Enhanced Router component that applies future flags
 * to prevent warnings about upcoming changes in React Router v7
 */
export const EnhancedRouter = ({ children }) => {
  // Future flags are not supported in BrowserRouter directly in v6
  // Instead, we'll just wrap it and handle the warnings at usage level
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {children}
    </BrowserRouter>
  );
};

export default EnhancedRouter;
