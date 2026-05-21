/* eslint-env node */
const ERROR = 2;
const IGNORE = 0;
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [ERROR, 'always', 100],
        'scope-case': [IGNORE, 'always', 'lower-case'],
        'subject-case': [IGNORE, 'always', 'lower-case'],
        // Each type is documented (with its meaning for our changelog) in
        // src/commits-and-prs.md, and listed without descriptions in
        // CONTRIBUTING.md. Keep all three in sync when adding or removing one.
        'type-enum': [
            ERROR,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'build',
                'ci',
                'chore',
                'revert',
            ],
        ],
    },
};
