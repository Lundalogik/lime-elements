# Lime Elements

This package includes basic components like buttons, loading-spinners, etcetera.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

To start the dev-server, run `npm start`.

To build the dist build, run `npm run build`.

## Requirements

The "Roboto" font is included for development purposes, but is not included in the published package. This font should be supplied by the consuming application. If not supplied, texts will fall back to suitable alternatives.

## Deploy documentation

Documentation is deployed to GitHub Pages when a new release is built by Jenkins. It can also be deployed manually from a Linux or macOS computer. *NB! Running the publish script locally will update your git config for the repository with the values of the GIT_AUTHOR_EMAIL and GIT_AUTHOR_NAME environment variables. If you set these to anything other than your own user, you may wish to update your config again after publishing. The script will also make changes to a few files, and will checkout these again at the end. Any uncommitted changes you've made to these files **will be lost**. The script also removes the local copy of the branch gh-pages.*

Follow these steps:

1. The following environment variables must be set:
  - GIT_AUTHOR_EMAIL - the email address for the user making the commit
  - GIT_AUTHOR_NAME - the name of the user making the commit
  - GH_TOKEN - a GitHub access-token with write-access to the repository
  - GH_USERNAME - the GitHub user to which the above access-token belongs
2. Run `git fetch`.
3. Run `git branch` and make sure you do *not* have a local copy of the branch `gh-pages`. If you do, push anything that should be pushed, and remove the local branch.
4. From the repo-root, run `npm run docz:publish -- --v=<version>`, where `<version>` is the version of lime-elements you are building the documentation for. **Any existing documentation for this version number will be overwritten.** If no version is supplied, the version will be set to `0.0.0-dev`. If `--dryRun=true` is supplied, the entire script will run, except the push to GitHub.

## Get help

- Please open a GitHub issue for support, troubleshooting and questions.
