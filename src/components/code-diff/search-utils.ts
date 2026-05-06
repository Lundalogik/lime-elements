/**
 * Pure utility functions for search-within-diff functionality.
 */

/**
 * The line types that the in-diff search operates on.
 */
export type SearchScope = 'removed' | 'added' | 'changed';

/**
 * Escape special regex characters in a search term so it can
 * be used as a literal pattern in a RegExp constructor.
 *
 * @param term - the raw search string
 * @returns regex-safe string
 */
export function escapeRegex(term: string): string {
    return term.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Build a case-insensitive regex that captures the search term.
 * Returns `null` when the term is empty.
 *
 * @param term - the raw search string
 * @returns a RegExp with a single capture group, or null
 */
export function buildSearchRegex(term: string): RegExp | null {
    if (!term) {
        return null;
    }

    return new RegExp(`(${escapeRegex(term)})`, 'gi');
}

/**
 * Calculate the next match index when navigating forward or backward,
 * wrapping around at the boundaries.
 *
 * @param currentIndex - current zero-based match index
 * @param direction - +1 for next, -1 for previous
 * @param total - total number of matches
 * @returns the new match index
 */
export function navigateMatchIndex(
    currentIndex: number,
    direction: number,
    total: number
): number {
    if (total === 0) {
        return 0;
    }

    return (currentIndex + direction + total) % total;
}

/**
 * Pick the default `SearchScope` to use when the search panel opens.
 *
 * Falls back to `'added'` when there are no removed lines, so the
 * panel never opens with a scope that has zero matches.
 */
export function pickDefaultScope(stats: {
    additions: number;
    deletions: number;
}): SearchScope {
    if (stats.deletions > 0) {
        return 'removed';
    }

    return 'added';
}
