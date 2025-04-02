# Tailwind CSS Migration Guide

Finny Frontend  
March 30, 2025

## Introduction

This guide provides instructions for migrating our LMS frontend from traditional CSS to Tailwind CSS. We're making this transition early in development to take advantage of Tailwind's utility-first approach, which will streamline our UI development workflow.

## Setup Instructions

1. **Installation**
   Navigate to the frontend directory and run:
   ```bash
   cd frontend
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Configuration**
   The configuration files have already been created:
   - `tailwind.config.js`: Contains paths to scan for classes and theme customization
   - `postcss.config.js`: Configures the PostCSS plugins

3. **CSS Setup**
   The main CSS file (`src/index.css`) has been updated with Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Migration Strategy

### 1. Start with New Components

For new components, use Tailwind utility classes directly:

```jsx
function NewComponent() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800">Title</h2>
      <p className="mt-2 text-gray-600">Content goes here</p>
      <button className="mt-4 px-4 py-2 bg-lms-primary text-white rounded hover:bg-blue-700">
        Click me
      </button>
    </div>
  );
}
```

### 2. Convert Existing Components Gradually

When working on existing components, replace traditional CSS with Tailwind classes:

**Before:**
```jsx
<div className="container">
  <h2 className="heading">Title</h2>
  <p className="content">Content</p>
  <button className="button">Click me</button>
</div>
```

**After:**
```jsx
<div className="max-w-7xl mx-auto p-4">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="mt-2">Content</p>
  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Click me</button>
</div>
```

### 3. Create Reusable Components

For common UI elements, create reusable components:

```jsx
function Button({ children, color = "primary", ...props }) {
  const colors = {
    primary: "bg-lms-primary hover:bg-blue-700",
    secondary: "bg-lms-secondary hover:bg-green-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button 
      className={`px-4 py-2 text-white rounded ${colors[color]}`} 
      {...props}
    >
      {children}
    </button>
  );
}
```

## Tailwind Best Practices

1. **Use the @apply directive sparingly**
   Only use @apply for highly reused patterns:

   ```css
   @layer components {
     .btn-primary {
       @apply px-4 py-2 bg-lms-primary text-white rounded hover:bg-blue-700;
     }
   }
   ```

2. **Responsive Design**
   Use Tailwind's responsive prefixes:

   ```jsx
   <div className="text-sm md:text-base lg:text-lg">
     Responsive text
   </div>
   ```

3. **Dark Mode**
   Use the dark: variant for dark mode styles:

   ```jsx
   <div className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
     Dark mode compatible
   </div>
   ```

4. **CSS Variables to Tailwind Theme**
   We've added our custom colors to the Tailwind theme in `tailwind.config.js`:
   ```js
   theme: {
     extend: {
       colors: {
         'lms-primary': '#3B82F6',
         'lms-secondary': '#10B981',
       },
     },
   },
   ```

## Example Components

See the component examples in the work-updates/Finny_Front_End directory:
- ButtonExample.jsx
- CardExample.jsx

These demonstrate how to create reusable components with Tailwind CSS.

## Timeline

1. **Week 1**: Set up Tailwind, create basic component examples
2. **Week 2-3**: Convert shared UI components (buttons, cards, inputs)
3. **Week 4+**: Gradually migrate page layouts and specific features

## Support

If you have questions about implementing Tailwind CSS in your components, please contact me (Finny) directly. I'm happy to help with the transition!
