/**
 * Match results from route matching
 */
export interface MatchResults {
  params: Record<string, string>;
}
/**
 * Parse route URL pattern into regex and parameter names
 * @param {string} pattern - Route pattern with optional parameters (e.g., "/component/:name")
 * @returns {{regex: RegExp, params: string[]}} Regex and parameter names
 */
export declare function parseRoute(pattern: string): {
  regex: RegExp;
  params: string[];
};
/**
 * Match a path against a route pattern
 * @param {string} path - Current path to match
 * @param {string} pattern - Route pattern to match against
 * @returns {MatchResults | null} Match results with parameters or null if no match
 */
export declare function matchRoute(path: string, pattern: string): MatchResults | null;
/**
 * Get current hash path
 * @returns {string} Current hash path from URL
 */
export declare function getHashPath(): string;
