/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            keyframes: {
                pop: {
                    '0%': { transform: 'scale(0)' },
                    '100%': { transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [require('tailwind-scrollbar')],
};
