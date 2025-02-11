/* eslint-env node */
const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = {
    branches: [
        'main',
        '+([0-9])?(.{+([0-9]),x}).x',
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
                writerOpts: {
                    commitPartial: readFileSync(
                        join(__dirname, 'commit.hbs'),
                        'utf-8',
                    ),
                },
            },
        ],
        '@semantic-release/changelog',
        [
            '@semantic-release/exec',
            {
                prepareCmd:
                    // eslint-disable-next-line no-template-curly-in-string
                    'sed -i "s/sonar\\.projectVersion=.*/sonar.projectVersion=${nextRelease.version}/" sonar-project.properties',
            },
        ],
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                assets: [
                    'CHANGELOG.md',
                    'package.json',
                    'package-lock.json',
                    'sonar-project.properties',
                ],
            },
        ],
        [
            '@semantic-release/github',
            {
                failComment: false,
                failTitle: false,
                labels: false,
            },
        ],
    ],
    npmPublish: true,
};
