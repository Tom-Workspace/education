import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primSky: {
          300: 'rgb(9, 111, 144)',
          500: 'rgb(17, 186, 240)',
          800: 'rgb(159, 227, 249)',
          900: 'rgb(231, 248, 253)',
          950: 'rgb(231, 248, 253)',
        },
        Olive: {
          50: 'rgb(251, 251, 234)',
          200: '#e9eea8',
          500: 'rgb(164, 181, 45)',
          400: 'rgb(195, 209, 79)',
        },
        pistachio: {
          400: 'rgb(148, 201, 82)',
        },
        midNight: {
          900: '#125667',
          800: '#10697a',
          100: 'rgb(205, 255, 254)',
          950: 'rgb(6, 69, 86)',

        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: '#0ef', boxShadow: '0 0 25px #0ef' },
          '50%': { borderColor: '#11baf0', boxShadow: '0 0 40px #11baf0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1'},
          '50%': { opacity: '0.8'},
        },
        
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(5deg)' },
          '75%': { transform: 'translateY(10px) rotate(-5deg)' },
        },
        diagonalMove: {
          '0%': { transform: 'rotate(30deg) skewY(40deg) translateX(0) translateY(0)', opacity: '0.8' },
          '20%': { transform: 'rotate(20deg) skewY(35deg) translateX(-30px) translateY(30px)', opacity: '0.9' },
          '40%': { transform: 'rotate(10deg) skewY(25deg) translateX(-60px) translateY(60px)', opacity: '1' },
          '60%': { transform: 'rotate(0deg) skewY(15deg) translateX(-90px) translateY(90px)', opacity: '0.9' },
          '80%': { transform: 'rotate(15deg) skewY(30deg) translateX(-45px) translateY(45px)', opacity: '0.8' },
          '100%': { transform: 'rotate(30deg) skewY(40deg) translateX(0) translateY(0)', opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        wave: {
          '0%': { transform: 'translateY(0) rotate(0)' },
          '25%': { transform: 'translateY(-15px) rotate(-2deg)' },
          '50%': { transform: 'translateY(0) rotate(0)' },
          '75%': { transform: 'translateY(15px) rotate(2deg)' },
          '100%': { transform: 'translateY(0) rotate(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUpFade: 'slideUpFade 0.5s ease-out',
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-glow': 'borderGlow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'diagonal-move': 'diagonalMove 15s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'wave': 'wave 6s ease-in-out infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
