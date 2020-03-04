module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 100],
        'scope-case': [0, 'always', 'lower-case'],
        'subject-case': [0, 'always', 'lower-case'],
        'type-enum': [
            2,
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
