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
        cyber: {
          bg: '#090d16',
          bgAlt: '#0d1322',
          surface: '#0f172a',
          surfaceHover: '#16223b',
          border: '#1e293b',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          accent: '#3b82f6',
          accentLight: '#60a5fa',
          accentDark: '#1d4ed8',
          safe: '#10b981',
          safeGlow: 'rgba(16, 185, 129, 0.15)',
          warning: '#f59e0b',
          warningGlow: 'rgba(245, 158, 11, 0.15)',
          danger: '#f43f5e',
          dangerGlow: 'rgba(244, 63, 94, 0.2)',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          dark: '#090d16',
          card: '#0f172a',
          cardBorder: '#1e293b',
          primary: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'scanline': 'scanline 2s ease-in-out infinite',
        'radar-pulse': 'radarPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-crimson': 'glowCrimson 2s ease-in-out infinite alternate',
        'glow-blue': 'glowBlue 2s ease-in-out infinite alternate',
        'glow-emerald': 'glowEmerald 2s ease-in-out infinite alternate',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        radarPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        glowCrimson: {
          '0%': { boxShadow: '0 0 15px rgba(244, 63, 94, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(244, 63, 94, 0.55)' },
        },
        glowBlue: {
          '0%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(59, 130, 246, 0.5)' },
        },
        glowEmerald: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(16, 185, 129, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
