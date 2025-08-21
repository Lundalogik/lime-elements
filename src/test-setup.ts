/* eslint-disable @typescript-eslint/no-unused-vars */

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
