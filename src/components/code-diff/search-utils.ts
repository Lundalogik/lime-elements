/**
 * Pure utility functions for search-within-diff functionality.
 */

import type { DiffLine } from './types';

/**
 * The line types that the in-diff search operates on.
 * `changed` covers both removed and added lines.
 */
export const SEARCH_SCOPES = ['changed', 'removed', 'added'] as const;

export type SearchScope = (typeof SEARCH_SCOPES)[number];

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
 * Whether a line of the given type participates in the active
 * `SearchScope`. Context lines are never included.
 *
 * @param lineType - the type of the diff line being considered
 * @param scope - the active search scope
 * @returns true when the line participates in the scope, false otherwise
 */
export function lineMatchesScope(
    lineType: DiffLine['type'],
    scope: SearchScope
): boolean {
    if (scope === 'changed') {
        return lineType !== 'context';
    }

    return lineType === scope;
}
