/**
 * Represents a segment within a diff line that may or may not be highlighted.
 * Used for word-level diff highlighting within changed lines.
 */
export interface DiffSegment {
    value: string;
    type: 'equal' | 'added' | 'removed';
}

/**
 * Represents a single line in the diff output.
 */
export interface DiffLine {
    type: 'added' | 'removed' | 'context';
    content: string;
    oldLineNumber?: number;
    newLineNumber?: number;
    segments?: DiffSegment[];
}

/**
 * A group of diff lines with surrounding context.
 */
export interface DiffHunk {
    lines: DiffLine[];
    collapsedBefore?: number;
    /** Index of the first line in this hunk within the flat `allLines` array. */
    startIndex: number;
}

/**
 * A paired row for split (side-by-side) view.
 * One or both sides may be present.
 */
export interface SplitDiffLine {
    left?: DiffLine;
    right?: DiffLine;
}


/**
 * The full computed diff result.
 */
export interface DiffResult {
    hunks: DiffHunk[];
    additions: number;
    deletions: number;
    collapsedAfter?: number;
    /**
     * The full flat list of diff lines before grouping.
     * Used internally for re-grouping when expanding hunks.
     */
    allLines: DiffLine[];
}
