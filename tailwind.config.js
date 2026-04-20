/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        photoAppear: 'photoAppear 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        recordingRipple: 'recordingRipple 1.2s infinite',
        idleRipple: 'idleRipple 2.5s infinite',
        blink: 'blink 1s infinite',
        flashAnim: 'flashAnim 0.5s ease-out forwards',
        slideUp: 'slideUp 0.3s ease-out',
      },
      keyframes: {
        photoAppear: {
          '0%': { opacity: '0', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        recordingRipple: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        idleRipple: {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '20%': { opacity: '0.5' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        blink: {
          '50%': { opacity: '0.4' },
        },
        flashAnim: {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
