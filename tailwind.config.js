/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: '#F28C78', dark: '#D9705C', light: '#FBD9D0' },
        cream: '#FFF5E9',
        butter: { DEFAULT: '#F7D78B', light: '#FCEFCB' },
        warm: '#FFFCF8',
        brown: { DEFAULT: '#45372F', soft: '#7A6A60', faint: '#B8ABA2' },
        ok: { DEFAULT: '#78B99A', light: '#DDF0E6', dark: '#3F8A66' },
        warn: { DEFAULT: '#F0AD65', light: '#FCE8D0', dark: '#B86E1F' },
        danger: { DEFAULT: '#D96B6B', light: '#F8DCDC', dark: '#A83F3F' },
      },
      fontFamily: {
        sans: ['Pretendard', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(69,55,47,0.08)',
        lift: '0 8px 24px rgba(69,55,47,0.12)',
      },
    },
  },
  plugins: [],
};
