/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./templates/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f2330',
          700: '#274c72',
          600: '#335d8a',
          500: '#45729d',
          400: '#6b92b8',
          300: '#93b7d8',
          200: '#c1d7ed',
          100: '#e6eef7',
          50: '#f5f9ff'
        },
        accent: {
          500: '#c8a45c',
          400: '#d4b676',
          300: '#e0c890',
          200: '#ecdaaa',
          100: '#f8ecc4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 40px rgba(0, 0, 0, 0.12)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
}
