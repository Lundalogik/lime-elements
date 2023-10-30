# Contributing to lime-elements

✨ Thanks for contributing to **lime-elements**! ✨

These guidelines are based on the [contributing guidelines](https://github.com/semantic-release/semantic-release/blob/45eee4acdd2a213672466369bcf0a04cd39ee0e1/CONTRIBUTING.md) from **[semantic-release](https://github.com/semantic-release/semantic-release)**.

As a contributor, here are the guidelines we would like you to follow:
- [Code of conduct](#code-of-conduct)
- [How can I contribute?](#how-can-i-contribute)
  * [Improve documentation](#improve-documentation)
  * [Give feedback on issues](#give-feedback-on-issues)
  * [Fix bugs and implement features](#fix-bugs-and-implement-features)
- [Using the issue tracker](#using-the-issue-tracker)
  * [Bug report](#bug-report)
  * [Feature request](#feature-request)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Coding rules](#coding-rules)
  * [Source code](#source-code)
  * [Commit Message Guidelines](#commit-message-guidelines)
    + [Atomic commits](#atomic-commits)
    + [Commit Message Format](#commit-message-format)
    + [Revert](#revert)
    + [Type](#type)
    + [Scope](#scope)
    + [Subject](#subject)
    + [Body](#body)
    + [Footer](#footer)
    + [Examples](#examples)
- [Working with the code](#working-with-the-code)
  * [Set up the workspace](#set-up-the-workspace)
  * [Lint](#lint)
  * [Tests](#tests)

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

The issue tracker is the channel for [bug reports](#bug-report), [features requests](#feature-request) and [submitting pull requests](#submitting-a-pull-request). If you have a general question, or are in need of support, please open a [Question issue](https://github.com/Lundalogik/lime-elements/issues/new?template=03_question.md).

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
$ git checkout main
$ git pull -r upstream main
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
- [Allow lime-elements maintainers to make changes to your Pull Request branch](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork). This way, we can rebase it and make some minor changes if necessary. All changes we make will be done in new commits and we'll ask for your approval before merging them.

## Coding rules

### Source code

To ensure consistency and quality throughout the source code, before being accepted and merged to `main`, all code modifications must have:
- No [linting](#lint) errors
- A [test](#tests) for every possible case introduced by your code change
- [Valid commit message(s)](#commit-message-guidelines)
- Documentation for new features
- Updated documentation for modified features

**Please note**:
We will be happy to help you out in meeting these requirements. Don't be afraid to share your code in a pull request even if it doesn't meet the requirements yet.

#### Code Structure

We try to follow a practice known as the "Newspaper code structure", which in short means putting all non-function properties on top; and ordering them with public properties first, then more important private properties, then less important private properties.

So that gives us roughly:
1. `@Prop` properties. (Typically all public properties are decorated with `@Prop`.)
2. `@Event` properties. These are event emitters, and while the emitter itself might not be public, the event _is_, so it's an important part of the component's public API.
3. `@Element` property, if there is one. This isn't necessarily more important than the `@State` properties, but it's unique, so it goes on top.
4. `@State` properties.
5. Any private properties that are _not_ decorated with `@State`. These do not trigger re-renders, so, presumably, they are less central to the functioning of the component.

After the properties, we have the component's functions. To keep some consistency, we typically use something like this order:
1. `constructor`, if there is one.
2. Any of Stencil's lifecycle methods, except for `render`, somewhat in the order we would expect them to be called:
    1. `connectedCallback`
    2. `componentWillLoad`
    3. `componentWillRender`
    4. `componentDidRender`
    5. `componentDidLoad`
    6. `componentShouldUpdate`
    7. `componentWillUpdate`
    8. `componentDidUpdate`
3. `render`. The reason we keep `render` separate is that it is typically a bigger function, and it's special in that almost all components will have one. We put it after the other lifecycle methods because of its size and because it often calls private "sub-render" methods.
4. Currently, we tend to place `@Watch` methods here. There is an argument that each `@Watch` method should come right after the property it watches, but that can easily make the list of public properties harder to read. We might consider placing them all in a group above the other lifecycle methods though. The reason they originally ended up here was that they aren't really meant to be publically callable, but if you make them `private`, the linter will complain that they are declared but never called. So we started making them `protected`, and, following the newspaper code structure principles, it makes sense that `protected` methods should go between `public` ones and `private` ones.
5. Any private methods that return JSX. These are typically called `render[Something]`. For example, `renderActionButtons`.
6. Other private methods. Typically somewhat in the order calls to them appear in the code above.

### Commit Message Guidelines

#### Atomic commits

If possible, make [atomic commits](https://en.wikipedia.org/wiki/Atomic_commit), which means:
- a commit should contain exactly one self-contained functional change
- a functional change should be contained in exactly one commit
- a commit should not create an inconsistent state (such as test errors, linting errors, partial fix, feature with documentation etc...)

A complex feature can be broken down into multiple commits as long as each one maintains a consistent state and consists of a self-contained change.

**Please note**:
Git makes it relatively easy to split and join commits later, and we'll be happy to help format your commits into one or more commits before accepting the pull request. However, it's usually a little easier to join several small commits than to split a large one, so when in doubt, make more and smaller commits.

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

**Please note**:
It's perfectly fine to have temporary commits not following these rules when working on a pull request branch. It's better to make several smaller commits while developing, than to make a single commit that includes more than one change. If necessary, we'll be happy to help you formulate the final commit messages before accepting your pull request. *However*, please make sure to write *some* description of the changes in each commit.

#### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted. This is what git does automatically when using `git revert <hash>`.

#### Type
Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A change to the code's internal structure, with no change to its external behavior
* **revert**: Reverts a previous commit
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
* **chore**: Other changes that don't modify src or test files

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
fix(pencil): stop graphite breaking when too much pressure applied
```

```commit
feat(pencil): add 'graphiteWidth' option

Fix #42
```

```commit
perf(pencil): remove graphiteWidth option

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

### Build

Run `npm start` to make a development build and serve the documentation locally. Then run `npm run watch` in a separate console to automatically rebuild when you save changes.

### Lint

The **lime-elements** repository uses [tslint](https://palantir.github.io/tslint/) and [eslint](https://eslint.org/) for linting and [Prettier](https://prettier.io) for formatting. Prettier formatting will be automatically verified by tslint.

To lint all files, run:

```bash
$ npm run lint
```

**Tips**:
- Most linting errors can be automatically fixed with `npm run lint:fix`.

### Tests

There are two types of tests in **lime-elements**: unit tests (spec), and end-to-end tests (e2e).

Before pushing your code changes make sure all **tests pass** and that you have added tests for every possible case introduced by your code change:

```bash
$ npm run test:all
```

**Tips:** During development you can:
- run unit tests and e2e tests separately with `npm run test` and `npm run test:e2e`, respectively
- run in watch mode with `npm run test:watch` or `npm run test:e2e:watch` to automatically run a test file when you modify it
- run only the test you are working on by adding `.only` to the test definition

```js
test('will not be run', t => {
    t.fail();
});

test.only('will be run', t => {
    t.pass();
});
```

`.only` also works for groups of tests:

```js
describe.only('group with .only', () => {
    test('will be run', () => {
        expect(true).toBe(true);
    });

    test('will also be run', () => {
        expect(true).toBe(true);
    });
});

describe('group without .only', () => {
    test('will not be run', () => {
        expect(true).toBe(false);
    });

    test('will also not be run', () => {
        expect(true).toBe(false);
    });
});
```

### Styling

Please read the Design Guidelines section of the documentation, look at existing code, and feel free to ask any questions on the issue or PR you are working on.
