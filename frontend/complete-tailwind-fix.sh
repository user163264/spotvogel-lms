#!/bin/bash
# Comprehensive script to fix Tailwind CSS implementation

echo "=== Starting Tailwind CSS Fix ==="

echo "1. Removing node_modules directory..."
rm -rf node_modules
rm -rf .cache

echo "2. Uninstalling current Tailwind packages..."
npm uninstall tailwindcss postcss autoprefixer

echo "3. Installing compatible versions..."
npm install --save-dev tailwindcss@3.3.2 postcss@8.4.24 autoprefixer@10.4.14 @craco/craco@7.1.0

echo "4. Updating PostCSS configuration..."
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
EOL

echo "5. Updating Tailwind configuration..."
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Modern minimalist color palette
        'primary': {
          light: '#6b8afc',
          DEFAULT: '#3B82F6', // Blue
          dark: '#2563eb',
        },
        'secondary': {
          light: '#34d399',
          DEFAULT: '#10B981', // Green
          dark: '#059669',
        },
        'neutral': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'success': '#22c55e',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
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
      screens: {
        'xs': '475px',
        // Rest use Tailwind defaults
      },
    },
  },
  plugins: [],
}
EOL

echo "6. Updating CRACO configuration..."
cat > craco.config.js << 'EOL'
module.exports = {
  style: {
    postcss: {
      loaderOptions: {
        /* Any postcss-loader configuration options */
      },
    },
  },
};
EOL

echo "7. Ensuring index.css has the correct Tailwind directives..."
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles with Tailwind approach */
@layer base {
  html {
    @apply text-neutral-800 antialiased;
  }
  
  body {
    @apply m-0 bg-neutral-50 font-sans;
  }
  
  code {
    @apply font-mono;
  }
  
  h1 {
    @apply text-3xl font-semibold mb-4;
  }
  
  h2 {
    @apply text-2xl font-semibold mb-3;
  }
  
  h3 {
    @apply text-xl font-medium mb-2;
  }
  
  h4 {
    @apply text-lg font-medium mb-2;
  }
  
  h5, h6 {
    @apply text-base font-medium mb-1;
  }
  
  a {
    @apply text-primary hover:text-primary-dark transition-colors duration-200;
  }
  
  p {
    @apply mb-4 leading-relaxed;
  }
}

/* Common component patterns */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors duration-200;
  }
  
  .btn-primary {
    @apply bg-primary text-white hover:bg-primary-dark;
  }
  
  .btn-secondary {
    @apply bg-secondary text-white hover:bg-secondary-dark;
  }
  
  .btn-outline {
    @apply border border-neutral-300 text-neutral-700 hover:bg-neutral-50;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm p-6;
  }
  
  .form-input {
    @apply w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary;
  }
  
  .form-label {
    @apply block text-sm font-medium text-neutral-700 mb-1;
  }
}

/* Legacy CSS variables for backward compatibility during migration */
:root {
  --primary-color: #3B82F6;
  --secondary-color: #10B981;
  --accent-color: #6b8afc;
  --text-color: #1f2937;
  --light-bg: #f9fafb;
  --border-color: #e5e7eb;
}
EOL

echo "8. Reinstalling all dependencies..."
npm install

echo "=== Tailwind CSS Fix Complete ==="
echo "Please run the following command to start the development server:"
echo "npm run dev"
echo ""
echo "Note: You may need to make this script executable first with:"
echo "chmod +x complete-tailwind-fix.sh"
