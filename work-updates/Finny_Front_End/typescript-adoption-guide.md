Finny Frontend  
April 3, 2025  
Subject: TypeScript Adoption Guide

# TypeScript Adoption Guide for the LMS Project

This guide explains how we've integrated TypeScript into our React + Tailwind CSS project and provides guidelines for ongoing migration.

## What We've Done

1. **TypeScript Installation**: Added TypeScript and necessary type definitions to our project
2. **Configuration**: Created a proper `tsconfig.json` with settings optimized for our React project
3. **Type Definitions**: Created base type definitions for our exercise components in `/src/types/`
4. **Component Migration**: Converted the `MatchingExerciseAdapter` component to TypeScript as a proof-of-concept
5. **Tailwind Integration**: Updated our Tailwind configuration to work well with TypeScript

## Folder Structure for Types

We've created a standardized structure for our TypeScript definitions:

```
/frontend/src/types/
  /exercises.ts  - Exercise data structures
  /components.ts - Component props interfaces
  /api.ts        - API request/response types
  /utils.ts      - Utility types and helpers
```

## Migration Strategy

We're adopting a **gradual migration approach**:

1. **File-by-file migration**: Convert one file at a time from `.jsx` to `.tsx`
2. **Bottom-up approach**: Start with leaf components before container components
3. **Type-as-you-go**: Add types when working on new features or fixing bugs

## How to Convert a Component to TypeScript

Follow these steps when converting a component:

1. **Rename the file** from `.jsx` to `.tsx`
2. **Import necessary types** from our `/types` directory
3. **Add interfaces** for component props
4. **Add type annotations** to state hooks, functions, and variables
5. **Replace PropTypes** with TypeScript interfaces
6. **Run type checking** with `npm run type-check` to catch errors

## Example Conversion

Before (JavaScript with PropTypes):
```jsx
import PropTypes from 'prop-types';

const Button = ({ variant, size, children, onClick }) => {
  // Component implementation
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
};

export default Button;
```

After (TypeScript):
```tsx
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}) => {
  // Component implementation
};

export default Button;
```

## TypeScript with Tailwind CSS

TypeScript and Tailwind work together perfectly:

1. **TypeScript**: Handles component logic, props, and data structures
2. **Tailwind**: Handles styling through utility classes

Example with both:
```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

const Card: React.FC<CardProps> = ({ title, children, variant = 'default' }) => {
  // Map variants to Tailwind classes
  const variantClasses = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md'
  };

  return (
    <div className={`rounded-lg p-4 ${variantClasses[variant]}`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};
```

## TypeScript Conventions

Following these conventions will help maintain consistency:

1. **Interface naming**: 
   - Use `PascalCase` for interfaces
   - Suffix props interfaces with `Props` (e.g., `ButtonProps`)
   - Prefix state interfaces with component name (e.g., `ExerciseState`)

2. **Type annotations**:
   - Add return types to functions (`function getName(): string`)
   - Add types to React state (`useState<string>('')`)
   - Use proper event types (`React.MouseEvent`, `React.ChangeEvent<HTMLInputElement>`)

3. **Import organization**:
   - Group imports by type (React, third-party, local components, types)
   - Import types with explicit `type` specifier when possible

## Common Type Patterns

### Component Props
```tsx
interface ComponentProps {
  // Required props
  name: string;
  
  // Optional props (note the ? symbol)
  description?: string;
  
  // Function props with defined signatures
  onChange?: (value: string) => void;
  
  // React elements
  children?: React.ReactNode;
  
  // Specific literal values
  variant?: 'primary' | 'secondary';
  
  // Complex objects
  config?: {
    maxItems: number;
    showLabels: boolean;
  };
}
```

### React Hooks
```tsx
// State hook with type
const [items, setItems] = useState<string[]>([]);

// Ref with type
const inputRef = useRef<HTMLInputElement>(null);

// Effect with proper dependency typing
useEffect(() => {
  // Effect code
}, [id, name]); // TypeScript checks these dependencies exist
```

## Helpful Resources

1. [TypeScript React Cheatsheet](https://github.com/typescript-cheatsheets/react)
2. [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
3. [Tailwind CSS + TypeScript](https://tailwindcss.com/docs/editor-setup)

## Next Steps

1. Add types for all exercise data structures
2. Convert core UI components to TypeScript
3. Add API response types for backend communication
4. Gradually migrate container components and pages

## Running Type Checking

To check your TypeScript code:

```bash
# Run TypeScript compiler in check mode (no output files generated)
npm run type-check

# Or directly with tsc
npm run tsc
```

---

If you have any questions about TypeScript integration or need help converting a component, feel free to reach out to me (Finny)!
