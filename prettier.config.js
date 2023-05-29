/** @type {import('prettier').Config} */
module.exports = {
    singleQuote: true,
    useTabs: false,
    tabWidth: 4,
    maxLineLength: 100,
    plugins: [require('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.ts',
};
