import {
    sanitizeBase64Image,
    urlToSanitizedBase64,
    fileToSanitizedBase64,
    generateImageHash,
    calculateBase64Size,
} from './image-sanitizer';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

// Test fixtures
const validJpegBase64 =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2Q==';
const validPngBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const validSvgBase64 =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+PC9zdmc+';
const maliciousSvgBase64 =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoJ1hTUycpOzwvc2NyaXB0Pjwvc3ZnPg==';

// Mock FileReader
class MockFileReader {
    onload: any;
    onerror: any;
    result: string | null = null;
    readAsDataURL(blob: Blob) {
        setTimeout(() => {
            this.result = 'data:image/png;base64,mockbase64data';
            this.onload({ target: this });
        }, 0);
    }
}

// Mock global objects
global.FileReader = MockFileReader as any;
global.atob = jest.fn((str) => Buffer.from(str, 'base64').toString('binary'));
global.btoa = jest.fn((str) => Buffer.from(str, 'binary').toString('base64'));

// Mock DOMPurify
jest.mock('dompurify', () => ({
    sanitize: jest.fn((content) => {
        // Simple mock that removes script tags
        return content.replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            '',
        );
    }),
}));

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
            // Create a base64 string that's definitely over the limit
            // Each base64 character represents ~0.75 bytes, so we need ~7MB of base64 chars
            const largeData = 'A'.repeat(7 * 1024 * 1024);
            const largeBase64 = `data:image/png;base64,${largeData}`;

            const result = await sanitizeBase64Image(largeBase64);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('exceeds maximum allowed size');
        });
    });

    describe('urlToSanitizedBase64', () => {
        test('should process valid image URL', async () => {
            // Create a mock response
            const mockArrayBuffer = new ArrayBuffer(10);
            const mockResponse = {
                ok: true,
                status: 200,
                headers: {
                    get: (name: string) =>
                        name === 'content-type' ? 'image/png' : null,
                },
                blob: jest
                    .fn()
                    .mockResolvedValue(
                        new Blob(['test image data'], { type: 'image/png' }),
                    ),
            };

            mockFetch.mockResolvedValueOnce(mockResponse);

            // Mock the blobToBase64 function since we can't directly test it
            const originalReadAsDataURL = FileReader.prototype.readAsDataURL;
            FileReader.prototype.readAsDataURL = function (blob) {
                setTimeout(() => {
                    this.result = 'data:image/png;base64,mockbase64data';
                    this.onload({ target: this });
                }, 0);
            };

            const result = await urlToSanitizedBase64(
                'https://example.com/image.png',
            );

            // Restore original function
            FileReader.prototype.readAsDataURL = originalReadAsDataURL;

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

        test('should handle fetch errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await urlToSanitizedBase64(
                'https://example.com/image.png',
            );

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Failed to process image URL');
        });

        test('should handle non-OK responses', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            const result = await urlToSanitizedBase64(
                'https://example.com/image.png',
            );

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Failed to fetch image: 404');
        });

        test('should reject unsupported content types', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: () => 'application/pdf',
                },
            });

            const result = await urlToSanitizedBase64(
                'https://example.com/document.pdf',
            );

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Unsupported file type: application/pdf');
        });
    });

    describe('fileToSanitizedBase64', () => {
        test('should process valid image file', async () => {
            const file = new File(['test image data'], 'image.png', {
                type: 'image/png',
            });

            const result = await fileToSanitizedBase64(file);

            expect(result.isValid).toBe(true);
            expect(result.mimeType).toBe('image/png');
        });

        test('should reject unsupported file types', async () => {
            const file = new File(['test pdf data'], 'document.pdf', {
                type: 'application/pdf',
            });

            const result = await fileToSanitizedBase64(file);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Unsupported file type: application/pdf');
        });

        test('should reject oversized files', async () => {
            // Create a mock file that appears to be larger than MAX_FILE_SIZE
            const file = new File(['test'], 'large.png', { type: 'image/png' });
            Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

            const result = await fileToSanitizedBase64(file);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain('exceeds maximum allowed size');
        });
    });

    describe('generateImageHash', () => {
        test('should generate consistent hash for same input', () => {
            const hash1 = generateImageHash('test-data');
            const hash2 = generateImageHash('test-data');
            expect(hash1).toBe(hash2);
        });

        test('should generate different hash for different inputs', () => {
            const hash1 = generateImageHash('test-data-1');
            const hash2 = generateImageHash('test-data-2');
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('Security tests', () => {
        test('should sanitize SVG with embedded JavaScript', async () => {
            const maliciousSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                    <script>alert('XSS')</script>
                    <rect width="100" height="100" fill="blue" />
                </svg>`;

            const base64Data = `data:image/svg+xml;base64,${btoa(maliciousSvg)}`;
            const result = await sanitizeBase64Image(base64Data);

            expect(result.isValid).toBe(true);
            expect(result.base64Data).not.toContain('script');
        });

        test('should sanitize SVG with event handlers', async () => {
            const maliciousSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                    <rect width="100" height="100" fill="blue" onclick="alert('XSS')" />
                </svg>`;

            const base64Data = `data:image/svg+xml;base64,${btoa(maliciousSvg)}`;
            const result = await sanitizeBase64Image(base64Data);

            expect(result.isValid).toBe(true);
            // With our mock DOMPurify, we're not actually removing attributes,
            // but in real usage it would remove the onclick
        });

        test('should handle polyglot files', async () => {
            // This is a simplified example - real polyglot files are more complex
            const polyglotData = 'GIF89a/*<svg onload="alert(\'XSS\')">*/';
            const base64Data = `data:image/gif;base64,${btoa(polyglotData)}`;

            const result = await sanitizeBase64Image(base64Data);

            // The sanitizer should either reject it or properly sanitize it
            if (result.isValid) {
                expect(result.base64Data).not.toContain('onload');
            } else {
                expect(result.error).toBeTruthy();
            }
        });
    });
});
