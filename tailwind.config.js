/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Interplay Brand Colors
        navy: '#1e3a5f',
        sage: '#6b8e7a',
        'warm-gray': '#5a6c7d',
        'light-gray': '#f7f9fb',

        // Data Visualization
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e67e22',
        info: '#3498db',
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        secondary: ['Source Serif Pro', 'Georgia', 'serif'],
      },
      fontSize: {
        'h1': '2.5rem',
        'h2': '2rem',
        'h3': '1.5rem',
        'h4': '1.25rem',
        'body': '1rem',
        'small': '0.875rem',
      },
      borderRadius: {
        'brand': '8px',
      },
      boxShadow: {
        'brand': '0 2px 8px rgba(30, 58, 95, 0.08)',
      },
      spacing: {
        'brand': '8px',
      },
    },
  },
  plugins: [],
};
