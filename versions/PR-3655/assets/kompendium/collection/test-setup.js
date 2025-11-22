// Mock console.debug to suppress debug logs during tests
// Preserves console.error and console.warn for important test output
global.console = {
    ...console,
    debug: jest.fn(),
};
//# sourceMappingURL=test-setup.js.map
