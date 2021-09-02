/* eslint-env node */
module.exports = {
    branches: ['main', { name: 'next', prerelease: true }],
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
        '@semantic-release/github',
    ],
    npmPublish: true,
};
