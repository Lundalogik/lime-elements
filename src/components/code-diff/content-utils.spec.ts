import { describe, it, expect } from 'vitest';
import {
    extractRemovedContent,
    extractRemovedContentFromSplit,
    formatDiffSummary,
} from './content-utils';
import { DiffLine, SplitDiffLine } from './types';

describe('extractRemovedContent', () => {
    it('returns empty string when no removed lines', () => {
        const lines: DiffLine[] = [
            { type: 'added', content: 'new line' },
            { type: 'context', content: 'unchanged' },
        ];
        expect(extractRemovedContent(lines)).toBe('');
    });

    it('extracts content from removed lines only', () => {
        const lines: DiffLine[] = [
            { type: 'removed', content: 'old line 1' },
            { type: 'added', content: 'new line 1' },
            { type: 'removed', content: 'old line 2' },
        ];
        expect(extractRemovedContent(lines)).toBe('old line 1\nold line 2');
    });

    it('returns single line without newline', () => {
        const lines: DiffLine[] = [
            { type: 'removed', content: 'only removed' },
        ];
        expect(extractRemovedContent(lines)).toBe('only removed');
    });
});

describe('extractRemovedContentFromSplit', () => {
    it('returns empty string when no removed lines', () => {
        const rows: SplitDiffLine[] = [
            { left: undefined, right: { type: 'added', content: 'new' } },
        ];
        expect(extractRemovedContentFromSplit(rows)).toBe('');
    });

    it('extracts content from left side removed lines', () => {
        const rows: SplitDiffLine[] = [
            {
                left: { type: 'removed', content: 'old A' },
                right: { type: 'added', content: 'new A' },
            },
            {
                left: { type: 'removed', content: 'old B' },
                right: undefined,
            },
        ];
        expect(extractRemovedContentFromSplit(rows)).toBe('old A\nold B');
    });
});

describe('formatDiffSummary', () => {
    it('returns null when no changes', () => {
        expect(formatDiffSummary(0, 0)).toBeNull();
    });

    it('formats additions only', () => {
        expect(formatDiffSummary(3, 0)).toBe(
            'Diff: 3 additions. Use arrow keys to navigate lines.'
        );
    });

    it('formats deletions only', () => {
        expect(formatDiffSummary(0, 1)).toBe(
            'Diff: 1 deletion. Use arrow keys to navigate lines.'
        );
    });

    it('formats both additions and deletions', () => {
        expect(formatDiffSummary(2, 5)).toBe(
            'Diff: 2 additions, 5 deletions. Use arrow keys to navigate lines.'
        );
    });

    it('uses singular form for 1 addition', () => {
        expect(formatDiffSummary(1, 0)).toBe(
            'Diff: 1 addition. Use arrow keys to navigate lines.'
        );
    });
});
