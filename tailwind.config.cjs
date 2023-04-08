/** @type {import('tailwindcss').Config} */
const config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)'],
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

module.exports = config;
