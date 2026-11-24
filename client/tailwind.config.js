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
        vyral: {
          bg: '#10101B',              // Fondo principal
          card: '#1B1929',            // Fondo de tarjetas
          cardHover: '#221F33',       // Hover de tarjetas
          surface: '#252239',         // Superficies secundarias
          surfaceHover: '#2E2B45',    // Hover de superficies
          purple: '#8B3DFF',          // Morado principal
          violet: '#A855F7',          // Violeta
          fuchsia: '#EC4899',         // Fucsia
          cyan: '#22D3EE',            // Cian
          blue: '#4263EB',            // Azul
          green: '#22C55E',           // Verde
          textMain: '#F8FAFC',        // Texto principal
          textMuted: '#A1A1B5',       // Texto secundario
          border: 'rgba(255, 255, 255, 0.07)',
          borderSubtle: 'rgba(168, 85, 247, 0.18)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 8px 30px -4px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'card-hover': '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 0 25px -4px rgba(139, 61, 255, 0.25)',
        'glow-purple': '0 0 25px -4px rgba(139, 61, 255, 0.45)',
        'glow-fuchsia': '0 0 25px -4px rgba(236, 72, 153, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(34, 211, 238, 0.45)',
        'glow-sm': '0 0 12px -2px rgba(168, 85, 247, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
