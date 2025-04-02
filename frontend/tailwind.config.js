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
      spacing: {
        // We'll use Tailwind's default spacing scale
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
  // Safelist ensures these classes are not purged
  safelist: [
    // Common button classes
    'btn', 'btn-primary', 'btn-secondary', 'btn-outline',
    // Common background colors
    'bg-primary', 'bg-secondary', 'bg-error', 'bg-success', 'bg-warning', 'bg-info',
    // Common text colors
    'text-primary', 'text-secondary', 'text-error', 'text-success', 'text-warning', 'text-info',
    // Common border colors
    'border-primary', 'border-secondary', 'border-error',
    // Common other classes
    'rounded', 'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg'
  ],
  plugins: [
    // Add any plugins here if needed
  ],
}