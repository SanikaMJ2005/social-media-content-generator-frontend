/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#020617",
                foreground: "#f8fafc",
                card: "#0f172a",
                primary: {
                    DEFAULT: "#3b82f6",
                    hover: "#2563eb",
                },
            },
        },
    },
    plugins: [],
}
