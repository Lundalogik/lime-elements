import { describe, it, expect } from 'vitest';
import {
    escapeRegex,
    buildSearchRegex,
    navigateMatchIndex,
    pickDefaultScope,
    lineMatchesScope,
} from './search-utils';

describe('escapeRegex', () => {
    it('escapes special regex characters', () => {
        expect(escapeRegex('foo.bar')).toBe(String.raw`foo\.bar`);
        expect(escapeRegex('a+b*c?')).toBe(String.raw`a\+b\*c\?`);
        expect(escapeRegex('(test)')).toBe(String.raw`\(test\)`);
        expect(escapeRegex('[0]')).toBe(String.raw`\[0\]`);
    });

    it('returns plain text unchanged', () => {
        expect(escapeRegex('hello')).toBe('hello');
        expect(escapeRegex('')).toBe('');
    });
});

describe('buildSearchRegex', () => {
    it('returns null for empty term', () => {
        expect(buildSearchRegex('')).toBeNull();
    });

    it('builds a case-insensitive regex with capture group', () => {
        const regex = buildSearchRegex('foo');
        expect(regex).toBeInstanceOf(RegExp);
        expect(regex.flags).toContain('g');
        expect(regex.flags).toContain('i');
    });

    it('matches the search term in text', () => {
        const regex = buildSearchRegex('hello');
        const parts = 'say Hello world'.split(regex);
        expect(parts).toEqual(['say ', 'Hello', ' world']);
    });

    it('escapes special characters in the term', () => {
        const regex = buildSearchRegex('a.b');
        expect('a.b'.split(regex)).toEqual(['', 'a.b', '']);
        expect('axb'.split(regex)).toEqual(['axb']);
    });
});

describe('navigateMatchIndex', () => {
    it('returns 0 when total is 0', () => {
        expect(navigateMatchIndex(0, 1, 0)).toBe(0);
    });

    it('moves forward', () => {
        expect(navigateMatchIndex(0, 1, 5)).toBe(1);
        expect(navigateMatchIndex(3, 1, 5)).toBe(4);
    });

    it('moves backward', () => {
        expect(navigateMatchIndex(2, -1, 5)).toBe(1);
    });

    it('wraps forward from last to first', () => {
        expect(navigateMatchIndex(4, 1, 5)).toBe(0);
    });

    it('wraps backward from first to last', () => {
        expect(navigateMatchIndex(0, -1, 5)).toBe(4);
    });
});

describe('pickDefaultScope', () => {
    it('returns "removed" when there are deletions', () => {
        expect(pickDefaultScope({ additions: 0, deletions: 3 })).toBe(
            'removed'
        );
    });

    it('returns "removed" when both additions and deletions exist', () => {
        expect(pickDefaultScope({ additions: 5, deletions: 2 })).toBe(
            'removed'
        );
    });

    it('returns "added" when only additions exist', () => {
        expect(pickDefaultScope({ additions: 4, deletions: 0 })).toBe('added');
    });
});

describe('lineMatchesScope', () => {
    describe('scope: removed', () => {
        it('matches removed lines', () => {
            expect(lineMatchesScope('removed', 'removed')).toBe(true);
        });

        it('does not match added lines', () => {
            expect(lineMatchesScope('added', 'removed')).toBe(false);
        });

        it('does not match context lines', () => {
            expect(lineMatchesScope('context', 'removed')).toBe(false);
        });
    });

    describe('scope: added', () => {
        it('matches added lines', () => {
            expect(lineMatchesScope('added', 'added')).toBe(true);
        });

        it('does not match removed lines', () => {
            expect(lineMatchesScope('removed', 'added')).toBe(false);
        });

        it('does not match context lines', () => {
            expect(lineMatchesScope('context', 'added')).toBe(false);
        });
    });

    describe('scope: changed', () => {
        it('matches removed lines', () => {
            expect(lineMatchesScope('removed', 'changed')).toBe(true);
        });

        it('matches added lines', () => {
            expect(lineMatchesScope('added', 'changed')).toBe(true);
        });

        it('does not match context lines', () => {
            expect(lineMatchesScope('context', 'changed')).toBe(false);
        });
    });
});
