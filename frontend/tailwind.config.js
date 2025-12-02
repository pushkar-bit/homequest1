
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        ui: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'hm-red': '#D50032',
        'muted': '#555555',
        'neutral-100': '#F5F5F5',
        'neutral-200': '#EDEDED',
        'primary-text': '#111111'
      },
      letterSpacing: {
        tight: '-0.02em',
      }
    },
  },
  plugins: [],
}
