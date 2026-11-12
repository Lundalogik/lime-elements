/**
 * This file simulates a type from test files that should be EXCLUDED
 * Location: src/components/button/button.spec.ts
 */
export interface TestHelpers {
    mockFn: () => void;
    setupTest: () => Promise<void>;
}
