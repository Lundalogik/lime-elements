import { diffLines, diffWords } from 'diff';
import {
    DiffHunk,
    DiffLine,
    DiffResult,
    DiffSegment,
    SplitDiffLine,
} from './types';

/**
 * Compute a structured diff between two strings.
 *
 * @param oldText - the "before" text
 * @param newText - the "after" text
 * @param contextLines - number of unchanged lines to show around each change
 * @returns a DiffResult with hunks, additions, and deletions counts
 */
export function computeDiff(
    oldText: string,
    newText: string,
    contextLines: number = 3
): DiffResult {
    const allLines = buildDiffLines(oldText, newText);

    return groupIntoHunks(allLines, contextLines);
}

/**
 * Re-group previously computed flat lines into hunks.
 * Used when expanding collapsed sections without re-diffing.
 *
 * @param allLines - the full flat diff lines from a previous computation
 * @param contextLines - number of context lines around changes
 * @returns a DiffResult with new hunk groupings
 */
export function regroupLines(
    allLines: DiffLine[],
    contextLines: number
): DiffResult {
    return groupIntoHunks(allLines, contextLines);
}

/**
 * Build paired rows for split (side-by-side) view from flat diff lines.
 * Context lines appear on both sides. Adjacent removed+added lines
 * are paired into the same row.
 *
 * @param lines - flat diff lines
 * @returns paired rows for split rendering
 */
export function buildSplitLines(lines: DiffLine[]): SplitDiffLine[] {
    const rows: SplitDiffLine[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.type === 'context') {
            rows.push({ left: line, right: line });
            i++;
            continue;
        }

        i = collectAndPairChanges(lines, i, rows);
    }

    return rows;
}

/**
 * Collect consecutive removed then added lines starting at `index`,
 * pair them into split rows, and return the new index.
 * @param lines - flat diff lines
 * @param index - starting index
 * @param rows - output array to push paired rows into
 */
function collectAndPairChanges(
    lines: DiffLine[],
    index: number,
    rows: SplitDiffLine[]
): number {
    const removed: DiffLine[] = [];
    while (index < lines.length && lines[index].type === 'removed') {
        removed.push(lines[index]);
        index++;
    }

    const added: DiffLine[] = [];
    while (index < lines.length && lines[index].type === 'added') {
        added.push(lines[index]);
        index++;
    }

    const maxPairs = Math.max(removed.length, added.length);
    for (let j = 0; j < maxPairs; j++) {
        rows.push({
            left: j < removed.length ? removed[j] : undefined,
            right: j < added.length ? added[j] : undefined,
        });
    }

    return index;
}

/**
 * Normalize values for diffing. If `reformatJson` is true,
 * parse and re-stringify with sorted keys and consistent indentation.
 * @param value
 * @param reformatJson
 */
export function normalizeForDiff(
    value: string | object,
    reformatJson: boolean = false
): string {
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(sortKeysDeep(value), null, 4);
    }

    if (typeof value === 'string' && reformatJson) {
        try {
            const parsed = JSON.parse(value);

            return JSON.stringify(sortKeysDeep(parsed), null, 4);
        } catch {
            return value;
        }
    }

    return String(value ?? '');
}

function sortKeysDeep(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        return obj.map(sortKeysDeep);
    }

    if (obj !== null && typeof obj === 'object') {
        const sorted: Record<string, unknown> = {};
        const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
        for (const key of keys) {
            sorted[key] = sortKeysDeep((obj as Record<string, unknown>)[key]);
        }

        return sorted;
    }

    return obj;
}

/**
 * Build a flat list of DiffLines from two text strings.
 * @param oldText
 * @param newText
 */
function buildDiffLines(oldText: string, newText: string): DiffLine[] {
    const changes = diffLines(oldText, newText);
    const lines: DiffLine[] = [];
    let oldLineNum = 1;
    let newLineNum = 1;

    for (const change of changes) {
        const changeLines = splitIntoLines(change.value);

        for (const line of changeLines) {
            if (change.added) {
                lines.push({
                    type: 'added',
                    content: line,
                    newLineNumber: newLineNum++,
                });
            } else if (change.removed) {
                lines.push({
                    type: 'removed',
                    content: line,
                    oldLineNumber: oldLineNum++,
                });
            } else {
                lines.push({
                    type: 'context',
                    content: line,
                    oldLineNumber: oldLineNum++,
                    newLineNumber: newLineNum++,
                });
            }
        }
    }

    addWordLevelHighlighting(lines);

    return lines;
}

/**
 * Split a string into lines, handling the trailing newline
 * that jsdiff includes in each change value.
 * @param text
 */
function splitIntoLines(text: string): string[] {
    if (!text) {
        return [];
    }

    const lines = text.split('\n');

    // jsdiff includes a trailing newline, producing an empty last element
    if (lines.length > 0 && lines.at(-1) === '') {
        lines.pop();
    }

    return lines;
}

/**
 * Pair adjacent removed+added lines and compute word-level diffs
 * to highlight only the specific segments that changed.
 * @param lines
 */
function addWordLevelHighlighting(lines: DiffLine[]): void {
    let i = 0;
    while (i < lines.length) {
        // Find consecutive removed lines
        const removedStart = i;
        while (i < lines.length && lines[i].type === 'removed') {
            i++;
        }

        const removedEnd = i;

        // Find consecutive added lines right after
        const addedStart = i;
        while (i < lines.length && lines[i].type === 'added') {
            i++;
        }

        const addedEnd = i;

        const removedCount = removedEnd - removedStart;
        const addedCount = addedEnd - addedStart;

        // Pair them up for word-level highlighting
        if (removedCount > 0 && addedCount > 0) {
            const pairCount = Math.min(removedCount, addedCount);
            for (let j = 0; j < pairCount; j++) {
                const removedLine = lines[removedStart + j];
                const addedLine = lines[addedStart + j];
                const [removedSegments, addedSegments] = computeWordSegments(
                    removedLine.content,
                    addedLine.content
                );
                removedLine.segments = removedSegments;
                addedLine.segments = addedSegments;
            }
        }

        // Skip context lines
        if (i === removedStart) {
            i++;
        }
    }
}

/**
 * Compute word-level diff segments for a pair of lines.
 * @param oldContent
 * @param newContent
 */
function computeWordSegments(
    oldContent: string,
    newContent: string
): [DiffSegment[], DiffSegment[]] {
    const wordChanges = diffWords(oldContent, newContent);

    const removedSegments: DiffSegment[] = [];
    const addedSegments: DiffSegment[] = [];

    for (const change of wordChanges) {
        if (change.added) {
            addedSegments.push({ value: change.value, type: 'added' });
        } else if (change.removed) {
            removedSegments.push({ value: change.value, type: 'removed' });
        } else {
            removedSegments.push({ value: change.value, type: 'equal' });
            addedSegments.push({ value: change.value, type: 'equal' });
        }
    }

    return [removedSegments, addedSegments];
}

/**
 * Group a flat list of diff lines into hunks with context.
 * @param lines
 * @param contextLines
 */
function groupIntoHunks(lines: DiffLine[], contextLines: number): DiffResult {
    if (lines.length === 0) {
        return { hunks: [], additions: 0, deletions: 0, allLines: lines };
    }

    let additions = 0;
    let deletions = 0;

    for (const line of lines) {
        if (line.type === 'added') {
            additions++;
        } else if (line.type === 'removed') {
            deletions++;
        }
    }

    // If there are no changes, return a single empty result
    if (additions === 0 && deletions === 0) {
        return { hunks: [], additions: 0, deletions: 0, allLines: lines };
    }

    // Find ranges of changed lines with their context
    const changeIndices: number[] = [];
    for (const [i, line] of lines.entries()) {
        if (line.type !== 'context') {
            changeIndices.push(i);
        }
    }

    // Build hunk boundaries
    const hunkBoundaries = buildHunkBoundaries(
        changeIndices,
        lines.length,
        contextLines
    );

    const hunks: DiffHunk[] = [];
    let prevEnd = 0;
    for (const boundary of hunkBoundaries) {
        const hunkLines = lines.slice(boundary.start, boundary.end);
        const hiddenBefore = boundary.start - prevEnd;
        const collapsedBefore = hiddenBefore > 0 ? hiddenBefore : undefined;

        hunks.push({
            lines: hunkLines,
            collapsedBefore,
            startIndex: boundary.start,
        });
        prevEnd = boundary.end;
    }

    // Calculate collapsed lines after the last hunk
    const lastBoundary = hunkBoundaries.at(-1);
    const collapsedAfter =
        lastBoundary.end < lines.length
            ? lines.length - lastBoundary.end
            : undefined;

    return { hunks, additions, deletions, collapsedAfter, allLines: lines };
}

interface HunkBoundary {
    start: number;
    end: number;
}

/**
 * Build the start/end boundaries of each hunk based on change positions.
 * Merges hunks that overlap or are adjacent.
 * @param changeIndices
 * @param totalLines
 * @param contextLines
 */
function buildHunkBoundaries(
    changeIndices: number[],
    totalLines: number,
    contextLines: number
): HunkBoundary[] {
    if (changeIndices.length === 0) {
        return [];
    }

    const boundaries: HunkBoundary[] = [];

    let currentStart = Math.max(0, changeIndices[0] - contextLines);
    let currentEnd = Math.min(totalLines, changeIndices[0] + contextLines + 1);

    for (let i = 1; i < changeIndices.length; i++) {
        const changeStart = Math.max(0, changeIndices[i] - contextLines);
        const changeEnd = Math.min(
            totalLines,
            changeIndices[i] + contextLines + 1
        );

        if (changeStart <= currentEnd) {
            // Merge overlapping hunks
            currentEnd = Math.max(currentEnd, changeEnd);
        } else {
            boundaries.push({ start: currentStart, end: currentEnd });
            currentStart = changeStart;
            currentEnd = changeEnd;
        }
    }

    boundaries.push({ start: currentStart, end: currentEnd });

    return boundaries;
}
