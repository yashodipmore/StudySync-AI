/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'cream': '#FFFCFA',
        'light-orange': '#FFF8F3',
        'soft-orange': '#FFF0E6',
        'peach': '#FFE4D6',
        'brand-orange': '#FF9F5A',
        'deep-orange': '#FF8534',
        'dark-orange': '#E67320',
        'border-light': '#D4CFC9',
        'border-dark': '#A89F97',
        // Dark mode colors
        'dark-bg': '#0F0F0F',
        'dark-card': '#1A1A1A',
        'dark-card-hover': '#252525',
        'dark-border': '#3A3A3A',
        'dark-border-strong': '#4A4A4A',
        'dark-text': '#F5F5F5',
        'dark-text-muted': '#A0A0A0',
      },
      borderRadius: {
        'card': '20px',
        'button': '14px',
        'input': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
