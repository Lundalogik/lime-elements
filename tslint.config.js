module.exports = {
    extends: ['./tslint.js'],
    linterOptions: {
        exclude: [],
    },

    rules: {
        'jsx-use-translation-function': false,
        'no-submodule-imports': [
            true,
            '@stencil/core/dist/declarations/output-targets',
        ],
    },
};
