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
                    'npm run docz:publish -- --v=${nextRelease.version} --dryRun=${options.dryRun}',
            },
        ],
    ],
    npmPublish: true,
};
