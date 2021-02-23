import { detectExtension } from './extension-mapping';

describe('detectExtension', () => {
    const testCases = [
        { input: 'example.pdf', expected: 'pdf' },
        { input: 'example.jpg', expected: 'image' },
        { input: 'example.mp4', expected: 'video' },
        { input: 'example.mp3', expected: 'audio' },
        { input: 'example.txt', expected: 'text' },
        { input: 'example.xyz', expected: 'unknown' },
    ];

    testCases.forEach((testCase) => {
        it(`should detect ${testCase.expected} extension`, () => {
            const result = detectExtension(testCase.input, '');
            expect(result).toBe(testCase.expected);
        });
    });
});
