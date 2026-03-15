import { describe, it, expect } from 'vitest';
import {
    computeDiff,
    normalizeForDiff,
    regroupLines,
    buildSplitLines,
    buildSplitHunks,
} from './diff-engine';

describe('normalizeForDiff', () => {
    it('converts objects to pretty-printed JSON with sorted keys', () => {
        const obj = { b: 2, a: 1 };
        const result = normalizeForDiff(obj);
        expect(result).toBe('{\n    "a": 1,\n    "b": 2\n}');
    });

    it('sorts nested object keys', () => {
        const obj = { z: { y: 1, x: 2 }, a: 3 };
        const result = normalizeForDiff(obj);
        const parsed = JSON.parse(result);
        expect(Object.keys(parsed)).toEqual(['a', 'z']);
        expect(Object.keys(parsed.z)).toEqual(['x', 'y']);
    });

    it('passes strings through unchanged when reformatJson is false', () => {
        const result = normalizeForDiff('hello world', false);
        expect(result).toBe('hello world');
    });

    it('reformats JSON strings when reformatJson is true', () => {
        const input = '{"b":2,"a":1}';
        const result = normalizeForDiff(input, true);
        expect(result).toBe('{\n    "a": 1,\n    "b": 2\n}');
    });

    it('returns original string if JSON parsing fails with reformatJson', () => {
        const input = 'not valid json';
        const result = normalizeForDiff(input, true);
        expect(result).toBe('not valid json');
    });

    it('handles null values', () => {
        const result = normalizeForDiff(null as any);
        expect(result).toBe('null');
    });

    it('handles arrays in objects', () => {
        const obj = { items: [3, 1, 2] };
        const result = normalizeForDiff(obj);
        expect(result).toContain('"items"');
        expect(result).toContain('[');
    });
});

describe('computeDiff', () => {
    it('returns empty result for identical strings', () => {
        const result = computeDiff('hello\n', 'hello\n');
        expect(result.hunks).toHaveLength(0);
        expect(result.additions).toBe(0);
        expect(result.deletions).toBe(0);
    });

    it('returns empty result for two empty strings', () => {
        const result = computeDiff('', '');
        expect(result.hunks).toHaveLength(0);
    });

    it('detects added lines', () => {
        const result = computeDiff('a\n', 'a\nb\n');
        expect(result.additions).toBe(1);
        expect(result.deletions).toBe(0);
    });

    it('detects removed lines', () => {
        const result = computeDiff('a\nb\n', 'a\n');
        expect(result.additions).toBe(0);
        expect(result.deletions).toBe(1);
    });

    it('detects modified lines as removal + addition', () => {
        const result = computeDiff('hello world\n', 'hello earth\n');
        expect(result.additions).toBe(1);
        expect(result.deletions).toBe(1);
    });

    it('includes context lines around changes', () => {
        const old = 'line1\nline2\nline3\nline4\nline5\n';
        const modified = 'line1\nline2\nchanged\nline4\nline5\n';
        const result = computeDiff(old, modified, 1);

        expect(result.hunks).toHaveLength(1);
        const lines = result.hunks[0].lines;

        // Should include: 1 context before, 2 changed, 1 context after
        const contextLines = lines.filter((l) => l.type === 'context');
        expect(contextLines.length).toBeGreaterThanOrEqual(1);
    });

    it('collapses unchanged sections between hunks', () => {
        const lines = [];
        for (let i = 0; i < 20; i++) {
            lines.push(`line${i}`);
        }

        const oldLines = [...lines];
        const newLines = [...lines];
        newLines[2] = 'changed2';
        newLines[17] = 'changed17';

        const result = computeDiff(
            oldLines.join('\n') + '\n',
            newLines.join('\n') + '\n',
            1
        );

        expect(result.hunks.length).toBeGreaterThanOrEqual(2);
    });

    it('adds word-level segments for modified lines', () => {
        const result = computeDiff('const x = 5;\n', 'const x = 10;\n');

        const allLines = result.hunks.flatMap((h) => h.lines);
        const removedLine = allLines.find((l) => l.type === 'removed');
        const addedLine = allLines.find((l) => l.type === 'added');

        expect(removedLine?.segments).toBeDefined();
        expect(addedLine?.segments).toBeDefined();

        // The equal parts should contain "const x = "
        const equalSegments =
            removedLine?.segments?.filter((s) => s.type === 'equal') ?? [];
        expect(equalSegments.length).toBeGreaterThan(0);
    });

    it('assigns correct line numbers', () => {
        const result = computeDiff('a\nb\n', 'a\nc\n');

        const allLines = result.hunks.flatMap((h) => h.lines);

        const contextLine = allLines.find((l) => l.type === 'context');
        expect(contextLine?.oldLineNumber).toBe(1);
        expect(contextLine?.newLineNumber).toBe(1);

        const removedLine = allLines.find((l) => l.type === 'removed');
        expect(removedLine?.oldLineNumber).toBe(2);
        expect(removedLine?.newLineNumber).toBeUndefined();

        const addedLine = allLines.find((l) => l.type === 'added');
        expect(addedLine?.newLineNumber).toBe(2);
        expect(addedLine?.oldLineNumber).toBeUndefined();
    });

    it('handles completely new content', () => {
        const result = computeDiff('', 'new line\n');
        expect(result.additions).toBe(1);
        expect(result.deletions).toBe(0);
    });

    it('handles completely removed content', () => {
        const result = computeDiff('old line\n', '');
        expect(result.additions).toBe(0);
        expect(result.deletions).toBe(1);
    });

    it('includes allLines in result', () => {
        const result = computeDiff('a\nb\n', 'a\nc\n');
        expect(result.allLines).toBeDefined();
        expect(result.allLines.length).toBeGreaterThan(0);
    });
});

describe('regroupLines', () => {
    it('re-groups lines with different context size', () => {
        const lines = [];
        for (let i = 0; i < 20; i++) {
            lines.push(`line${i}`);
        }

        const oldLines = [...lines];
        const newLines = [...lines];
        newLines[10] = 'changed10';

        const result = computeDiff(
            oldLines.join('\n') + '\n',
            newLines.join('\n') + '\n',
            1
        );

        // Re-group with max context — should produce a single hunk
        const regrouped = regroupLines(result.allLines, 999_999);
        expect(regrouped.hunks).toHaveLength(1);
        expect(regrouped.allLines).toBe(result.allLines);
    });
});

describe('buildSplitLines', () => {
    it('pairs context lines on both sides', () => {
        const result = computeDiff('a\nb\n', 'a\nb\nc\n');
        const splitRows = buildSplitLines(result.allLines);

        const contextRows = splitRows.filter(
            (r) => r.left?.type === 'context' && r.right?.type === 'context'
        );
        expect(contextRows.length).toBeGreaterThan(0);
    });

    it('places removed lines on left only', () => {
        const result = computeDiff('a\nb\n', 'a\n');
        const splitRows = buildSplitLines(result.allLines);

        const removedRows = splitRows.filter((r) => r.left?.type === 'removed');
        expect(removedRows.length).toBe(1);
        expect(removedRows[0].right).toBeUndefined();
    });

    it('places added lines on right only', () => {
        const result = computeDiff('a\n', 'a\nb\n');
        const splitRows = buildSplitLines(result.allLines);

        const addedRows = splitRows.filter((r) => r.right?.type === 'added');
        expect(addedRows.length).toBe(1);
        expect(addedRows[0].left).toBeUndefined();
    });

    it('pairs adjacent removed and added lines', () => {
        const result = computeDiff('old\n', 'new\n');
        const splitRows = buildSplitLines(result.allLines);

        expect(splitRows).toHaveLength(1);
        expect(splitRows[0].left?.type).toBe('removed');
        expect(splitRows[0].right?.type).toBe('added');
    });

    it('handles more removed than added lines', () => {
        const result = computeDiff('a\nb\nc\n', 'x\n');
        const splitRows = buildSplitLines(result.allLines);

        // 3 removed, 1 added → 3 rows: first paired, two with left only
        const paired = splitRows.filter((r) => r.left && r.right);
        const leftOnly = splitRows.filter((r) => r.left && !r.right);
        expect(paired.length).toBe(1);
        expect(leftOnly.length).toBe(2);
    });

    it('handles more added than removed lines', () => {
        const result = computeDiff('a\n', 'x\ny\nz\n');
        const splitRows = buildSplitLines(result.allLines);

        const paired = splitRows.filter((r) => r.left && r.right);
        const rightOnly = splitRows.filter((r) => !r.left && r.right);
        expect(paired.length).toBe(1);
        expect(rightOnly.length).toBe(2);
    });

    it('handles block of only removed lines (no adjacent adds)', () => {
        // "a\nb\nc\n" → "a\n" removes b and c
        const result = computeDiff('a\nb\nc\n', 'a\n');
        const splitRows = buildSplitLines(result.allLines);

        const removedRows = splitRows.filter((r) => r.left?.type === 'removed');
        for (const row of removedRows) {
            expect(row.right).toBeUndefined();
        }
    });

    it('returns empty array for empty input', () => {
        const splitRows = buildSplitLines([]);
        expect(splitRows).toHaveLength(0);
    });
});

describe('buildSplitHunks', () => {
    it('produces split hunks with collapsedBefore', () => {
        const lines = Array.from({ length: 20 }, (_, i) => `line${i}`);
        const oldLines = [...lines];
        const newLines = [...lines];
        newLines[10] = 'changed10';

        const result = computeDiff(
            oldLines.join('\n') + '\n',
            newLines.join('\n') + '\n',
            2
        );

        const splitHunks = buildSplitHunks(result.allLines, 2);
        expect(splitHunks.length).toBeGreaterThanOrEqual(1);

        // First hunk should have collapsedBefore since change is at line 10
        const hunkWithCollapsed = splitHunks.find(
            (h) => h.collapsedBefore !== undefined
        );
        expect(hunkWithCollapsed).toBeDefined();
        expect(hunkWithCollapsed.collapsedBefore).toBeGreaterThan(0);
    });

    it('converts hunk lines to paired split rows', () => {
        const result = computeDiff('old\n', 'new\n');
        const splitHunks = buildSplitHunks(result.allLines, 3);

        expect(splitHunks).toHaveLength(1);
        expect(splitHunks[0].rows.length).toBeGreaterThan(0);
        expect(splitHunks[0].rows[0].left?.type).toBe('removed');
        expect(splitHunks[0].rows[0].right?.type).toBe('added');
    });

    it('returns empty array for identical input', () => {
        const result = computeDiff('same\n', 'same\n');
        const splitHunks = buildSplitHunks(result.allLines, 3);
        expect(splitHunks).toHaveLength(0);
    });
});

describe('regroupLines (extended)', () => {
    it('preserves addition and deletion counts after regrouping', () => {
        const result = computeDiff('a\nb\nc\n', 'a\nx\ny\nz\nc\n', 1);
        const regrouped = regroupLines(result.allLines, 999_999);

        expect(regrouped.additions).toBe(result.additions);
        expect(regrouped.deletions).toBe(result.deletions);
    });

    it('produces more hunks with smaller context', () => {
        const lines = Array.from({ length: 30 }, (_, i) => `line${i}`);
        const oldLines = [...lines];
        const newLines = [...lines];
        newLines[5] = 'changed5';
        newLines[25] = 'changed25';

        const text = (l: string[]) => l.join('\n') + '\n';
        const result = computeDiff(text(oldLines), text(newLines), 1);

        // With context=1, two far-apart changes should be in separate hunks
        expect(result.hunks.length).toBeGreaterThanOrEqual(2);

        // With max context, everything merges into one
        const regrouped = regroupLines(result.allLines, 999_999);
        expect(regrouped.hunks).toHaveLength(1);
    });
});

describe('computeDiff (extended)', () => {
    it('sets collapsedBefore on hunks after collapsed sections', () => {
        const lines = Array.from({ length: 20 }, (_, i) => `line${i}`);
        const oldLines = [...lines];
        const newLines = [...lines];
        newLines[15] = 'changed15';

        const result = computeDiff(
            oldLines.join('\n') + '\n',
            newLines.join('\n') + '\n',
            2
        );

        // The hunk containing the change at line 15 should have collapsedBefore
        const hunk = result.hunks.find((h) => h.collapsedBefore !== undefined);
        expect(hunk).toBeDefined();
        expect(hunk.collapsedBefore).toBeGreaterThan(0);
    });

    it('sets collapsedAfter when trailing context is collapsed', () => {
        const lines = Array.from({ length: 20 }, (_, i) => `line${i}`);
        const oldLines = [...lines];
        const newLines = [...lines];
        newLines[2] = 'changed2';

        const result = computeDiff(
            oldLines.join('\n') + '\n',
            newLines.join('\n') + '\n',
            2
        );

        // Change at line 2 with context=2 means lines 5+ are collapsed after
        expect(result.collapsedAfter).toBeGreaterThan(0);
    });

    it('produces word-level segments with correct values', () => {
        const result = computeDiff(
            'the quick brown fox\n',
            'the slow brown cat\n'
        );

        const allLines = result.hunks.flatMap((h) => h.lines);
        const removed = allLines.find((l) => l.type === 'removed');
        const added = allLines.find((l) => l.type === 'added');

        // Removed line should have "quick" marked as removed
        const removedSegment = removed?.segments?.find(
            (s) => s.type === 'removed'
        );
        expect(removedSegment?.value).toContain('quick');

        // Added line should have "slow" marked as added
        const addedSegment = added?.segments?.find((s) => s.type === 'added');
        expect(addedSegment?.value).toContain('slow');
    });

    it('does not add segments to unpaired added lines', () => {
        // Only additions, no removals to pair with
        const result = computeDiff('', 'new line 1\nnew line 2\n');

        const allLines = result.hunks.flatMap((h) => h.lines);
        for (const line of allLines) {
            expect(line.segments).toBeUndefined();
        }
    });

    it('handles input without trailing newlines', () => {
        const result = computeDiff('hello', 'world');
        expect(result.additions).toBeGreaterThanOrEqual(1);
        expect(result.deletions).toBeGreaterThanOrEqual(1);
    });

    it('handles multiline additions in the middle', () => {
        const result = computeDiff('a\nc\n', 'a\nb1\nb2\nc\n');
        expect(result.additions).toBe(2);
        expect(result.deletions).toBe(0);

        const addedLines = result.allLines.filter((l) => l.type === 'added');
        expect(addedLines[0].content).toBe('b1');
        expect(addedLines[1].content).toBe('b2');
    });
});
