module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 100],
        'scope-case': [0, 'always', 'lower-case'],
    },
};
