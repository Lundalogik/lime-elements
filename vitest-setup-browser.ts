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

// The browser test server does not serve the repo's test assets, and
// limel-file-viewer's PDF loader fetches its `url`. Intercept requests for
// PDF test assets and return a successful response so the viewer renders;
// everything else (icons, etc.) passes through to the real fetch.
const resolveUrl = (input: RequestInfo | URL): string => {
    if (typeof input === 'string') {
        return input;
    }
    if (input instanceof Request) {
        return input.url;
    }
    return input.toString();
};
const originalFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = resolveUrl(input);
    if (url.includes('/assets/') && url.endsWith('.pdf')) {
        return new Response(
            new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
            { status: 200, headers: { 'Content-Type': 'application/pdf' } }
        );
    }

    return originalFetch(input, init);
};

// Load Stencil components for browser e2e tests.
// The dist/ directory is built by `stencil-test` before Vitest runs,
// so this path is guaranteed to exist at test time.
export const _components =
    await import('./dist/lime-elements/lime-elements.esm.js');
