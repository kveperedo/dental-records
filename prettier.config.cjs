/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    bracketSpacing: true,
    singleQuote: true,
    jsxSingleQuote: true,
    plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
