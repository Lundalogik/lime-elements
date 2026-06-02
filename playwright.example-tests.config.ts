import { defineConfig, devices } from '@playwright/test';

// The example tests drive a real browser against the built docs site,
// navigating to each example's `#/debug/<tag>` route to check the rendered
// components (runtime behaviour and accessibility). They run separately from the
// Vitest `e2e` suite because navigating real URLs needs Playwright's
// `page.goto`, which the in-browser Vitest runner does not provide.
const PORT = Number(process.env.EXAMPLE_TESTS_PORT ?? 3333);

// Generating the accessibility baseline accumulates results in one process, so
// it must run single-threaded; otherwise use the regular parallelism.
const resolveWorkers = (): number | string | undefined => {
    if (process.env.UPDATE_AXE_BASELINE) {
        return 1;
    }
    if (process.env.CI) {
        return '50%';
    }
    return undefined;
};

export default defineConfig({
    testDir: './example-tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: resolveWorkers(),
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    timeout: 30_000,
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'retain-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: `node scripts/serve-www.cjs ${PORT}`,
        url: `http://localhost:${PORT}/index.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
