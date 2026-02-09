#!/usr/bin/env node
/**
 * Test runner wrapper that adds --verbose flag when debug logging is enabled.
 * Debug logging is enabled when ACTIONS_STEP_DEBUG, RUNNER_DEBUG, or DEBUG
 * env vars are truthy.
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Finds the package root by walking up from a file path until a package.json
 * with the expected name is found. This bypasses Node's exports restrictions
 * and handles packages with nested package.json files (like @stencil/core).
 * @param fromFile - The file path to start searching from
 * @param expectedName - The expected package name to match
 * @returns The path to the package root directory
 */
function findPackageRoot(fromFile, expectedName) {
    let dir = path.dirname(fromFile);
    while (true) {
        const pkgPath = path.join(dir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            if (pkg.name === expectedName) {
                return dir;
            }
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            throw new Error(`Package root not found for ${expectedName}`);
        }
        dir = parent;
    }
}

// Stencil v4's exports field doesn't expose bin/stencil, so require.resolve
// can't be used directly. Instead, resolve the package entry (which is allowed),
// walk up to find the package root, and read the bin field from package.json.
const stencilEntry = require.resolve('@stencil/core');
const stencilRoot = findPackageRoot(stencilEntry, '@stencil/core');
const stencilPkg = JSON.parse(
    fs.readFileSync(path.join(stencilRoot, 'package.json'), 'utf8')
);
const stencilScript = path.resolve(stencilRoot, stencilPkg.bin.stencil);

const isCI = envIsSet('CI');
const isDebug =
    envIsSet('ACTIONS_STEP_DEBUG') ||
    envIsSet('RUNNER_DEBUG') ||
    envIsSet('DEBUG');

const args = ['test', '--spec', '--e2e'];

// Reduce parallelism in CI to work around Stencil v4 e2e test issues
// See: https://github.com/stenciljs/core/issues/6157
if (isCI) {
    args.push('--max-workers=2');
    console.log('CI detected, reducing parallelism with --max-workers=2');
}

// Add verbose flag if debug mode is enabled
if (isDebug) {
    args.push('--verbose');
    console.log('Debug mode enabled, running tests with --verbose flag');
}

// Add any additional arguments passed to this script
args.push(...process.argv.slice(2));

console.log(`Running: stencil ${args.join(' ')}`);

const result = spawnSync(process.execPath, [stencilScript, ...args], {
    stdio: 'inherit',
    env: {
        ...process.env,
        SASS_PATH: 'node_modules',
    },
});

if (typeof result.status === 'number') {
    process.exit(result.status);
} else if (result.signal) {
    // Re-emit the signal that terminated the child process
    process.kill(process.pid, result.signal);
} else {
    // Unknown failure
    process.exit(1);
}

function envIsSet(name) {
    const value = process.env[name];

    return value && value !== '0' && value.toLowerCase() !== 'false';
}
