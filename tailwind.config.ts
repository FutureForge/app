import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', ...fontFamily.sans],
      },
      screens: {
        xs: '375px',
        sm: '425px' /* iPhone 12-15 */,
        xsm: '568px',
        base: '968px' /* Xl Tablets */,
        '2xl': '1980px' /* Larger Monitors */,
      },
      colors: {
        primary: '#3C3C434A',
        background: '#000000',
        'sec-bg': '#252525',
        'sec-btn': '#5856D6',
        'muted-foreground': '#999999',
        foreground: '#F5F5F5',
        special: '#5856D6',
        'special-bg': '#1B1F26B8',
        'dialog-border': '#2C2C2C',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        overlayHide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        dialogShow: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dialogHide: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
        },
        caretBlink: {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(4px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-4px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'overlay-show': 'overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'overlay-hide': 'overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'dialog-show': 'dialogShow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'dialog-hide': 'dialogHide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'caret-blink': 'caretBlink 1.2s ease-out infinite',
        slideDownAndFade: 'slideDownAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
export default config
