/**
 * Parse route URL pattern into regex and parameter names
 * @param {string} pattern - Route pattern with optional parameters (e.g., "/component/:name")
 * @returns {{regex: RegExp, params: string[]}} Regex and parameter names
 */
export function parseRoute(pattern) {
    const params = [];
    // First, collect all parameters in order they appear
    // Match both required (:param) and optional (:param?) parameters
    const paramMatches = pattern.match(/:(\w+)\??/g) || [];
    paramMatches.forEach((match) => {
        const paramName = match.replace(/^:|[?]/g, '');
        params.push(paramName);
    });
    // Then build the regex pattern
    // Process optional params with their slashes first (before escaping slashes)
    // This makes both the slash AND the parameter value optional
    const regexPattern = pattern
        .replace(/\/:(\w+)\?/g, '___OPTIONAL_PARAM_$1___') // Mark optional params with slash
        .replace(/\//g, '\\/') // Escape remaining slashes
        .replace(/___OPTIONAL_PARAM_(\w+)___/g, '(?:\\/([^/]*))?') // Optional slash + param
        .replace(/:(\w+)/g, '([^/]+)'); // Required param
    const regex = new RegExp(`^${regexPattern}\\/?$`);
    return { regex: regex, params: params };
}
/**
 * Match a path against a route pattern
 * @param {string} path - Current path to match
 * @param {string} pattern - Route pattern to match against
 * @returns {MatchResults | null} Match results with parameters or null if no match
 */
export function matchRoute(path, pattern) {
    if (!pattern) {
        return { params: {} };
    }
    const { regex, params } = parseRoute(pattern);
    const match = path.match(regex);
    if (!match) {
        return null;
    }
    const matchParams = {};
    params.forEach((param, index) => {
        matchParams[param] = match[index + 1] || '';
    });
    return { params: matchParams };
}
/**
 * Get current hash path
 * @returns {string} Current hash path from URL
 */
export function getHashPath() {
    return location.hash.substring(1) || '/';
}
//# sourceMappingURL=router-utils.js.map
