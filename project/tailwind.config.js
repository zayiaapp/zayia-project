/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zayia: {
          'deep-violet': '#7C3AED',
          'soft-purple': '#A855F7',
          'lavender': '#C084FC',
          'lilac': '#E9D5FF',
          'periwinkle': '#8B5CF6',
          'amethyst': '#9333EA',
          'orchid': '#D946EF',
          'plum': '#A21CAF',
          'violet-gray': '#6B7280',
          'pearl': '#F8FAFC',
          'cream': '#FEFBFF',
        }
      },
      backgroundImage: {
        'zayia-sunset': 'linear-gradient(135deg, #7C3AED, #A855F7)',
        'zayia-dream': 'linear-gradient(135deg, #A855F7, #C084FC)',
        'zayia-soft': 'linear-gradient(135deg, #C084FC, #E9D5FF)',
        'zayia-glow': 'linear-gradient(135deg, #8B5CF6, #D946EF)',
        'zayia-mystical': 'linear-gradient(135deg, #7C3AED, #9333EA, #C084FC)',
        'zayia-gentle': 'linear-gradient(135deg, #E9D5FF, #FEFBFF)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}