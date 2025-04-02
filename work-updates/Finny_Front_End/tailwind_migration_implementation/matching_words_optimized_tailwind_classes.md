# MatchingWordsOptimized Component - Tailwind CSS Implementation

Finny Frontend  
March 31, 2025

## Overview

This document provides a detailed class-by-class implementation of how the MatchingWordsOptimized component would look using Tailwind CSS. This ensures we maintain the exact functionality created by Alex while modernizing the styling approach.

## JSX Structure with Tailwind Classes

Below is the component structure with CSS classes replaced by Tailwind equivalents. I'm maintaining the exact same component structure and functionality while only replacing the styling approach.

```jsx
// Main container
<div className="relative w-full my-4 p-4 rounded-lg bg-gray-50 shadow-sm" ref={containerRef}>
  <div className="flex relative min-h-[300px]">
    {/* Left column (word bank) */}
    <div className="flex-1 relative mx-4">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Items</h3>
      <ul className="list-none p-0 m-0">
        {wordBank.map((item, index) => (
          <li 
            key={`word-${index}`}
            ref={ref => registerWordBankRef(item, ref)}
            className={`
              relative p-3 mb-3 bg-white rounded-md border-2 border-gray-200 
              cursor-pointer transition-all duration-200 flex items-center justify-between 
              text-base shadow-sm hover:border-blue-200 hover:bg-blue-50
              ${selectedItem === item ? 'border-blue-500 bg-blue-50' : ''} 
              ${studentAnswers[item] ? 'border-green-500 bg-green-50' : ''} 
              ${isCorrectMatch(item) ? 'border-green-500 bg-green-50' : ''} 
              ${isIncorrectMatch(item) ? 'border-red-500 bg-red-50' : ''}
            `}
            onClick={() => handleWordBankItemClick(item)}
            data-testid={`word-bank-item-${index}`}
          >
            <span className="item-content">{item}</span>
            
            {/* Mobile view dropdown */}
            {isMobile && (
              <div className="w-full mt-2">
                <select
                  className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                  value={getMatchOptionForItem(item)}
                  onChange={(event) => handleSelectionChange(item, event)}
                  disabled={readOnly}
                >
                  <option value="">Select...</option>
                  {getAvailableOptions(item).map((option, optIndex) => (
                    <option key={`mobile-option-${optIndex}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
    
    {/* Connection area - only for desktop */}
    {!isMobile && (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {connections.map(conn => (
          <div
            key={conn.id}
            className={`
              absolute h-0.5 transform-gpu origin-top-left
              ${conn.isCorrect ? 'bg-green-500' : 'bg-blue-500'}
            `}
            style={{
              width: `${conn.length}px`,
              left: `${conn.sourceX}px`,
              top: `${conn.sourceY}px`,
              transform: `rotate(${conn.angle}deg)`,
              transformOrigin: '0 0'
            }}
          />
        ))}
      </div>
    )}
    
    {/* Right column (match options) */}
    {!isMobile && (
      <div className="flex-1 relative mx-4">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Matches</h3>
        <ul className="list-none p-0 m-0">
          {matchOptions.map((option, index) => (
            <li 
              key={`option-${index}`}
              ref={ref => registerOptionRef(option, ref)}
              className={`
                relative p-3 mb-3 bg-white rounded-md border-2 border-gray-200 
                cursor-pointer transition-all duration-200 flex items-center justify-between 
                text-base shadow-sm hover:border-blue-200 hover:bg-blue-50
                ${isOptionSelected(option) ? 'border-green-500 bg-green-50' : ''} 
                ${selectedItem && !isOptionSelected(option) ? 'border-blue-500 bg-blue-50 animate-pulse' : ''}
              `}
              onClick={() => handleMatchOptionClick(option)}
              data-testid={`match-option-item-${index}`}
            >
              <span className="item-content">{option}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
  
  {/* Debug information */}
  {DEBUG && (
    <div className="mt-6 p-4 border-t border-dashed border-gray-300 font-mono text-sm">
      <details>
        <summary>Debug Information</summary>
        <div className="mt-4">
          <h4 className="m-2 text-gray-600">Selected Item:</h4>
          <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
        </div>
        <div className="mt-4">
          <h4 className="m-2 text-gray-600">Student Answers:</h4>
          <pre>{JSON.stringify(studentAnswers, null, 2)}</pre>
        </div>
        <div className="mt-4">
          <h4 className="m-2 text-gray-600">Correct Answer:</h4>
          <pre>{JSON.stringify(correctAnswer, null, 2)}</pre>
        </div>
      </details>
    </div>
  )}
</div>
```

## Responsive Handling with Tailwind

The original component uses media queries for responsive behavior. With Tailwind, we'll use responsive prefixes:

```jsx
// Mobile-specific variant
<div className="flex flex-col md:flex-row">
  {/* Content that changes based on screen size */}
</div>

// Hide on mobile, show on larger screens
<div className="hidden md:block">
  {/* Desktop-only content */}
</div>

// Show on mobile, hide on larger screens
<div className="block md:hidden">
  {/* Mobile-only content */}
</div>
```

## Animation Configuration for Tailwind

To support the pulse animation for selectable items, we'll need to add this to our tailwind.config.js:

```js
// Add to tailwind.config.js
module.exports = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' 
          },
          '70%': { 
            boxShadow: '0 0 0 6px rgba(59, 130, 246, 0)' 
          },
        },
      },
    },
  },
  // ... other config
}
```

## State Management Classes

The component has multiple states that need specific styling. Here's how we'll handle them with Tailwind:

### Selected State
```jsx
// Before: className="word-bank-item selected"
// After:
<li className={`
  relative p-3 mb-3 bg-white rounded-md border-2 
  ${selectedItem === item ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
`}>
```

### Matched State
```jsx
// Before: className="word-bank-item matched"
// After:
<li className={`
  relative p-3 mb-3 bg-white rounded-md border-2
  ${studentAnswers[item] ? 'border-green-500 bg-green-50' : 'border-gray-200'}
`}>
```

### Correct/Incorrect States
```jsx
// Before: className="word-bank-item correct/incorrect"
// After:
<li className={`
  relative p-3 mb-3 bg-white rounded-md border-2
  ${isCorrectMatch(item) ? 'border-green-500 bg-green-50' : ''}
  ${isIncorrectMatch(item) ? 'border-red-500 bg-red-50' : ''}
`}>
```

## Accessibility Considerations

For maintaining accessibility, we'll use:

```jsx
// Focus states
<li className="... focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">

// High contrast mode can be handled with Tailwind's dark mode feature
// or with custom media queries in the tailwind.config.js
```

## Special Cases

### Connection Lines

The connection lines require absolute positioning and transformation, which still needs inline styles for dynamic values:

```jsx
<div
  className="absolute h-0.5 bg-blue-500 transform-gpu origin-top-left"
  style={{
    width: `${conn.length}px`,
    left: `${conn.sourceX}px`,
    top: `${conn.sourceY}px`,
    transform: `rotate(${conn.angle}deg)`,
    transformOrigin: '0 0'
  }}
/>
```

## Implementation Strategy

To implement this migration safely:

1. First, create a copy of the component with the new Tailwind classes
2. Test thoroughly in isolation
3. Once verified, replace the original component
4. Remove the CSS file after confirming everything works

## Testing Considerations

We'll need to test:

1. All interactive states (selecting, matching, correct/incorrect)
2. Mobile vs desktop layouts
3. Connection line rendering
4. Focus states and keyboard navigation
5. Screen reader compatibility

## Conclusion

This implementation preserves all of Alex's functionality while modernizing the styling approach. By replacing CSS classes with Tailwind utilities, we'll improve maintainability and consistency with our design system without affecting the behavior users expect.
