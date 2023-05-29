/** @type {import('prettier').Config} */
module.exports = {
    singleQuote: true,
    useTabs: false,
    tabWidth: 4,
    maxLineLength: 90,
    plugins: [require('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.ts',
};
