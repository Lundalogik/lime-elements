import { describe, it, expect } from 'vitest';
import { tokenize } from './syntax-highlighter';

describe('tokenize', () => {
    it('returns plain token for unknown language', () => {
        const result = tokenize('hello', 'unknown');
        expect(result).toEqual([{ value: 'hello', type: 'plain' }]);
    });

    it('returns plain token when no language is specified', () => {
        const result = tokenize('hello');
        expect(result).toEqual([{ value: 'hello', type: 'plain' }]);
    });

    it('returns empty plain token for empty string', () => {
        const result = tokenize('', 'json');
        expect(result).toEqual([{ value: '', type: 'plain' }]);
    });
});

describe('tokenize (json)', () => {
    it('tokenizes a JSON string value', () => {
        const result = tokenize('"hello"', 'json');
        expect(result).toEqual([{ value: '"hello"', type: 'string' }]);
    });

    it('tokenizes a JSON number', () => {
        const result = tokenize('42', 'json');
        expect(result).toEqual([{ value: '42', type: 'number' }]);
    });

    it('tokenizes negative and decimal numbers', () => {
        const result = tokenize('-3.14', 'json');
        expect(result).toEqual([{ value: '-3.14', type: 'number' }]);
    });

    it('tokenizes boolean true', () => {
        const result = tokenize('true', 'json');
        expect(result).toEqual([{ value: 'true', type: 'boolean' }]);
    });

    it('tokenizes boolean false', () => {
        const result = tokenize('false', 'json');
        expect(result).toEqual([{ value: 'false', type: 'boolean' }]);
    });

    it('tokenizes null', () => {
        const result = tokenize('null', 'json');
        expect(result).toEqual([{ value: 'null', type: 'null' }]);
    });

    it('tokenizes punctuation', () => {
        const result = tokenize('{', 'json');
        expect(result).toEqual([{ value: '{', type: 'punctuation' }]);
    });

    it('distinguishes keys from string values', () => {
        const line = '    "name": "Alice"';
        const result = tokenize(line, 'json');

        const key = result.find((t) => t.value === '"name"');
        const value = result.find((t) => t.value === '"Alice"');

        expect(key?.type).toBe('key');
        expect(value?.type).toBe('string');
    });

    it('preserves whitespace as plain tokens', () => {
        const line = '    "age": 30';
        const result = tokenize(line, 'json');

        expect(result[0]).toEqual({ value: '    ', type: 'plain' });
    });

    it('tokenizes a full JSON line with mixed types', () => {
        const line = '    "enabled": true,';
        const result = tokenize(line, 'json');

        const types = result.map((t) => t.type);
        expect(types).toContain('key');
        expect(types).toContain('boolean');
        expect(types).toContain('punctuation');
    });

    it('handles strings with escaped characters', () => {
        const result = tokenize(String.raw`"say \"hello\""`, 'json');
        expect(result).toHaveLength(1);
        expect(result[0].type).toBe('string');
    });

    it('reconstructs original text from tokens', () => {
        const line = '    "host": "db.example.com",';
        const result = tokenize(line, 'json');

        const reconstructed = result.map((t) => t.value).join('');
        expect(reconstructed).toBe(line);
    });
});
