/* eslint-env node */

// Single source of truth for validating the docs `version` input.
//
// `publish-docs.cjs` imports `assertValidDocsVersion` so the value is
// validated for EVERY caller of the publish script — manual dispatch, the
// release pipeline, and the fork-PR publish path — not only the workflows
// that happen to pre-validate their inputs in shell. The `build-docs.yml`
// workflow additionally inlines the equivalent checks in bash so a bad
// input fails fast, before checkout. `validate-version-inputs.spec.cjs`
// asserts the inline workflow regex matches the pattern here, so the two
// implementations can't drift apart.

// The docs `version` becomes a directory name under `docsDist/versions/`
// and is interpolated into published file paths. Require a leading
// alphanumeric (so a value can't start with '-' and be read as a flag, and
// can't be a bare '.'/'-'), restrict the charset, reject any '..' (path
// traversal), and reject the reserved 'latest'/'next' symlink names that
// `publish-docs.cjs` manages itself.
const DOCS_VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const RESERVED_DOCS_VERSIONS = ['latest', 'next'];

/**
 * Whether a value is safe to use as the published docs version (directory
 * name).
 *
 * @param version - the candidate version string.
 * @returns `true` if the value is a valid docs version.
 */
function isValidDocsVersion(version) {
    return (
        typeof version === 'string' &&
        DOCS_VERSION_PATTERN.test(version) &&
        !version.includes('..') &&
        !RESERVED_DOCS_VERSIONS.includes(version)
    );
}

/**
 * Throws if `version` is not a valid docs version.
 *
 * @param version - the candidate version string.
 * @throws when the value is not a valid docs version.
 */
function assertValidDocsVersion(version) {
    if (!isValidDocsVersion(version)) {
        throw new Error(
            `Invalid docs version '${version}'. Must start with a letter or ` +
                `digit and contain only letters, digits, '.', '_', '-'; no ` +
                `'..'; 'latest' and 'next' are reserved.`
        );
    }
}

module.exports = {
    DOCS_VERSION_PATTERN,
    RESERVED_DOCS_VERSIONS,
    isValidDocsVersion,
    assertValidDocsVersion,
};
