# Contributing to lime-elements

✨ Thanks for contributing to **lime-elements**! ✨

These guidelines are based on the [contributing guidelines](https://github.com/semantic-release/semantic-release/blob/45eee4acdd2a213672466369bcf0a04cd39ee0e1/CONTRIBUTING.md) from **[semantic-release](https://github.com/semantic-release/semantic-release)**.

As a contributor, here are the guidelines we would like you to follow:
- [Code of conduct](#code-of-conduct)
- [How can I contribute?](#how-can-i-contribute)
- [Using the issue tracker](#using-the-issue-tracker)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Coding rules](#coding-rules)
- [Working with the code](#working-with-the-code)

We also recommend that you read [How to Contribute to Open Source](https://opensource.guide/how-to-contribute).

## Code of conduct

Help us keep **lime-elements** open and inclusive. Please read and follow our [Code of conduct](CODE_OF_CONDUCT.md).

## How can I contribute?

### Improve documentation

As a **lime-elements** user, you are the perfect candidate to help us improve our documentation: typo corrections, clarifications, more examples, etc. Take a look at the [documentation issues that need help](https://github.com/Lundalogik/lime-elements/issues?q=is%3Aopen+is%3Aissue+label%3Adocs+label%3A%22help+wanted%22).

Please follow the [Documentation guidelines](#documentation).

### Give feedback on issues

Some issues are created without information requested in the [Bug report guideline](#bug-report). Help make them easier to resolve by adding any relevant information.

Issues with the [design label](https://github.com/Lundalogik/lime-elements/issues?q=is%3Aopen+is%3Aissue+label%3Adesign) are meant to discuss the implementation of new features. Participating in the discussion is a good opportunity to get involved and influence the future direction of **lime-elements**.

### Fix bugs and implement features

Confirmed bugs and ready-to-implement features are marked with the [help wanted label](https://github.com/Lundalogik/lime-elements/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22). Post a comment on an issue to indicate you would like to work on it and to request help from the [@lime-elements/maintainers](https://github.com/orgs/Lundalogik/teams/lime-elements-maintainers) and the community.

## Using the issue tracker

The issue tracker is the channel for [bug reports](#bug-report), [features requests](#feature-request) and [submitting pull requests](#submitting-a-pull-request) only. Please use the [Get help](README.md#get-help) section for support, troubleshooting and questions.

Before opening an issue or a Pull Request, please use the [GitHub issue search](https://github.com/issues?utf8=%E2%9C%93&q=repo%3ALundalogik%2Flime-elements) to make sure the bug or feature request hasn't been already reported or fixed.

### Bug report

A good bug report shouldn't leave others needing to chase you for more information. Please try to be as detailed as possible in your report and fill the information requested in the [Bug report template](https://github.com/Lundalogik/lime-elements/issues/new?template=bug-report.md).

### Feature request

Feature requests are welcome, but take a moment to find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Please provide as much detail and context as possible and fill the information requested in the [Feature request template](https://github.com/Lundalogik/lime-elements/issues/new?template=feature-request.md).

## Submitting a Pull Request

Good pull requests, whether patches, improvements, or new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

**Please ask first** before embarking on any significant pull requests (e.g. implementing features, refactoring code), otherwise you risk spending a lot of time working on something that the project's developers might not want to merge into the project.

If you have never created a pull request before, welcome 🎉 😄. [Here is a great tutorial](https://opensource.guide/how-to-contribute/#opening-a-pull-request) on how to send one :)

Here is a summary of the steps to follow:

1. [Set up the workspace](#set-up-the-workspace)
2. Always get the latest changes from upstream and update dependencies:
```bash
$ git checkout master
$ git pull -r upstream master
$ rm -rf node_modules
$ npm install
```
3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:
```bash
$ git checkout -b <topic-branch-name>
```
4. Make your code changes, following the [Coding rules](#coding-rules)
5. Push your topic branch up to your fork:
```bash
$ git push origin <topic-branch-name>
```
6. [Open a Pull Request](https://help.github.com/articles/creating-a-pull-request/#creating-the-pull-request) with a clear title and description.

**Tips**:
- For ambitious tasks, open a Pull Request as soon as possible with the `[WIP]` prefix in the title, in order to get feedback and help from the community.
- [Allow lime-elements maintainers to make changes to your Pull Request branch](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork). This way, we can rebase it and make some minor changes if necessary. All changes we make will be done in new commit and we'll ask for your approval before merging them.

## Coding rules

### Source code

To ensure consistency and quality throughout the source code, all code modifications must have:
- No [linting](#lint) errors
- (A [test](#tests) for every possible case introduced by your code change) This will be a future requirement, but at the moment, we don't have a test-environment that lets us easily test what we need to. So this requirement is relaxed for the time being.
- [Valid commit message(s)](#commit-message-guidelines)
- Documentation for new features
- Updated documentation for modified features

### <a name="commit"></a> Commit Message Guidelines

#### Atomic commits

If possible, make [atomic commits](https://en.wikipedia.org/wiki/Atomic_commit), which means:
- a commit should contain exactly one self-contained functional change
- a functional change should be contained in exactly one commit
- a commit should not create an inconsistent state (such as test errors, linting errors, partial fix, feature with documentation etc...)

A complex feature can be broken down into multiple commits as long as each one maintains a consistent state and consists of a self-contained change.

#### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The **footer** can contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/).

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

**lime-elements** is [**commitizen**](https://commitizen.github.io/cz-cli/) friendly, and has **commitizen** installed locally. When committing, you are encouraged to use **commitizen** instead of `git commit`, to help ensure a valid commit message.

To commit using **commitizen**, run either

```bash
$ npm run cm
```

or

```bash
$ npx git-cz
```

If you install **commitizen** globally (`npm i -g commitizen`), you can run:

```bash
$ git cz
```

#### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

#### Type
Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

#### Scope
The scope should be the name of the component affected (as perceived by the person reading the changelog generated from commit messages).

#### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

#### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y).

#### Examples

```commit
`fix(pencil): stop graphite breaking when too much pressure applied`
```

```commit
`feat(pencil): add 'graphiteWidth' option`

Fix #42
```

```commit
perf(pencil): remove graphiteWidth option`

BREAKING CHANGE: The graphiteWidth option has been removed.

The default graphite width of 10mm is always used for performance reasons.
```

## Working with the code

### Set up the workspace

[Fork](https://guides.github.com/activities/forking/#fork) the project, [clone](https://guides.github.com/activities/forking/#clone) your fork, configure the remotes and install the dependencies:

```bash
# Clone your fork of the repo into the current directory
$ git clone https://github.com/Lundalogik/lime-elements
# Navigate to the newly cloned directory
$ cd lime-elements
# Assign the original repo to a remote called "upstream"
$ git remote add upstream https://github.com/Lundalogik/lime-elements
# Install the dependencies
$ npm install
```

### Lint

The **lime-elements** repository uses [tslint](https://palantir.github.io/tslint/) and [eslint](https://eslint.org/) for linting and [Prettier](https://prettier.io) for formatting. Prettier formatting will be automatically verified by tslint.

To lint all files, run:

```bash
$ npm run lint
```

**Tips**:
- Most linting errors can be automatically fixed with `npm run lint:fix`.

### Tests

Before pushing your code changes make sure all **tests pass** and that you have added tests for every possible case introduced by your code change:

```bash
$ npm run test
```

**Tips:** During development you can:
- run in watch mode with `npm run test.watch` to automatically run a test file when you modify it
- run only the test you are working on by adding `.only` to the test definition

```js
test('will not be run', t => {
    t.fail();
});

test.only('will be run', t => {
    t.pass();
});
```
