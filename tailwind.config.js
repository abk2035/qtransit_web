/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
          light: '#CCFBF1',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        accent: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
        },
        sidebar: {
          DEFAULT: '#0F172A',
          hover: '#1E293B',
          active: '#1E293B',
          border: '#334155',
          text: '#94A3B8',
          textActive: '#FFFFFF',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        status: {
          success: {
            DEFAULT: '#22C55E',
            light: '#DCFCE7',
            border: '#86EFAC',
            text: '#166534',
          },
          warning: {
            DEFAULT: '#F59E0B',
            light: '#FEF3C7',
            border: '#FCD34D',
            text: '#92400E',
          },
          danger: {
            DEFAULT: '#EF4444',
            light: '#FEE2E2',
            border: '#FCA5A5',
            text: '#991B1B',
          },
          info: {
            DEFAULT: '#3B82F6',
            light: '#DBEAFE',
            border: '#93C5FD',
            text: '#1E40AF',
          },
        },
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        input: '12px',
        dialog: '20px',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07)',
        dropdown: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      },
      spacing: {
        '18': '4.5rem', // 72px for topbar
        '70': '17.5rem', // 280px for sidebar
      },
    },
  },
  plugins: [],
}
