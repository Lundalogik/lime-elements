/**
 * Generate a stable key from route parameters for component recreation
 * Keys are deterministic - same params always produce same key
 * Used to force Stencil component recreation when route params change
 * @param {Record<string, string>} params - Route parameters
 * @returns {string} A stable, deterministic key
 */
export declare function generateComponentKey(params: Record<string, string>): string;
