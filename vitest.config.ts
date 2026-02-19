import { defineVitestConfig } from '@stencil/vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineVitestConfig({
    stencilConfig: './stencil.config.ts',
    test: {
        projects: [
            {
                test: {
                    name: 'spec',
                    globals: true,
                    include: ['src/**/*.vspec.{ts,tsx}'],
                    environment: 'stencil',
                    setupFiles: ['./vitest-setup.ts'],
                },
            },
            {
                test: {
                    name: 'e2e',
                    globals: true,
                    include: ['src/**/*.ve2e.{ts,tsx}'],
                    setupFiles: ['./vitest-setup-browser.ts'],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
    },
});
