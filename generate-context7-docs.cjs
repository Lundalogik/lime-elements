/* eslint-env node */
const shell = require('shelljs');
const fs = require('node:fs');
const path = require('node:path');
const argv = require('yargs').argv;

const OUTPUT_DIR = 'www/markdown-docs';
const GUIDES_DIR = `${OUTPUT_DIR}/guides`;

if (argv.h !== undefined) {
    shell.echo(`
usage: node generate-context7-docs.cjs
    `);
    shell.exit(0);
}

shell.echo('=== Generating Context7-compatible documentation ===\n');

try {
    shell.echo('Building component markdown documentation...');
    if (
        shell.exec(
            'cross-env-shell NODE_ENV=prod SASS_PATH=node_modules "npx stencil build --config stencil.config.context7.ts"'
        ).code !== 0
    ) {
        shell.echo('ERROR: Stencil build failed!');
        shell.exit(1);
    }
    shell.echo('✓ Component READMEs generated\n');

    shell.echo('Creating guides directory...');
    shell.mkdir('-p', GUIDES_DIR);
    shell.echo('✓ Guides directory created\n');

    shell.echo('Copying root-level documentation...');
    const rootDocs = ['README.md', 'CONTRIBUTING.md'];
    for (const doc of rootDocs) {
        if (fs.existsSync(doc)) {
            shell.cp(doc, OUTPUT_DIR);
            shell.echo(`  ✓ Copied ${doc}`);
        } else {
            shell.echo(`  ⚠ Warning: ${doc} not found, skipping`);
        }
    }
    shell.echo();

    shell.echo('Copying guide documentation...');
    const guides = ['src/contributing.md', 'src/events.md', 'src/theming.md'];
    for (const guide of guides) {
        if (fs.existsSync(guide)) {
            const basename = path.basename(guide);
            shell.cp(guide, path.join(GUIDES_DIR, basename));
            shell.echo(`  ✓ Copied ${guide} → guides/${basename}`);
        } else {
            shell.echo(`  ⚠ Warning: ${guide} not found, skipping`);
        }
    }
    shell.echo();

    shell.echo('Copying design guideline markdown files...');
    const guidelineSources = shell
        .find('src/design-guidelines')
        .filter((file) => {
            return (
                file.endsWith('.md') &&
                !file.includes('/examples/') &&
                file !== 'src/design-guidelines'
            );
        });

    for (const guideline of guidelineSources) {
        // Preserve directory structure: src/design-guidelines/foo/bar.md →
        // www/markdown-docs/design-guidelines/foo/bar.md
        const relativePath = guideline.replace('src/', '');
        const targetPath = path.join(OUTPUT_DIR, relativePath);
        const targetDir = path.dirname(targetPath);

        shell.mkdir('-p', targetDir);
        shell.cp(guideline, targetPath);
        shell.echo(`  ✓ Copied ${guideline} → ${relativePath}`);
    }
    shell.echo();

    shell.echo('Generating INDEX.md...');
    const indexContent = generateIndexFile();
    fs.writeFileSync(path.join(OUTPUT_DIR, 'INDEX.md'), indexContent);
    shell.echo('✓ INDEX.md created\n');

    shell.echo('Generating META.json...');
    const metadata = generateMetadata();
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'META.json'),
        JSON.stringify(metadata, null, 2)
    );
    shell.echo('✓ META.json created\n');

    shell.echo('=== Documentation generation complete! ===');
    shell.echo(`Output directory: ${OUTPUT_DIR}`);
    shell.echo(`Total components: ${metadata.componentCount}`);
    shell.echo(`Total files: ${metadata.fileCount}`);
} catch (error) {
    shell.echo('ERROR: Documentation generation failed');
    shell.echo(error.message);
    shell.exit(1);
}

/**
 * Generate the INDEX.md file with navigation and overview
 * @returns The content of the INDEX.md file
 */
function generateIndexFile() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;

    // Get list of components
    const componentsDir = path.join(OUTPUT_DIR, 'components');
    const components = fs
        .readdirSync(componentsDir)
        .filter((item) => {
            const stat = fs.statSync(path.join(componentsDir, item));

            return stat.isDirectory();
        })
        .sort();

    // Get list of design guidelines
    const guidelinesDir = path.join(OUTPUT_DIR, 'design-guidelines');
    const guidelines = fs.existsSync(guidelinesDir)
        ? fs
              .readdirSync(guidelinesDir)
              .filter((item) => {
                  const stat = fs.statSync(path.join(guidelinesDir, item));

                  return stat.isDirectory();
              })
              .sort()
        : [];

    let content = `# Lime Elements Documentation

**Version ${version}**

A comprehensive design system and component library built with Stencil.

## Quick Start

\`\`\`bash
npm install @limetech/lime-elements
\`\`\`

\`\`\`html
<script type="module" src="https://cdn.jsdelivr.net/npm/@limetech/lime-elements@latest/dist/lime-elements/lime-elements.esm.js"></script>

<limel-button primary label="Hello World"></limel-button>
\`\`\`

## Components (${components.length})

`;

    // Add components in columns
    const columns = 3;
    for (let i = 0; i < components.length; i += columns) {
        const row = components.slice(i, i + columns);
        content +=
            '| ' +
            row
                .map(
                    (c) =>
                        `[${formatComponentName(c)}](components/${c}/readme.md)`
                )
                .join(' | ') +
            ' |\n';
        if (i === 0) {
            content += '| ' + '--- | '.repeat(row.length) + '\n';
        }
    }

    content += `

## Design Guidelines

`;

    for (const guideline of guidelines) {
        // Try to find the main markdown file in the guideline directory
        const guidelineDir = path.join(guidelinesDir, guideline);
        const mdFiles = fs
            .readdirSync(guidelineDir)
            .filter((f) => f.endsWith('.md') && f !== 'readme.md');

        if (mdFiles.length > 0) {
            content += `- [${formatComponentName(guideline)}](design-guidelines/${guideline}/${mdFiles[0]})\n`;
        } else {
            content += `- [${formatComponentName(guideline)}](design-guidelines/${guideline}/)\n`;
        }
    }

    content += `

## Guides

- [Contributing](guides/contributing.md) - How to contribute to Lime Elements
- [Events](guides/events.md) - Working with component events
- [Theming](guides/theming.md) - Customizing component styles

## Resources

- [Full README](README.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [NPM Package](https://www.npmjs.com/package/@limetech/lime-elements)
- [GitHub Repository](https://github.com/Lundalogik/lime-elements)
- [Official Documentation](https://lundalogik.github.io/lime-elements/)

## About

Lime Elements is an enterprise-ready component library that provides:
- 🚀 Battle-tested components used in production
- 🎨 Comprehensive design system
- ⚡ Web standards-based (works with any framework)
- 👾 Full TypeScript support
- ♿ Accessibility built-in
- ⚙️ Extensive customization options

Built with ❤️ by [Lime Technologies](https://www.lime-technologies.com/)
`;

    return content;
}

/**
 * Format component name for display (kebab-case to Title Case)
 * @param name - The kebab-case component name
 * @returns The formatted component name in Title Case
 */
function formatComponentName(name) {
    return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Generate metadata about the documentation
 * @returns Metadata object containing version, timestamp, and counts
 */
function generateMetadata() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Count components
    const componentsDir = path.join(OUTPUT_DIR, 'components');
    const components = fs.readdirSync(componentsDir).filter((item) => {
        const stat = fs.statSync(path.join(componentsDir, item));

        return stat.isDirectory();
    });

    // Count all markdown files
    let fileCount = 0;
    const countFiles = (dir) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                countFiles(fullPath);
            } else if (item.endsWith('.md')) {
                fileCount++;
            }
        }
    };
    countFiles(OUTPUT_DIR);

    return {
        version: packageJson.version,
        generated: new Date().toISOString(),
        componentCount: components.length,
        fileCount: fileCount,
        generator: 'generate-context7-docs.cjs',
    };
}
