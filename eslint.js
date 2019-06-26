module.exports = {
    extends: ['plugin:prettier/recommended'],
    plugins: ['prettier'],

    parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
    },
};
