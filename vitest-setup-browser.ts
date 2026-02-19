// Suppress unhandled rejections from the icon Cache API.
// The CacheStorageIconCache tries to cache icon SVGs via the Cache API,
// but in the test environment the icon URLs don't resolve, causing
// "Failed to execute 'add' on 'Cache': Request failed" errors.
// The icons still render (via in-memory fallback), so these are harmless.
window.addEventListener('unhandledrejection', (event) => {
    if (
        event.reason instanceof TypeError &&
        event.reason.message.includes("Failed to execute 'add' on 'Cache'")
    ) {
        event.preventDefault();
    }
});

// Load Stencil components for browser e2e tests.
// The dist/ directory is built by `stencil-test` before Vitest runs,
// so this path is guaranteed to exist at test time.
export const _components = await import(
    './dist/lime-elements/lime-elements.esm.js'
);
