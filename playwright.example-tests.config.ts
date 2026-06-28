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
    // One Linux-only baseline set: baselines are only ever generated inside the
    // pinned Playwright Docker image, so the default per-OS/-project filename
    // suffix is dropped. Lives under example-tests/components/<spec>-snapshots/
    // (a tracked dir — NOT __screenshots__/, which is gitignored).
    // Path resolution: {snapshotDir} defaults to testDir (./example-tests) and
    // {testFileDir} is relative to testDir (e.g. components), so the two compose
    // to example-tests/components/...; do not set snapshotDir explicitly without
    // re-checking this, or the baseline location shifts silently.
    snapshotPathTemplate:
        '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
    expect: {
        toHaveScreenshot: {
            // Freeze CSS transitions/animations at their end state so the menu
            // open transition can't produce a mid-flight, flaky capture.
            animations: 'disabled',
            // A blinking text caret (e.g. a focused field) would otherwise flake.
            caret: 'hide',
        },
    },
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
