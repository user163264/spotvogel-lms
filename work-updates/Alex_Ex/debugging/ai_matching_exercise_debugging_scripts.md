# AI Matching Exercise Debugging Scripts

**Date:** March 30, 2025  
**Engineer:** Alex Ex  
**Subject:** Browser console scripts for debugging AI Matching Exercise issues

## Overview

This document contains browser console scripts that can be used to debug the AI Matching Exercise component issues without modifying the source code. These scripts help diagnose both the translation language issue and the component rendering problems.

## Script 1: API Request/Response Monitoring

This script intercepts OpenAI API calls to monitor the exact prompts being sent and responses received:

```javascript
// Run this in the browser console before generating an exercise
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  // Only intercept OpenAI API calls
  if (args[0].includes('openai.com')) {
    console.group('🔍 OpenAI API Call');
    
    // Log the request
    try {
      const requestBody = JSON.parse(args[1].body);
      console.log('📤 Request:', requestBody);
      console.log('📝 Prompt:', requestBody.messages[1].content);
    } catch (e) {
      console.error('Error parsing request:', e);
    }
    
    // Make the actual API call
    const response = await originalFetch(...args);
    
    // Clone the response to read its body without consuming it
    const clone = response.clone();
    
    try {
      const data = await clone.json();
      console.log('📥 Response:', data);
      
      // Check for language issues in translation exercises
      if (data.choices && data.choices[0]?.message?.content) {
        const content = data.choices[0].message.content;
        
        // Try to extract JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedExercise = JSON.parse(jsonMatch[0]);
          console.log('📊 Parsed Exercise:', parsedExercise);
          
          // Check if this is a translation exercise
          if (parsedExercise.question && parsedExercise.question.includes('vertaling')) {
            // Check for English words in translations
            const englishWords = ['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'from', 
                                 'house', 'garden', 'book', 'school', 'bicycle'];
            
            const matchOptions = parsedExercise.match_options || [];
            const foundEnglishWords = matchOptions.filter(word => 
              englishWords.some(engWord => word.toLowerCase().includes(engWord.toLowerCase()))
            );
            
            if (foundEnglishWords.length > 0) {
              console.warn('⚠️ Found potential English words in translations:', foundEnglishWords);
            }
            
            // Check for French indicators
            const frenchChars = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ô', 'ù', 'û', 'ç', 'î', 'ï'];
            const containsFrenchChars = matchOptions.some(word => 
              frenchChars.some(char => word.includes(char))
            );
            
            if (!containsFrenchChars) {
              console.warn('⚠️ No French-specific characters found in translations');
            } else {
              console.log('✅ French characters detected in translations');
            }
          }
        }
      }
    } catch (e) {
      console.error('Error parsing response:', e);
    }
    
    console.groupEnd();
    return response;
  }
  
  // Pass through non-OpenAI calls
  return originalFetch(...args);
};

console.log('✅ OpenAI API monitoring enabled');
```

## Script 2: React Component State Tracking

This script monitors the state of the AI Matching Exercise component:

```javascript
// Run this in the browser console after the page loads
// Find and track the AI Matching Exercise component
function findMatchingComponent() {
  // First try React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools detected, using it to find components');
    const reactInstances = [];
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const renderers = hook.renderers;
    
    if (renderers.size > 0) {
      const renderer = renderers.get(1);
      if (renderer && renderer.findFiberByHostInstance) {
        console.log('React DevTools renderer found');
        // This is complex and depends on React version
      }
    }
  }
  
  // Fallback method - walk the DOM
  console.log('Walking DOM to find React components');
  const fiberKeys = Object.keys(document.querySelector('#root') || document.body)
    .filter(key => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'));
  
  if (fiberKeys.length === 0) {
    console.warn('No React fiber keys found');
    return null;
  }
  
  const fiberKey = fiberKeys[0];
  console.log('Found fiber key:', fiberKey);
  
  function findComponentByName(node, name) {
    if (!node) return null;
    
    // Check if this node is our target
    if (node.stateNode && 
        node.type && 
        typeof node.type === 'function' && 
        node.type.name && 
        node.type.name.includes(name)) {
      return node;
    }
    
    // Check child
    if (node.child) {
      const found = findComponentByName(node.child, name);
      if (found) return found;
    }
    
    // Check sibling
    if (node.sibling) {
      const found = findComponentByName(node.sibling, name);
      if (found) return found;
    }
    
    return null;
  }
  
  const rootFiber = document.querySelector('#root') ? 
    document.querySelector('#root')[fiberKey] : document.body[fiberKey];
  const matchingComponent = findComponentByName(rootFiber, 'Matching');
  
  if (matchingComponent) {
    console.log('Found matching component:', matchingComponent);
    return matchingComponent;
  }
  
  console.warn('Matching component not found');
  return null;
}

// Store component state history
window.componentStateHistory = [];

// Set up state tracking
function trackComponentState() {
  const component = findMatchingComponent();
  if (!component) return;
  
  console.log('Setting up state tracking for:', component.type.name);
  
  // Create a snapshot of current state
  function captureState() {
    try {
      // For AIMatchingExerciseAdapter
      if (component.type.name.includes('AIMatchingExerciseAdapter')) {
        // State indexes depend on how hooks are ordered in the component
        const loadingState = component.memoizedState[0][0];
        const exerciseState = component.memoizedState[2]?.[0];
        const errorState = component.memoizedState[4]?.[0];
        
        const snapshot = {
          component: component.type.name,
          timestamp: new Date().toISOString(),
          loading: loadingState,
          exercise: exerciseState ? {...exerciseState} : null,
          error: errorState
        };
        
        window.componentStateHistory.push(snapshot);
        console.log('State snapshot captured:', snapshot);
        return snapshot;
      }
    } catch (e) {
      console.error('Error capturing state:', e);
    }
    return null;
  }
  
  // Capture initial state
  captureState();
  
  // Set up periodic state capture
  window.stateTrackingInterval = setInterval(captureState, 1000);
  console.log('State tracking started, snapshots will be collected every 1 second');
  
  // Provide a function to analyze the history
  window.analyzeStateHistory = function() {
    if (window.componentStateHistory.length === 0) {
      console.log('No state history recorded yet');
      return;
    }
    
    console.group('Component State History Analysis');
    console.log(`Total snapshots: ${window.componentStateHistory.length}`);
    
    // Check for loading stuck in true
    const loadingStates = window.componentStateHistory.map(s => s.loading);
    const loadingStuck = loadingStates.length > 5 && loadingStates.slice(-5).every(l => l === true);
    console.log(`Loading state stuck at true: ${loadingStuck}`);
    
    // Check for error states
    const errorStates = window.componentStateHistory.filter(s => s.error !== null);
    console.log(`Error states detected: ${errorStates.length}`);
    if (errorStates.length > 0) {
      console.log('Most recent error:', errorStates[errorStates.length - 1].error);
    }
    
    // Check for exercise state changes
    const exerciseChanges = window.componentStateHistory.reduce((count, s, i, arr) => {
      if (i === 0) return 0;
      return s.exercise !== arr[i-1].exercise ? count + 1 : count;
    }, 0);
    console.log(`Exercise state changes: ${exerciseChanges}`);
    
    // Check for potential infinite loops
    const intervalsBetweenSnapshots = [];
    for (let i = 1; i < window.componentStateHistory.length; i++) {
      const prev = new Date(window.componentStateHistory[i-1].timestamp).getTime();
      const curr = new Date(window.componentStateHistory[i].timestamp).getTime();
      intervalsBetweenSnapshots.push(curr - prev);
    }
    
    const averageInterval = intervalsBetweenSnapshots.reduce((sum, val) => sum + val, 0) / 
      intervalsBetweenSnapshots.length;
    
    console.log(`Average time between state changes: ${averageInterval.toFixed(2)}ms`);
    
    // If we have many snapshots with very little time between them, might be an infinite loop
    const potentialInfiniteLoop = window.componentStateHistory.length > 30 && 
      averageInterval < 100;
    
    if (potentialInfiniteLoop) {
      console.warn('⚠️ Potential infinite re-render loop detected!');
    }
    
    // Latest state
    console.log('Latest state:', window.componentStateHistory[window.componentStateHistory.length - 1]);
    
    console.groupEnd();
  };
  
  return component;
}

// Start tracking
trackComponentState();
console.log('Run window.analyzeStateHistory() to see analysis of component state changes');
```

## Script 3: Hard-Coded Translation Prompt Test

This script forces a specific prompt for translation exercises:

```javascript
// Run this in the browser console before generating an exercise
window.forceTranslationPrompt = function() {
  // Get the current lesson content
  const lessonContent = document.querySelector('.lesson-content-textarea')?.value || '';
  if (!lessonContent) {
    console.error('No lesson content found!');
    return;
  }
  
  // Create an explicit Dutch-to-French translation prompt
  window.explicitPrompt = `
  Maak 20 vertaal oefeningen van Nederlands naar Frans (NIET naar Engels). 
  
  BELANGRIJK: Alle vertalingen MOETEN in het Frans zijn, NIET in het Engels.
  
  Voor elk woord:
  - Kies een Nederlands woord uit de tekst hieronder
  - Geef de Franse vertaling (pas français -> anglais)
  - Zorg dat het niveau passend is voor de doelgroep
  
  Baseer je op deze tekst in het Nederlands:
  ${lessonContent}
  
  Resultaat moet de volgende structuur hebben:
  {
    "exercise_type": "matching_words",
    "question": "Koppel elk Nederlands woord aan de juiste Franse vertaling.",
    "word_bank": ["Nederlands woord 1", "Nederlands woord 2", "Nederlands woord 3", "Nederlands woord 4", "Nederlands woord 5"],
    "match_options": ["Franse vertaling 1", "Franse vertaling 2", "Franse vertaling 3", "Franse vertaling 4", "Franse vertaling 5"],
    "correct_answer": {
      "Nederlands woord 1": "Franse vertaling 1",
      "Nederlands woord 2": "Franse vertaling 2",
      "Nederlands woord 3": "Franse vertaling 3",
      "Nederlands woord 4": "Franse vertaling 4", 
      "Nederlands woord 5": "Franse vertaling 5"
    },
    "max_score": 5,
    "grading_type": "auto"
  }
  `;
  
  // Override fetch to inject our prompt
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    if (args[0].includes('openai.com')) {
      try {
        // Parse the request body
        const requestBody = JSON.parse(args[1].body);
        
        // Check if this is a chat completion request
        if (requestBody.messages && requestBody.messages.length > 0) {
          console.log('🔄 Replacing original prompt with explicit translation prompt');
          console.log('📝 Original prompt:', requestBody.messages[1].content);
          
          // Replace the prompt with our explicit version
          requestBody.messages[1].content = window.explicitPrompt;
          
          // Update the request with our modified body
          args[1].body = JSON.stringify(requestBody);
          
          console.log('📝 New prompt:', window.explicitPrompt);
        }
      } catch (e) {
        console.error('Error modifying request:', e);
      }
    }
    
    return originalFetch(...args);
  };
  
  console.log('✅ Explicit translation prompt override enabled');
  console.log('Generate an exercise now, and the explicit Dutch-to-French prompt will be used');
};

// Add an easy way to execute the override
console.log('Run window.forceTranslationPrompt() to enable the explicit translation prompt');
```

## Script 4: Component Mocking and Testing

This script bypasses the API and directly tests the component with pre-defined data:

```javascript
// Run this in the browser console to test component with mock data
window.testMatchingComponent = function() {
  // Mock French exercise data
  const mockFrenchExercise = {
    exercise_type: "matching_words",
    question: "Koppel elk Nederlands woord aan de juiste Franse vertaling.",
    word_bank: ["huis", "tuin", "fiets", "boek", "school"],
    match_options: ["maison", "jardin", "vélo", "livre", "école"],
    correct_answer: {
      "huis": "maison",
      "tuin": "jardin",
      "fiets": "vélo",
      "boek": "livre",
      "school": "école"
    },
    max_score: 5,
    grading_type: "auto"
  };
  
  // Find the component instance
  function findAdapterComponent() {
    // Similar approach as in the state tracking script
    const fiberKeys = Object.keys(document.querySelector('#root') || document.body)
      .filter(key => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'));
    
    if (fiberKeys.length === 0) {
      console.warn('No React fiber keys found');
      return null;
    }
    
    const fiberKey = fiberKeys[0];
    
    function findComponentByName(node, name) {
      if (!node) return null;
      
      if (node.stateNode && node.type && typeof node.type === 'function' && 
          node.type.name && node.type.name.includes(name)) {
        return node;
      }
      
      if (node.child) {
        const found = findComponentByName(node.child, name);
        if (found) return found;
      }
      
      if (node.sibling) {
        const found = findComponentByName(node.sibling, name);
        if (found) return found;
      }
      
      return null;
    }
    
    const rootFiber = document.querySelector('#root') ? 
      document.querySelector('#root')[fiberKey] : document.body[fiberKey];
    return findComponentByName(rootFiber, 'AIMatchingExerciseAdapter');
  }
  
  // Try to inject the mock exercise directly
  const adapter = findAdapterComponent();
  if (!adapter) {
    console.error('AIMatchingExerciseAdapter component not found!');
    
    // Fallback approach - add a button to the UI
    const container = document.querySelector('.exercise-container');
    if (container) {
      const mockButton = document.createElement('button');
      mockButton.textContent = 'Test with Mock French Exercise';
      mockButton.style.padding = '10px';
      mockButton.style.margin = '10px';
      mockButton.style.backgroundColor = '#4CAF50';
      mockButton.style.color = 'white';
      mockButton.style.border = 'none';
      mockButton.style.borderRadius = '4px';
      mockButton.style.cursor = 'pointer';
      
      mockButton.onclick = function() {
        // Try to find the setExercise function in the global namespace
        // This is a hack and may not work in all cases
        const demoPage = document.querySelector('.ai-matching-exercise-demo-page');
        if (!demoPage) {
          alert('Demo page not found!');
          return;
        }
        
        // Access React instance
        const key = Object.keys(demoPage).find(key => key.startsWith('__reactFiber$'));
        if (!key) {
          alert('React instance not found!');
          return;
        }
        
        const fiber = demoPage[key];
        
        // Check for setExercise in component props or state
        if (fiber && fiber.memoizedProps && fiber.memoizedProps.setExercise) {
          fiber.memoizedProps.setExercise(mockFrenchExercise);
          alert('Mock exercise injected via props!');
        } else if (fiber.memoizedState && Array.isArray(fiber.memoizedState)) {
          // Try to find setState function in memoizedState
          for (let i = 0; i < fiber.memoizedState.length; i++) {
            if (Array.isArray(fiber.memoizedState[i]) && typeof fiber.memoizedState[i][1] === 'function') {
              fiber.memoizedState[i][1](mockFrenchExercise);
              alert('Mock exercise injected via state!');
              return;
            }
          }
          alert('Could not find state setter function!');
        } else {
          alert('Could not inject mock exercise!');
        }
      };
      
      container.appendChild(mockButton);
      console.log('Mock exercise button added to the UI');
    } else {
      console.error('Exercise container not found!');
    }
    return;
  }
  
  console.log('AIMatchingExerciseAdapter component found:', adapter);
  
  // Find the setExercise function in the component's state
  let setExercise = null;
  let setLoading = null;
  let setError = null;
  
  try {
    // State indexes based on the order of useState calls
    setExercise = adapter.memoizedState[2]?.[1];
    setLoading = adapter.memoizedState[0]?.[1];
    setError = adapter.memoizedState[4]?.[1];
    
    if (typeof setExercise !== 'function') {
      console.error('setExercise is not a function:', setExercise);
      return;
    }
    
    if (typeof setLoading !== 'function') {
      console.error('setLoading is not a function:', setLoading);
      return;
    }
    
    // Set the mock exercise
    console.log('Setting mock French exercise:', mockFrenchExercise);
    setError(null);
    setLoading(false);
    setExercise(mockFrenchExercise);
    
    console.log('✅ Mock exercise set successfully');
  } catch (e) {
    console.error('Error setting mock exercise:', e);
  }
};

console.log('Run window.testMatchingComponent() to test with mock data');
```

## Script 5: React Hook Error Detection

This script detects React Hook dependency issues:

```javascript
// Run this in the browser console to monitor React Hook dependencies
window.detectHookIssues = function() {
  // Override React hooks to detect issues
  if (!window.React) {
    console.error('React not found in window object!');
    return;
  }
  
  const originalUseEffect = window.React.useEffect;
  window.React.useEffect = function(effect, deps) {
    console.log('useEffect called with deps:', deps);
    
    // Check for missing generateExercise dependency
    const effectStr = effect.toString();
    if (effectStr.includes('generateExercise') && 
        (!deps || !deps.includes('generateExercise'))) {
      console.warn('⚠️ useEffect calls generateExercise but it\'s missing from dependencies!');
    }
    
    return originalUseEffect(effect, deps);
  };
  
  const originalUseCallback = window.React.useCallback;
  window.React.useCallback = function(callback, deps) {
    console.log('useCallback called with deps:', deps);
    
    // Check for unnecessary initialExercise dependency
    const callbackStr = callback.toString();
    if (deps && deps.includes('initialExercise') && !callbackStr.includes('initialExercise')) {
      console.warn('⚠️ useCallback includes initialExercise in deps but doesn\'t use it!');
    }
    
    return originalUseCallback(callback, deps);
  };
  
  console.log('✅ React Hook monitoring enabled');
  console.log('Refresh the page to see hooks being called with their dependencies');
};

console.log('Run window.detectHookIssues() to enable React Hook monitoring');
```

## How to Use These Scripts

1. Open the AI Matching Exercise Demo page in your browser
2. Open the browser's developer tools (F12 or Right-click > Inspect)
3. Go to the Console tab
4. Copy and paste the relevant script
5. Press Enter to run the script
6. Use the exposed functions (like window.analyzeStateHistory()) as needed
7. Generate exercises and observe the logs and behaviors

## Expected Outcomes

These scripts should provide concrete evidence of:

1. Whether the OpenAI API is returning English instead of French translations
2. Whether the React components are experiencing hook dependency issues
3. Whether there are infinite re-render loops
4. Whether direct injection of exercise data works correctly

The results will guide us to the exact nature of the problems without needing to modify the source code.

---

Document prepared by: Alex Ex  
AI Exercise Generation Specialist  
March 30, 2025
