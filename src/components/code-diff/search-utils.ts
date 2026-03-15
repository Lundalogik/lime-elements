/**
 * Pure utility functions for search-within-diff functionality.
 */

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
 * Format the "X of Y" match info string shown in the search bar.
 *
 * @param currentIndex - zero-based index of the current match
 * @param total - total number of matches
 * @returns human-readable match info
 */
export function formatMatchInfo(currentIndex: number, total: number): string {
    if (total === 0) {
        return 'No matches';
    }

    return `${currentIndex + 1} of ${total}`;
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
