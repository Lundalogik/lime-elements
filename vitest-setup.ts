/* eslint-disable @typescript-eslint/no-unused-vars */

// Load Stencil custom matchers (toEqualHtml, toHaveAttribute, etc.)
import '@stencil/vitest';

// Load Stencil components (built by stencil-test before Vitest runs)
await import('./dist/lime-elements/lime-elements.esm.js');

// Set default language for translation lookups in components
if (document?.documentElement && !document.documentElement.lang) {
    document.documentElement.lang = 'en';
}

// Set window.location for URL resolution in link plugins
if (
    typeof window !== 'undefined' &&
    (!window.location.hostname || window.location.hostname === '')
) {
    Object.defineProperty(window, 'location', {
        value: new URL('http://localhost:3333'),
        writable: true,
    });
}

// Mock localStorage for tests (used by config.ts)
if (globalThis.localStorage === undefined) {
    const store: Record<string, string> = {};
    globalThis.localStorage = {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            for (const k of Object.keys(store)) delete store[k];
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => Object.keys(store)[index] ?? null,
    } as Storage;
}

// Reset localStorage store before every test to prevent cross-test leakage
import { beforeEach } from 'vitest';
beforeEach(() => {
    globalThis.localStorage?.clear();
});

// Mock IntersectionObserver for tests
if (!global.IntersectionObserver) {
    global.IntersectionObserver = class IntersectionObserver {
        constructor(
            _callback: IntersectionObserverCallback,
            _options?: IntersectionObserverInit
        ) {}
        observe(_target: Element): void {}
        unobserve(_target: Element): void {}
        disconnect(): void {}
        readonly root: Element | null = null;
        readonly rootMargin: string = '';
        readonly thresholds: ReadonlyArray<number> = [];
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    } as any;
}

// Mock fetch for icon/asset requests (mock-doc has no real network)
const EMPTY_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>';
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('.svg') || url.startsWith('assets/')) {
        return new Response(EMPTY_SVG, {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    }

    return originalFetch(input, init);
};

// Patch DOMParser to handle SVG (mock-doc only supports text/html)
if (globalThis.DOMParser) {
    const OriginalDOMParser = globalThis.DOMParser;
    globalThis.DOMParser = class extends OriginalDOMParser {
        parseFromString(str: string, type: DOMParserSupportedType): Document {
            if (type === 'image/svg+xml') {
                // Parse as HTML but wrap result so documentElement.tagName is 'svg'
                const doc = super.parseFromString(str, 'text/html');
                const svg = doc.querySelector('svg');
                if (svg) {
                    const svgDoc = super.parseFromString(
                        '<svg></svg>',
                        'text/html'
                    );
                    // Replace the documentElement to make validation pass
                    Object.defineProperty(svgDoc, 'documentElement', {
                        get: () => svg,
                    });

                    return svgDoc;
                }

                // No <svg> root found — return an empty SVG document rather
                // than delegating to the unsupported image/svg+xml type.
                return super.parseFromString('<svg></svg>', 'text/html');
            }

            return super.parseFromString(str, type);
        }
    } as any;
}

// Mock ResizeObserver for tests
if (!global.ResizeObserver) {
    global.ResizeObserver = class ResizeObserver {
        constructor(_callback: ResizeObserverCallback) {
            // Mock implementation - just store the callback
        }

        observe(_target: Element): void {
            // Mock implementation
        }

        unobserve(_target: Element): void {
            // Mock implementation
        }

        disconnect(): void {
            // Mock implementation
        }
    };
}
