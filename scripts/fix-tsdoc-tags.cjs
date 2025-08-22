#!/usr/bin/env node

/**
 * Creates a copy of dist/types with TSDoc-compatible tags for API Extractor.
 * Converts JSDoc tags to proper TSDoc syntax as per https://tsdoc.org/
 */

const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');

const DIST_TYPES_DIR = path.join(__dirname, '../dist/types');
const TEMP_TYPES_DIR = path.join(__dirname, '../temp/types');

/**
 *
 * @param content
 */
function convertJSDocToTSDoc(content) {
    let converted = content;

    // Convert @default to @defaultValue with proper backtick formatting
    // JSDoc: @default {prop: value} or @default value
    // TSDoc: @defaultValue `{prop: value}` or @defaultValue `value`
    converted = converted.replaceAll(
        /(@default\s+)(.+?)(?=\n|\*\/|$)/g,
        (_fullMatch, _prefix, value) => {
            const trimmedValue = value.trim();
            // If the value is already wrapped in backticks, don't double-wrap
            if (trimmedValue.startsWith('`') && trimmedValue.endsWith('`')) {
                return `@defaultValue ${trimmedValue}`;
            }
            return `@defaultValue \`${trimmedValue}\``;
        }
    );

    // Convert @private to @internal
    // JSDoc: @private
    // TSDoc: @internal
    converted = converted.replaceAll(/@private\b/g, '@internal');

    // Convert @returns to @returns (TSDoc uses same tag but let's ensure consistency)
    // Both JSDoc and TSDoc use @returns, but TSDoc is more strict about format
    // This is already compatible, but we could add validation here if needed

    // Convert @param to @param (already compatible)
    // Both JSDoc and TSDoc use @param in the same way

    // Convert @see to @see (already compatible)
    // Both JSDoc and TSDoc use @see

    // Convert @deprecated to @deprecated (already compatible)
    // Both JSDoc and TSDoc use @deprecated

    // Handle @example -> @example (compatible but could format better)
    // Both use @example but TSDoc has stricter formatting rules

    return converted;
}

function copyAndProcessFile(srcPath, destPath) {
    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const content = fs.readFileSync(srcPath, 'utf8');
    const convertedContent = convertJSDocToTSDoc(content);

    fs.writeFileSync(destPath, convertedContent, 'utf8');

    if (content !== convertedContent) {
        const relativePath = path.relative(TEMP_TYPES_DIR, destPath);
        console.log(`Converted JSDoc to TSDoc in: ${relativePath}`);
    }
}

function main() {
    if (!fs.existsSync(DIST_TYPES_DIR)) {
        console.error('dist/types directory not found. Run build first.');
        process.exit(1);
    }

    // Remove existing temp/types directory
    if (fs.existsSync(TEMP_TYPES_DIR)) {
        fs.rmSync(TEMP_TYPES_DIR, { recursive: true, force: true });
    }

    // Copy all .d.ts files from dist/types to temp/types with fixes
    const pattern = path.join(DIST_TYPES_DIR, '**/*.d.ts');
    const files = glob.sync(pattern);

    if (files.length === 0) {
        console.log('No .d.ts files found to process.');
        return;
    }

    console.log(`Copying and processing ${files.length} .d.ts files...`);

    for (const srcPath of files) {
        const relativePath = path.relative(DIST_TYPES_DIR, srcPath);
        const destPath = path.join(TEMP_TYPES_DIR, relativePath);
        copyAndProcessFile(srcPath, destPath);
    }

    console.log(
        `JSDoc to TSDoc conversion completed. Files copied to: ${path.relative(process.cwd(), TEMP_TYPES_DIR)}`
    );
}

if (require.main === module) {
    main();
}

module.exports = { convertJSDocToTSDoc };
