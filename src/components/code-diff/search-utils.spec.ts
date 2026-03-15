import { describe, it, expect } from 'vitest';
import {
    escapeRegex,
    buildSearchRegex,
    formatMatchInfo,
    navigateMatchIndex,
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

describe('formatMatchInfo', () => {
    it('returns "No matches" when total is 0', () => {
        expect(formatMatchInfo(0, 0)).toBe('No matches');
    });

    it('formats 1-based index of total', () => {
        expect(formatMatchInfo(0, 5)).toBe('1 of 5');
        expect(formatMatchInfo(2, 10)).toBe('3 of 10');
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
