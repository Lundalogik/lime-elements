import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { nodeResolve } from '@rollup/plugin-node-resolve';

/**
 * Stencil configuration for generating Context7-compatible markdown documentation.
 * This config generates component README files that will be published to gh-pages
 * and indexed by Context7 for LLM consumption.
 */
export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'docs-readme',
            dir: 'www/markdown-docs',
            strict: true,
        },
    ],
    plugins: [sass()],
    rollupPlugins: {
        before: [nodeResolve()],
    },
    tsconfig: './tsconfig.docs.json',
    globalStyle: 'src/global/core-styles.scss',
};
