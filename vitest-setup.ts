/* eslint-disable @typescript-eslint/no-unused-vars */

// Load Stencil custom matchers (toEqualHtml, toHaveAttribute, etc.)
import '@stencil/vitest';

// Suppress Stencil-internal unhandled rejections from cross-test leaks.
// After teardown, Stencil's `emitEvent` microtask may fire on a cleaned-up
// window/element whose `dispatchEvent` no longer exists. This is harmless
// but Vitest treats unhandled rejections as test failures.
if (
    typeof process !== 'undefined' &&
    !(process as any).__vitestUnhandledRejectionListenerInstalled
) {
    (process as any).__vitestUnhandledRejectionListenerInstalled = true;
    process.on('unhandledRejection', (reason: unknown) => {
        if (
            reason instanceof TypeError &&
            reason.message === 'elm.dispatchEvent is not a function'
        ) {
            // Swallow — this is a known Stencil mock-doc teardown race.
            return;
        }

        // Re-throw anything else so real errors aren't silenced.
        throw reason;
    });
}

// Load Stencil components (built by stencil-test before Vitest runs)
await import('./dist/lime-elements/lime-elements.esm.js');

// The mock-doc environment (used by the `spec` project) sets
// `globalThis.HTMLElement` to a stub that the elements returned by
// `document.createElement()` are NOT instances of, so `node instanceof
// HTMLElement` — and Vitest's `expect.any(HTMLElement)` — always fail.
// Align the global with mock-doc's real element constructor to restore
// browser-like semantics.
if (!(document.createElement('div') instanceof globalThis.HTMLElement)) {
    globalThis.HTMLElement = document.createElement('div')
        .constructor as typeof HTMLElement;
}

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

// mock-doc's elements have no `validity` property, but Material's text field
// (rendered by limel-input-field) reads `nativeInput.validity.valid` during
// initialization. Provide a permissive ValidityState on the element prototype.
{
    const inputElement = document.createElement('input');
    if ((inputElement as any).validity === undefined) {
        const validityState: ValidityState = {
            badInput: false,
            customError: false,
            patternMismatch: false,
            rangeOverflow: false,
            rangeUnderflow: false,
            stepMismatch: false,
            tooLong: false,
            tooShort: false,
            typeMismatch: false,
            valid: true,
            valueMissing: false,
        };
        Object.defineProperty(Object.getPrototypeOf(inputElement), 'validity', {
            configurable: true,
            get: () => validityState,
        });
    }
}

// Mock fetch for icon/asset requests (mock-doc has no real network)
const EMPTY_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>';
const originalFetch =
    globalThis.fetch ??
    ((() => {
        throw new TypeError('fetch is not available in this environment');
    }) as typeof fetch);
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

// Mock MutationObserver for tests. The mock-doc environment does not provide
// one (a real browser does), and Material's text field — rendered by
// limel-input-field — constructs one during initialization.
if (!global.MutationObserver) {
    global.MutationObserver = class MutationObserver {
        constructor(_callback: MutationCallback) {
            // Mock implementation - just store the callback
        }

        observe(_target: Node, _options?: MutationObserverInit): void {
            // Mock implementation
        }

        disconnect(): void {
            // Mock implementation
        }

        takeRecords(): MutationRecord[] {
            return [];
        }
    } as any;
}
