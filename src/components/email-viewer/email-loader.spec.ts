import { emailLoaderHelpers } from './email-loader';

describe('emailLoaderHelpers', () => {
    describe('normalizeContentId', () => {
        it('normalizes cid prefixes and angle brackets', () => {
            expect(emailLoaderHelpers.normalizeContentId('cid:<ABC-123>')).toBe(
                'ABC-123'
            );
        });

        it('returns empty string for undefined', () => {
            expect(emailLoaderHelpers.normalizeContentId(undefined)).toBe('');
        });

        it('trims surrounding whitespace', () => {
            expect(
                emailLoaderHelpers.normalizeContentId('   <abc-123>   ')
            ).toBe('abc-123');
        });

        it('removes only outer angle brackets', () => {
            expect(emailLoaderHelpers.normalizeContentId('<abc-123>')).toBe(
                'abc-123'
            );
        });

        it('handles cid prefix case-insensitively', () => {
            expect(emailLoaderHelpers.normalizeContentId('CID:ABC-123')).toBe(
                'ABC-123'
            );
        });

        it('normalizes cid prefix without angle brackets', () => {
            expect(emailLoaderHelpers.normalizeContentId('cid:abc-123')).toBe(
                'abc-123'
            );
        });

        it('normalizes cid prefix with whitespace and brackets', () => {
            expect(
                emailLoaderHelpers.normalizeContentId(' cid:   <ABC-123> ')
            ).toBe('ABC-123');
        });

        it('leaves plain content id unchanged except trim', () => {
            expect(emailLoaderHelpers.normalizeContentId(' abc-123 ')).toBe(
                'abc-123'
            );
        });
    });

    describe('decodeCidReference', () => {
        it('decodes URI encoded cid references', () => {
            expect(emailLoaderHelpers.decodeCidReference('%3Cabc-123%3E')).toBe(
                '<abc-123>'
            );
        });
    });

    describe('replaceCidReferences', () => {
        it('replaces encoded cid urls using normalized content ids', () => {
            const html = '<img src="cid:%3Cabc-123%3E">';
            const cidUrlById = new Map<string, string>([
                ['abc-123', 'data:image/png;base64,AAA='],
            ]);

            const result = emailLoaderHelpers.replaceCidReferences(
                html,
                cidUrlById
            );

            expect(result).toContain('src="data:image/png;base64,AAA="');
        });

        it('replaces multiple cid sources in the same html', () => {
            const html =
                '<img src="cid:one"><img src="cid:%3Ctwo%3E"><img src="cid:three">';
            const cidUrlById = new Map<string, string>([
                ['one', 'data:image/png;base64,ONE='],
                ['two', 'data:image/png;base64,TWO='],
            ]);

            const result = emailLoaderHelpers.replaceCidReferences(
                html,
                cidUrlById
            );

            expect(result).toContain('src="data:image/png;base64,ONE="');
            expect(result).toContain('src="data:image/png;base64,TWO="');
            expect(result).toContain('src="cid:three"');
        });

        it('keeps html unchanged when cid map is empty', () => {
            const html = '<img src="cid:abc-123">';
            const result = emailLoaderHelpers.replaceCidReferences(
                html,
                new Map()
            );

            expect(result).toBe(html);
        });

        it('leaves non-cid image sources unchanged', () => {
            const html = '<img src="https://example.com/logo.png">';
            const cidUrlById = new Map<string, string>([
                ['abc-123', 'data:image/png;base64,AAA='],
            ]);

            const result = emailLoaderHelpers.replaceCidReferences(
                html,
                cidUrlById
            );

            expect(result).toBe(html);
        });

        it('keeps cid source when no matching content id exists', () => {
            const html = '<img src="cid:missing-id">';
            const cidUrlById = new Map<string, string>([
                ['abc-123', 'data:image/png;base64,AAA='],
            ]);

            const result = emailLoaderHelpers.replaceCidReferences(
                html,
                cidUrlById
            );

            expect(result).toContain('src="cid:missing-id"');
        });

        it('handles invalid URI encoding in cid source without throwing', () => {
            const html = '<img src="cid:%E0%A4%A">';
            const cidUrlById = new Map<string, string>([
                ['%E0%A4%A', 'data:image/png;base64,AAA='],
            ]);
            let result: string;
            expect(
                () =>
                    (result = emailLoaderHelpers.replaceCidReferences(
                        html,
                        cidUrlById
                    ))
            ).not.toThrow();
            expect(result!).toContain('src="data:image/png;base64,AAA="');
        });
    });

    describe('getAttachmentBytes', () => {
        it('supports plain ArrayBuffer input', () => {
            const bytes = new Uint8Array([4, 5, 6]);
            const result = emailLoaderHelpers.getAttachmentBytes(bytes.buffer);

            expect(result).toBeDefined();
            if (!result) {
                throw new Error('Expected bytes from ArrayBuffer');
            }
            expect([...result]).toEqual([4, 5, 6]);
        });

        it('supports array buffer views', () => {
            const bytes = new Uint8Array([1, 2, 3]);
            const result = emailLoaderHelpers.getAttachmentBytes(bytes);

            expect(result).toBeDefined();
            if (!result) {
                throw new Error('Expected bytes from array view');
            }
            expect([...result]).toEqual([1, 2, 3]);
        });

        it('respects byteOffset and byteLength for typed array views', () => {
            const source = new Uint8Array([10, 11, 12, 13, 14]);
            const slicedView = new Uint8Array(source.buffer, 1, 3);

            const result = emailLoaderHelpers.getAttachmentBytes(slicedView);

            expect(result).toBeDefined();
            if (!result) {
                throw new Error('Expected bytes from sliced typed array view');
            }
            expect([...result]).toEqual([11, 12, 13]);
        });

        it('supports DataView input', () => {
            const source = new Uint8Array([20, 21, 22, 23]);
            const dataView = new DataView(source.buffer, 1, 2);

            const result = emailLoaderHelpers.getAttachmentBytes(dataView);

            expect(result).toBeDefined();
            if (!result) {
                throw new Error('Expected bytes from DataView');
            }
            expect([...result]).toEqual([21, 22]);
        });

        it('returns undefined for unsupported content types', () => {
            expect(emailLoaderHelpers.getAttachmentBytes(undefined)).toBe(
                undefined
            );
            expect(emailLoaderHelpers.getAttachmentBytes(null)).toBe(undefined);
            expect(emailLoaderHelpers.getAttachmentBytes('not-bytes')).toBe(
                undefined
            );
            expect(emailLoaderHelpers.getAttachmentBytes({})).toBe(undefined);
        });
    });

    describe('detectImageMimeTypeFromFilename', () => {
        it('returns undefined when filename has no extension dot', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename('png')
            ).toBeUndefined();
        });

        it('returns undefined for unknown extension', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename(
                    'logo.unknown'
                )
            ).toBeUndefined();
        });

        it('returns undefined when filename ends with dot', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename('logo.')
            ).toBeUndefined();
        });

        it('detects mime type from extension', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename('logo.webp')
            ).toBe('image/webp');
        });

        it('detects mime type case-insensitively', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename('LOGO.JPEG')
            ).toBe('image/jpeg');
        });

        it('detects extension from multi-dot filename', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename(
                    'signature.logo.final.png'
                )
            ).toBe('image/png');
        });

        it('supports icon and bmp extensions', () => {
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename(
                    'favicon.ico'
                )
            ).toBe('image/x-icon');
            expect(
                emailLoaderHelpers.detectImageMimeTypeFromFilename('scan.bmp')
            ).toBe('image/bmp');
        });
    });

    describe('resolveDataUrlMimeType', () => {
        it('detects png from bytes when declared mime is octet-stream', () => {
            const bytes = new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]);

            expect(
                emailLoaderHelpers.resolveDataUrlMimeType(
                    'application/octet-stream',
                    bytes,
                    'logo.bin'
                )
            ).toBe('image/png');
        });

        it('does not trust mismatched declared image mime over detected bytes', () => {
            const svgPayload = '<svg xmlns="http://www.w3.org/2000/svg"/>';
            const bytes = new TextEncoder().encode(svgPayload);

            expect(
                emailLoaderHelpers.resolveDataUrlMimeType(
                    'image/png',
                    bytes,
                    'logo.png'
                )
            ).toBe('image/svg+xml');
        });

        it('uses detected jpeg when declared image/png is not trusted', () => {
            const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);

            expect(
                emailLoaderHelpers.resolveDataUrlMimeType(
                    'image/png',
                    jpegBytes,
                    'logo.png'
                )
            ).toBe('image/jpeg');
        });

        it('uses detected png when declared image/vnd.microsoft.icon is not trusted', () => {
            const pngBytes = new Uint8Array([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ]);

            expect(
                emailLoaderHelpers.resolveDataUrlMimeType(
                    'image/vnd.microsoft.icon',
                    pngBytes,
                    'favicon.ico'
                )
            ).toBe('image/png');
        });

        it('falls back to octet-stream when mime, bytes, and filename cannot identify an image', () => {
            const bytes = new Uint8Array([0x00, 0x11, 0x22, 0x33]);

            expect(
                emailLoaderHelpers.resolveDataUrlMimeType(
                    '',
                    bytes,
                    'logo.unknown'
                )
            ).toBe('application/octet-stream');
        });
    });

    describe('extractAttachments', () => {
        it('does not inline attachments explicitly marked as attachment', () => {
            const email = {
                attachments: [
                    {
                        filename: 'logo.png',
                        mimeType: 'image/png',
                        disposition: 'attachment',
                        related: false,
                        contentId: '<cid-1>',
                        content: new Uint8Array([
                            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
                        ]),
                    },
                ],
            };

            const result = emailLoaderHelpers.extractAttachments(email);

            expect(result.cidUrlById.size).toBe(0);
            expect(result.attachments).toHaveLength(1);
            expect(result.attachments[0].filename).toBe('logo.png');
        });

        it('inlines cid attachment and infers image mime from bytes', () => {
            const email = {
                attachments: [
                    {
                        filename: 'logo.bin',
                        mimeType: 'application/octet-stream',
                        disposition: 'inline',
                        related: true,
                        contentId: '<cid-2>',
                        content: new Uint8Array([
                            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
                        ]),
                    },
                ],
            };

            const result = emailLoaderHelpers.extractAttachments(email);

            expect(result.attachments).toHaveLength(0);
            expect(result.cidUrlById.get('cid-2')).toContain(
                'data:image/png;base64,'
            );
        });

        it('inlines cid attachment when disposition is undefined and related is false', () => {
            const email = {
                attachments: [
                    {
                        filename: 'outlook-inline.png',
                        mimeType: 'image/png',
                        related: false,
                        contentId: '<cid-3>',
                        content: new Uint8Array([
                            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
                        ]),
                    },
                ],
            };

            const result = emailLoaderHelpers.extractAttachments(email);

            expect(result.attachments).toHaveLength(0);
            expect(result.cidUrlById.get('cid-3')).toContain(
                'data:image/png;base64,'
            );
        });

        it('inlines cid attachment when disposition is non-standard and related is false', () => {
            const email = {
                attachments: [
                    {
                        filename: 'outlook-inline-2.png',
                        mimeType: 'image/png',
                        disposition: 'render',
                        related: false,
                        contentId: '<cid-4>',
                        content: new Uint8Array([
                            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
                        ]),
                    },
                ],
            };

            const result = emailLoaderHelpers.extractAttachments(email);

            expect(result.attachments).toHaveLength(0);
            expect(result.cidUrlById.get('cid-4')).toContain(
                'data:image/png;base64,'
            );
        });
    });
});
