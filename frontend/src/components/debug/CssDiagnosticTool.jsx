/**
 * CSS Diagnostic Tool
 * 
 * A comprehensive tool for diagnosing CSS loading and application issues.
 * Provides detailed information about CSS processing, Tailwind configuration,
 * and DOM style application.
 * 
 * @author Finny Frontend
 * @date April 1, 2025
 */

import React, { useState, useEffect } from 'react';
import { cssVars, isTailwindLoaded } from '../../utils/cssUtils';

const CssDiagnosticTool = () => {
  const [diagnosticData, setDiagnosticData] = useState({
    stylesheetsLoaded: 0,
    tailwindDetected: false,
    cssVariablesSupported: true,
    inlineStylesWorking: true,
    cssClassesApplied: true,
    tailwindThemeColors: [],
    computedStyles: {},
    domReady: false
  });
  
  const [expandedSection, setExpandedSection] = useState('overview');

  useEffect(() => {
    // Run diagnostics after component mounts
    const runDiagnostics = () => {
      const styles = document.querySelectorAll('style');
      const styleSheets = document.styleSheets;
      
      // Check for Tailwind CSS
      const tailwindDetected = Array.from(styles).some(style => 
        style.textContent.includes('@tailwind') || style.textContent.includes('tailwind')
      );
      
      // Check CSS Variables support
      const cssVariablesSupported = window.CSS && window.CSS.supports && 
        window.CSS.supports('--custom-property: value');
      
      // Get current theme colors from computed styles
      const testElement = document.createElement('div');
      testElement.className = 'text-primary bg-secondary';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const computedStyles = {
        textColor: computedStyle.color,
        bgColor: computedStyle.backgroundColor,
        fontFamily: computedStyle.fontFamily,
        borderRadius: computedStyle.borderRadius
      };
      
      document.body.removeChild(testElement);
      
      // Extract Tailwind colors
      const tailwindThemeColors = [];
      try {
        for (let i = 0; i < styleSheets.length; i++) {
          try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (rules) {
              for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule.selectorText && rule.selectorText.includes('bg-primary')) {
                  tailwindThemeColors.push({
                    selector: rule.selectorText,
                    properties: rule.style.cssText
                  });
                }
              }
            }
          } catch (e) {
            // CORS restrictions can prevent reading some stylesheets
            console.log('Could not read stylesheet', e);
          }
        }
      } catch (e) {
        console.error('Error analyzing stylesheets', e);
      }
      
      setDiagnosticData({
        stylesheetsLoaded: styleSheets.length,
        tailwindDetected,
        cssVariablesSupported,
        inlineStylesWorking: true, // Assume true, hard to test programmatically
        cssClassesApplied: true, // Assume true, will be evident in UI
        tailwindThemeColors,
        computedStyles,
        domReady: true
      });
    };
    
    if (document.readyState === 'complete') {
      runDiagnostics();
    } else {
      window.addEventListener('load', runDiagnostics);
      return () => window.removeEventListener('load', runDiagnostics);
    }
  }, []);
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Create a test element with Tailwind classes
  const TestElement = ({ name, twClasses }) => (
    <div 
      className={`p-2 mb-2 ${twClasses}`}
    >
      {name}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-900 mb-4">CSS Diagnostic Tool</h2>
      
      {/* Summary Card */}
      <div 
        className="p-4 mb-6 rounded-md bg-blue-50 border border-blue-200"
      >
        <h3 className="font-medium text-blue-800 mb-2">Diagnostic Summary</h3>
        <ul className="space-y-1">
          <li className="flex items-center">
            <span className={`w-4 h-4 rounded-full mr-2 ${diagnosticData.domReady ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            DOM Ready: {diagnosticData.domReady ? 'Yes' : 'No'}
          </li>
          <li className="flex items-center">
            <span className={`w-4 h-4 rounded-full mr-2 ${diagnosticData.tailwindDetected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            Tailwind CSS Detected: {diagnosticData.tailwindDetected ? 'Yes' : 'No'}
          </li>
          <li className="flex items-center">
            <span className={`w-4 h-4 rounded-full mr-2 ${diagnosticData.stylesheetsLoaded > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            Stylesheets Loaded: {diagnosticData.stylesheetsLoaded}
          </li>
        </ul>
      </div>
      
      {/* Detailed Sections */}
      <div className="space-y-4">
        {/* Overview Section */}
        <div className="border rounded-md overflow-hidden">
          <button
            className="w-full p-3 bg-gray-50 text-left font-medium flex justify-between items-center"
            onClick={() => toggleSection('overview')}
          >
            Overall CSS Status
            <span>{expandedSection === 'overview' ? '−' : '+'}</span>
          </button>
          
          {expandedSection === 'overview' && (
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">DOM Ready</td>
                    <td>{diagnosticData.domReady ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">Stylesheets Loaded</td>
                    <td>{diagnosticData.stylesheetsLoaded}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">Tailwind Detected</td>
                    <td>{diagnosticData.tailwindDetected ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium">CSS Variables Support</td>
                    <td>{diagnosticData.cssVariablesSupported ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Current Environment</td>
                    <td>{process.env.NODE_ENV}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Computed Styles Section */}
        <div className="border rounded-md overflow-hidden">
          <button
            className="w-full p-3 bg-gray-50 text-left font-medium flex justify-between items-center"
            onClick={() => toggleSection('computed')}
          >
            Computed Styles
            <span>{expandedSection === 'computed' ? '−' : '+'}</span>
          </button>
          
          {expandedSection === 'computed' && (
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(diagnosticData.computedStyles).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 pr-4 font-medium">{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* CSS Test Components */}
        <div className="border rounded-md overflow-hidden">
          <button
            className="w-full p-3 bg-gray-50 text-left font-medium flex justify-between items-center"
            onClick={() => toggleSection('testComponents')}
          >
            Test Components
            <span>{expandedSection === 'testComponents' ? '−' : '+'}</span>
          </button>
          
          {expandedSection === 'testComponents' && (
            <div className="p-4">
              <p className="mb-4 text-sm text-neutral-500">These components test both Tailwind classes and inline fallback styles.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Tailwind Background Colors</h4>
                  <TestElement 
                    name="Primary Background" 
                    twClasses="bg-primary text-white rounded" 
                  />
                  <TestElement 
                    name="Secondary Background" 
                    twClasses="bg-secondary text-white rounded" 
                  />
                  <TestElement 
                    name="Error Background" 
                    twClasses="bg-error text-white rounded" 
                  />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tailwind Text Colors</h4>
                  <TestElement 
                    name="Primary Text" 
                    twClasses="text-primary border rounded" 
                  />
                  <TestElement 
                    name="Secondary Text" 
                    twClasses="text-secondary border rounded" 
                  />
                  <TestElement 
                    name="Error Text" 
                    twClasses="text-error border rounded" 
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Tailwind Layout Features</h4>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1 p-4 bg-neutral-100 rounded">Flex Item 1</div>
                  <div className="flex-1 p-4 bg-neutral-100 rounded">Flex Item 2</div>
                  <div className="flex-1 p-4 bg-neutral-100 rounded">Flex Item 3</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-100 rounded">Grid Item 1</div>
                  <div className="p-4 bg-neutral-100 rounded">Grid Item 2</div>
                  <div className="p-4 bg-neutral-100 rounded">Grid Item 3</div>
                </div>
              </div>
              
              <div className="mt-6 text-right">
                <button
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  onClick={() => {
                    alert('Tailwind loaded: ' + diagnosticData.tailwindDetected);
                  }}
                >
                  Test Interactive Elements
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Fix Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps</h3>
        <ol className="list-decimal ml-5 space-y-1 text-sm text-yellow-800">
          <li>Restart the development server</li>
          <li>Clear browser cache and refresh</li>
          <li>Check browser console for CSS-related errors</li>
          <li>Verify PostCSS plugins in craco.config.js</li>
          <li>Ensure Tailwind directives are in index.css</li>
        </ol>
      </div>
    </div>
  );
};

export default CssDiagnosticTool;
