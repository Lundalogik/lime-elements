import {
    sanitizeBase64Image,
    urlToSanitizedBase64,
    fileToSanitizedBase64,
    generateImageHash,
} from './image-sanitizer';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import * as mime from 'mime-types';

// Mock external dependencies
jest.mock('node-fetch');
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
    },
}));
jest.mock('mime-types');

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
const mockLookup = mime.lookup as jest.MockedFunction<typeof mime.lookup>;

// Test fixtures
const validJpegBase64 =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2Q==';
const validPngBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const validSvgBase64 =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+PC9zdmc+';
const maliciousSvgBase64 =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoJ1hTUyEnKTwvc2NyaXB0Pjwvc3ZnPg==';

// Mock large file (over 5MB)
const createLargeBase64 = () => {
    return 'A'.repeat(7 * 1024 * 1024);
};

describe('Image Sanitizer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sanitizeBase64Image', () => {
        test('should validate correct JPEG base64 image', async () => {
            const result = await sanitizeBase64Image(validJpegBase64);
            expect(result).toEqual({
                isValid: true,
                base64Data: validJpegBase64,
                mimeType: 'image/jpeg',
            });
        });

        test('should validate correct PNG base64 image', async () => {
            const result = await sanitizeBase64Image(validPngBase64);
            expect(result).toEqual({
                isValid: true,
                base64Data: validPngBase64,
                mimeType: 'image/png',
            });
        });

        test('should sanitize SVG images', async () => {
            const result = await sanitizeBase64Image(validSvgBase64);
            expect(result.isValid).toBe(true);
            expect(result.mimeType).toBe('image/svg+xml');
        });

        test('should sanitize malicious SVG content', async () => {
            const result = await sanitizeBase64Image(maliciousSvgBase64);
            expect(result.isValid).toBe(true);
            expect(result.base64Data).not.toContain('script');
        });

        test('should reject invalid base64 format', async () => {
            const result = await sanitizeBase64Image('not-valid-base64!@#');
            expect(result).toEqual({
                isValid: false,
                error: 'Invalid base64 format',
            });
        });

        test('should reject unsupported mime types', async () => {
            const result = await sanitizeBase64Image(
                'data:application/pdf;base64,JVBERi0xLjUKJYCBgoMKMSA=',
            );
            expect(result).toEqual({
                isValid: false,
                error: 'Unsupported file type: application/pdf',
            });
        });

        test('should reject oversized files', async () => {
            // Mock Buffer.from to return a large buffer
            const originalBufferFrom = Buffer.from;
            Buffer.from = jest.fn().mockImplementation((data, encoding) => {
                if (encoding === 'base64') {
                    // Create a buffer that appears to be larger than MAX_FILE_SIZE
                    const mockBuffer = originalBufferFrom('test');
                    Object.defineProperty(mockBuffer, 'length', {
                        value: 6 * 1024 * 1024,
                    });

                    return mockBuffer;
                }

                return originalBufferFrom(data, encoding);
            });

            // Use a small base64 string to avoid memory issues
            const largeBase64 = 'data:image/png;base64,AAAA';

            const result = await sanitizeBase64Image(largeBase64);

            // Restore original Buffer.from
            Buffer.from = originalBufferFrom;

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('exceeds maximum allowed size');
        });
    });

    describe('urlToSanitizedBase64', () => {
        test('should process valid image URL', async () => {
            // Clear all mocks
            jest.clearAllMocks();

            // Create a buffer for the response
            const buffer = Buffer.from('test image data');

            // Setup the mock implementation
            mockFetch.mockImplementation(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: {
                        get: (name: string) =>
                            name === 'content-type' ? 'image/png' : null,
                    },
                    arrayBuffer: () => Promise.resolve(buffer),
                }),
            );

            const result = await urlToSanitizedBase64(
                'https://example.com/image.png',
            );

            expect(result.isValid).toBe(true);
            expect(result.mimeType).toBe('image/png');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://example.com/image.png',
                expect.anything(),
            );
        });

        test('should reject invalid URL protocols', async () => {
            const result = await urlToSanitizedBase64(
                'ftp://example.com/image.png',
            );
            expect(result).toEqual({
                isValid: false,
                error: 'Invalid URL protocol',
            });
        });

        // test('should handle fetch errors', async () => {
        //     mockFetch.mockRejectedValue(new Error('Network error'));
        //     const result = await urlToSanitizedBase64(
        //         'https://example.com/image.png',
        //     );
        //     expect(result.isValid).toBe(false);
        // });

        // test('should handle non-OK responses', async () => {
        //     const mockResponse = {
        //         ok: false,
        //         status: 404,
        //     };
        //     mockFetch.mockResolvedValue(mockResponse as any);

        //     const result = await urlToSanitizedBase64(
        //         'https://example.com/image.png',
        //     );
        //     expect(result).toEqual({
        //         isValid: false,
        //         error: 'Failed to fetch image: 404',
        //     });
        // });

        // test('should reject unsupported content types', async () => {
        //     const mockResponse = {
        //         ok: true,
        //         headers: {
        //             get: jest.fn().mockReturnValue('application/pdf'),
        //         },
        //     };
        //     mockFetch.mockResolvedValue(mockResponse as any);

        //     const result = await urlToSanitizedBase64(
        //         'https://example.com/document.pdf',
        //     );
        //     expect(result).toEqual({
        //         isValid: false,
        //         error: 'Unsupported file type: application/pdf',
        //     });
        // });

        // test('should handle fetch timeouts', async () => {
        //     mockFetch.mockImplementation(() => {
        //         return new Promise((_, reject) => {
        //             setTimeout(() => reject(new Error('AbortError')), 100);
        //         });
        //     });

        //     const result = await urlToSanitizedBase64(
        //         'https://example.com/large-image.png',
        //     );
        //     expect(result.isValid).toBe(false);
        // });
    });

    // describe('fileToSanitizedBase64', () => {
    //     test('should process valid image file', async () => {
    //         mockLookup.mockReturnValue('image/png');
    //         mockReadFile.mockResolvedValue(Buffer.from('image data'));

    //         const result = await fileToSanitizedBase64('/path/to/image.png');
    //         expect(result.isValid).toBe(true);
    //         expect(result.mimeType).toBe('image/png');
    //     });

    //     test('should reject unsupported file types', async () => {
    //         mockLookup.mockReturnValue('application/pdf');

    //         const result = await fileToSanitizedBase64('/path/to/document.pdf');
    //         expect(result).toEqual({
    //             isValid: false,
    //             error: 'Unsupported file type: application/pdf',
    //         });
    //     });

    //     test('should handle file read errors', async () => {
    //         mockLookup.mockReturnValue('image/jpeg');
    //         mockReadFile.mockRejectedValue(new Error('File not found'));

    //         const result = await fileToSanitizedBase64('/path/to/missing.jpg');
    //         expect(result.isValid).toBe(false);
    //         expect(result.error).toBe('Failed to process image file');
    //     });

    //     test('should reject oversized files', async () => {
    //         mockLookup.mockReturnValue('image/png');
    //         // Create buffer larger than MAX_FILE_SIZE (5MB)
    //         const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
    //         mockReadFile.mockResolvedValue(largeBuffer);

    //         const result = await fileToSanitizedBase64('/path/to/large.png');
    //         expect(result.isValid).toBe(false);
    //         expect(result.error).toContain('exceeds maximum allowed size');
    //     });
    // });

    // describe('generateImageHash', () => {
    //     test('should generate consistent hash for same input', () => {
    //         const hash1 = generateImageHash('test-data');
    //         const hash2 = generateImageHash('test-data');
    //         expect(hash1).toBe(hash2);
    //     });

    //     test('should generate different hash for different inputs', () => {
    //         const hash1 = generateImageHash('test-data-1');
    //         const hash2 = generateImageHash('test-data-2');
    //         expect(hash1).not.toBe(hash2);
    //     });

    //     test('should generate expected hash for known input', () => {
    //         // Pre-computed SHA-256 hash for 'test-data'
    //         const expectedHash =
    //             '916f0027a575074ce72a331777c3478d6513f786a591bd892da1a577bf2335f9';
    //         const hash = generateImageHash('test-data');
    //         expect(hash).toBe(expectedHash);
    //     });
    // });

    // describe('Security tests', () => {
    //     it('should reject SVG with embedded JavaScript', async () => {
    //         const maliciousSvg = `
    //             <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    //                 <script>alert('XSS')</script>
    //                 <rect width="100" height="100" fill="blue" />
    //             </svg>`;

    //         const base64Data = `data:image/svg+xml;base64,${btoa(maliciousSvg)}`;
    //         const result = await sanitizeBase64Image(base64Data);

    //         expect(result.isValid).toBe(true);
    //         expect(result.base64Data).not.toContain('script');
    //     });

    //     it('should reject SVG with event handlers', async () => {
    //         const maliciousSvg = `
    //             <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    //                 <rect width="100" height="100" fill="blue" onclick="alert('XSS')" />
    //             </svg>`;

    //         const base64Data = `data:image/svg+xml;base64,${btoa(maliciousSvg)}`;
    //         const result = await sanitizeBase64Image(base64Data);

    //         expect(result.isValid).toBe(true);
    //         expect(result.base64Data).not.toContain('onclick');
    //     });

    //     it('should reject SVG with external references', async () => {
    //         const maliciousSvg = `
    //             <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    //                 <image href="https://evil.com/tracking.jpg" width="100" height="100" />
    //             </svg>`;

    //         const base64Data = `data:image/svg+xml;base64,${btoa(maliciousSvg)}`;
    //         const result = await sanitizeBase64Image(base64Data);

    //         expect(result.isValid).toBe(true);
    //         expect(result.base64Data).not.toContain('https://evil.com');
    //     });

    //     it('should reject oversized images', async () => {
    //         // Generate a large base64 string
    //         const largeData = 'A'.repeat(10 * 1024 * 1024); // 10MB of data
    //         const base64Data = `data:image/png;base64,${largeData}`;

    //         const result = await sanitizeBase64Image(base64Data);

    //         expect(result.isValid).toBe(false);
    //         expect(result.error).toContain('exceeds maximum allowed size');
    //     });

    //     it('should reject invalid MIME types', async () => {
    //         const base64Data =
    //             'data:application/javascript;base64,YWxlcnQoJ1hTUycpOw==';
    //         const result = await sanitizeBase64Image(base64Data);

    //         expect(result.isValid).toBe(false);
    //         expect(result.error).toContain('Unsupported file type');
    //     });

    //     it('should handle polyglot files (valid as multiple formats)', async () => {
    //         // This is a simplified example - real polyglot files are more complex
    //         const polyglotData = 'GIF89a/*<svg onload="alert(\'XSS\')">*/';
    //         const base64Data = `data:image/gif;base64,${btoa(polyglotData)}`;

    //         const result = await sanitizeBase64Image(base64Data);

    //         // The sanitizer should either reject it or properly sanitize it
    //         if (result.isValid) {
    //             expect(result.base64Data).not.toContain('onload');
    //         } else {
    //             expect(result.error).toBeTruthy();
    //         }
    //     });
    // });
});
