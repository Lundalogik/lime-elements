/**
 * Pure utility functions for extracting text content from diff structures.
 */

import { DiffLine, SplitDiffLine } from './types';

/**
 * Extract the text content of removed lines from a unified change block.
 *
 * @param lines - consecutive changed lines from a unified diff hunk
 * @returns the removed lines joined by newlines, or empty string if none
 */
export function extractRemovedContent(lines: DiffLine[]): string {
    return lines
        .filter((line) => line.type === 'removed')
        .map((line) => line.content)
        .join('\n');
}

/**
 * Extract the text content of removed lines from a split change block.
 *
 * @param rows - consecutive changed rows from a split diff hunk
 * @returns the removed lines joined by newlines, or empty string if none
 */
export function extractRemovedContentFromSplit(rows: SplitDiffLine[]): string {
    return rows
        .filter((row) => row.left?.type === 'removed')
        .map((row) => row.left.content)
        .join('\n');
}

/**
 * Format a screen-reader summary of diff additions and deletions.
 *
 * @param additions - number of added lines
 * @param deletions - number of removed lines
 * @returns human-readable summary string, or null if no changes
 */
export function formatDiffSummary(
    additions: number,
    deletions: number
): string | null {
    if (additions === 0 && deletions === 0) {
        return null;
    }

    const parts: string[] = [];
    if (additions > 0) {
        const suffix = additions === 1 ? '' : 's';
        parts.push(`${additions} addition${suffix}`);
    }

    if (deletions > 0) {
        const suffix = deletions === 1 ? '' : 's';
        parts.push(`${deletions} deletion${suffix}`);
    }

    return `Diff: ${parts.join(', ')}. Use arrow keys to navigate lines.`;
}
