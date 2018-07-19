module.exports = {
    extends: ['plugin:prettier/recommended'],
    plugins: ['prettier'],

    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
    },
};
