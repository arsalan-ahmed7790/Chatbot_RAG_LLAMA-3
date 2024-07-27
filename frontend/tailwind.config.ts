import type { Config } from 'tailwindcss';
import theme from 'tailwindcss/defaultTheme';

export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...theme.fontFamily.sans]
            }
        }
    },
    plugins: []
} satisfies Config;
