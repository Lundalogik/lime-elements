/* eslint-env node */
const ERROR = 2;
const IGNORE = 0;
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // eslint-disable-next-line no-magic-numbers
        'header-max-length': [ERROR, 'always', 100],
        'scope-case': [IGNORE, 'always', 'lower-case'],
        'subject-case': [IGNORE, 'always', 'lower-case'],
        'type-enum': [
            ERROR,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'switched',
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
