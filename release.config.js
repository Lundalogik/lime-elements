/* eslint-env node */
module.exports = {
    branches: [
        'main',
        '+([0-9])?(.{+([0-9]),x}).x',
        { name: 'next', prerelease: true },
        { name: 'dev', prerelease: true },
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
            },
        ],
        '@semantic-release/changelog',
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                message:
                    // eslint-disable-next-line no-template-curly-in-string
                    'chore(release): ${nextRelease.version} [release]\n\n${nextRelease.notes}',
            },
        ],
        [
            '@semantic-release/github',
            {
                failComment: false,
                failTitle: false,
                labels: false,
                releasedLabels: false,
                successComment: false,
            }
        ],
    ],
    npmPublish: true,
};
