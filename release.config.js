/* eslint-env node */
module.exports = {
    branches: ['master'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/git',
        '@semantic-release/github',
        [
            '@semantic-release/exec',
            {
                publishCmd:
                    // eslint-disable-next-line no-template-curly-in-string
                    'npm run docs:publish -- --v=${nextRelease.version} --dryRun=${options.dryRun}',
            },
        ],
    ],
    npmPublish: true,
};
