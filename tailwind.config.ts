import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
        },
        extend: {},
    },
    plugins: [],
} satisfies Config;
