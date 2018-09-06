module.exports = {
    extends: ['./tslint.js'],
    linterOptions: {
        exclude: [],
    },

    rules: {
        'no-big-function': false,
        'no-duplicate-string': false,
        'no-identical-functions': false,
        'no-magic-numbers': false,
        'no-submodule-imports': [true, '@stencil/core/testing'],
    },
};
