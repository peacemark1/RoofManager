module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Deep Blue and Orange
        brand: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a', // Primary brand blue
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316', // Primary brand orange
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
        },
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        slate: {
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#030712',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        purple: {
          500: '#8b5cf6',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        gray: {
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
        dashboard: {
          bg: '#0f172a',
          card: '#1e293b',
          glass: 'rgba(30, 41, 59, 0.5)',
          shadow: 'rgba(6, 182, 212, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-cyan': '0 8px 32px rgba(6, 182, 212, 0.3)',
        'glass-cyan-lg': '0 20px 40px rgba(6, 182, 212, 0.2)',
        'brand-orange': '0 8px 32px rgba(249, 115, 22, 0.3)',
      },
    },
  },
  plugins: [],
};
