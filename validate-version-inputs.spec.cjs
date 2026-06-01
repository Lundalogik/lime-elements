/* eslint-env node */
/* eslint-disable no-undef */

// Tests for the version/tag input validation used by the docs and backport
// workflows:
//   * `isValidDocsVersion` (the shared module that `publish-docs.cjs` uses)
//   * the `build-docs.yml` inline regex (must match the module)
//   * the `create-backport-branch.yml` `version_re` / `tag_re`
//
// The workflow regexes are read straight from the YAML and executed through
// real `bash`, so these tests exercise the deployed patterns rather than a
// reimplementation, and fail if the workflow and module ever drift apart.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
    isValidDocsVersion,
    DOCS_VERSION_PATTERN,
} = require('./validate-version-inputs.cjs');

const workflow = (name) =>
    fs.readFileSync(
        path.resolve(__dirname, '.github', 'workflows', name),
        'utf8'
    );

// Returns true when bash's `[[ $value =~ $pattern ]]` matches, i.e. exactly
// how the workflows apply these regexes.
const bashRegexMatches = (pattern, value) => {
    try {
        // Run through `/usr/bin/env` rather than a bare `bash` (which
        // `sonarjs/no-os-command-from-path` flags as a PATH-resolution
        // hazard) or a hard-coded `/bin/bash` (which isn't portable — bash
        // lives elsewhere on some containers and on NixOS). `/usr/bin/env`
        // is a fixed absolute path that resolves `bash` via PATH, so it
        // satisfies the linter while still finding bash wherever it lives.
        execFileSync(
            '/usr/bin/env',
            ['bash', '-c', '[[ "$1" =~ $2 ]]', 'bash', value, pattern],
            { stdio: 'ignore' }
        );

        return true;
    } catch {
        return false;
    }
};

const extract = (source, re, label) => {
    const match = source.match(re);
    if (!match) {
        throw new Error(`Could not find ${label} in workflow`);
    }

    return match[1];
};

describe('isValidDocsVersion', () => {
    const valid = [
        '1.2.3',
        '1.2.3-beta.1',
        '0.0.0-dev',
        '8.0.0',
        'PR-123',
        'dev',
        'v1.2.3',
    ];
    const invalid = [
        '', // empty
        '.', // bare dot -> would be `rm -rf .`
        '-', // bare dash
        '-rf', // leading dash, reads as a flag
        '--orphan', // leading dash
        '..', // traversal
        '../../etc', // traversal
        '1.2..3', // embedded `..`
        'a/b', // path separator
        'foo;rm', // shell metacharacter
        '.hidden', // leading dot
        'latest', // reserved symlink name
        'next', // reserved symlink name
    ];

    it.each(valid)('accepts %j', (version) => {
        expect(isValidDocsVersion(version)).toBe(true);
    });

    it.each(invalid)('rejects %j', (version) => {
        expect(isValidDocsVersion(version)).toBe(false);
    });
});

describe('build-docs.yml version validation', () => {
    const yaml = workflow('build-docs.yml');
    const regex = extract(yaml, /=~ (\S+) \]\]/, 'DOCS_VERSION regex');

    it('inlines the same pattern as the shared module', () => {
        expect(regex).toBe(DOCS_VERSION_PATTERN.source);
    });

    it('also guards against `..` and the reserved names', () => {
        expect(yaml).toContain('*..*');
        expect(yaml).toContain('== latest');
        expect(yaml).toContain('== next');
    });

    // The inline regex, run through bash, must agree with the module's
    // pattern on the same inputs.
    it.each([
        '1.2.3',
        '1.2.3-beta.1',
        'PR-123',
        'dev',
        'v1.2.3',
        '.',
        '-rf',
        '--orphan',
        'a/b',
        '',
    ])('matches the module pattern for %j', (value) => {
        expect(bashRegexMatches(regex, value)).toBe(
            DOCS_VERSION_PATTERN.test(value)
        );
    });
});

describe('create-backport-branch.yml version/tag validation', () => {
    const yaml = workflow('create-backport-branch.yml');
    // The workflow composes both patterns from a shared `semver_core`, so
    // reconstruct them here exactly as the workflow does.
    const semverCore = extract(yaml, /semver_core='([^']*)'/, 'semver_core');
    const versionRe = `^${semverCore}$`;
    const tagRe = `^v?${semverCore}$`;

    describe('version_re (e.g. last_release_version)', () => {
        const valid = [
            '1.2.3',
            '1.3.0',
            '0.0.0',
            '1.2.3-beta.1',
            '1.2.3-rc.1.0',
            '1.2.3+build.1', // build metadata
            '999999999.2.3', // 9-digit major (at the cap)
        ];
        const invalid = [
            'v1.2.3', // version inputs are unprefixed
            '1.2.3-..', // empty pre-release identifiers
            '1.2.3-', // empty pre-release
            '1.2', // not full semver
            '01.2.3', // leading zero in major
            '1.02.3', // leading zero in minor
            '1.2.03', // leading zero in patch
            '1.2.3-01', // leading zero in numeric pre-release identifier
            '1000000000.2.3', // 10-digit major exceeds the digit cap
            '999999999999999999999999.2.3', // would overflow bash integer compare
            '--orphan', // git arg injection attempt
            'foo;rm', // shell metacharacter
            '', // empty
        ];

        it.each(valid)('accepts %j', (value) => {
            expect(bashRegexMatches(versionRe, value)).toBe(true);
        });

        it.each(invalid)('rejects %j', (value) => {
            expect(bashRegexMatches(versionRe, value)).toBe(false);
        });
    });

    describe('tag_re (last_release_git_tag, optional `v` prefix)', () => {
        // Emptiness is allowed by the workflow's separate `-n` guard, not by
        // this regex, so an empty tag is expected to not match here.
        const valid = [
            'v1.2.3',
            '1.2.3',
            'v1.2.3-beta.1',
            'v1.2.3-alpha.1+meta', // pre-release + build metadata
        ];
        const invalid = [
            'v1.2.3-..',
            '--upload-pack=x',
            'vv1.2.3',
            'v01.2.3', // leading zero in major
            'v1.2.3-01', // leading zero in numeric pre-release identifier
            '',
        ];

        it.each(valid)('accepts %j', (value) => {
            expect(bashRegexMatches(tagRe, value)).toBe(true);
        });

        it.each(invalid)('rejects %j', (value) => {
            expect(bashRegexMatches(tagRe, value)).toBe(false);
        });
    });
});
