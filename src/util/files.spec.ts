import { createFileInfo, isTypeAccepted } from './files';

describe('createFileInfo', () => {
    beforeAll(() => {
        // Mock Crypto
        if (global.crypto === undefined) {
            (global.crypto as Partial<Crypto>) = {
                randomUUID: vi.fn(
                    () =>
                        '12345678-1234-1234-1234-123456789abc' as `${string}-${string}-${string}-${string}-${string}`
                ),
            };
        }
    });

    const file: Partial<File> = {
        name: 'foo',
        type: 'pdf',
        size: 1234,
    };
    const expectedFileInfo = {
        filename: 'foo',
        contentType: 'pdf',
        size: 1234,
        fileContent: file,
        icon: {
            name: 'file',
            title: 'foo',
            color: 'rgb(var(--color-gray-dark))',
            backgroundColor: 'rgba(var(--color-gray-lighter), 0.4)',
        },
    };
    it('creates a FileInfo out of a File', () => {
        const result = createFileInfo(file as File);

        expect(result.id).toBeDefined();

        const { id: _id, ...resultWithoutId } = result;

        expect(resultWithoutId).toMatchObject(expectedFileInfo);
    });
});

describe('isTypeAccepted', () => {
    const testCases = [
        [undefined, [true, true, true, true]],
        ['*', [true, true, true, true]],
        ['image/png', [true, false, false, false]],
        ['image/png,image/jpg', [true, true, false, false]],
        ['image/png, image/jpg', [true, true, false, false]],
        ['.png', [true, false, false, false]],
        ['.png,.jpg', [true, true, false, false]],
        ['.png, .jpg', [true, true, false, false]],
        ['image/*', [true, true, false, false]],
        ['image/*,video/*', [true, true, true, false]],
        ['image/*, video/*', [true, true, true, false]],
    ];

    describe.each(testCases)(
        'with accepted types "%s"',
        (accept: string, expected: boolean[]) => {
            it(`${expected[0] ? 'accepts' : 'does not accept'} image/png`, () => {
                expect(
                    isTypeAccepted(
                        {
                            contentType: 'image/png',
                            filename: 'photo.png',
                        } as any,
                        accept
                    )
                ).toEqual(expected[0]);
            });

            it(`${expected[1] ? 'accepts' : 'does not accept'} image/jpg`, () => {
                expect(
                    isTypeAccepted(
                        {
                            contentType: 'image/jpg',
                            filename: 'photo.jpg',
                        } as any,
                        accept
                    )
                ).toEqual(expected[1]);
            });

            it(`${expected[2] ? 'accepts' : 'does not accept'} video/webp`, () => {
                expect(
                    isTypeAccepted(
                        {
                            contentType: 'video/webp',
                            filename: 'clip.webp',
                        } as any,
                        accept
                    )
                ).toEqual(expected[2]);
            });

            it(`${expected[3] ? 'accepts' : 'does not accept'} document/pdf`, () => {
                expect(
                    isTypeAccepted(
                        {
                            contentType: 'document/pdf',
                            filename: 'doc.pdf',
                        } as any,
                        accept
                    )
                ).toEqual(expected[3]);
            });
        }
    );
});

describe('isTypeAccepted matches extension specifiers by filename', () => {
    const asFile = (filename: string, contentType = ''): any => ({
        filename,
        contentType,
    });

    it('accepts an extension whose MIME subtype differs (e.g. .docx)', () => {
        // Regression: this previously matched `contentType.endsWith('/docx')`,
        // which fails for the real docx MIME type.
        const docx =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        expect(isTypeAccepted(asFile('report.docx', docx), '.docx')).toBe(true);
    });

    it('rejects a file whose extension does not match', () => {
        expect(isTypeAccepted(asFile('report.pdf'), '.docx')).toBe(false);
    });

    it('matches multi-part extensions', () => {
        expect(isTypeAccepted(asFile('archive.tar.gz'), '.tar.gz')).toBe(true);
        expect(isTypeAccepted(asFile('archive.zip'), '.tar.gz')).toBe(false);
    });

    it('matches case-insensitively', () => {
        expect(isTypeAccepted(asFile('REPORT.PDF'), '.pdf')).toBe(true);
        expect(isTypeAccepted(asFile('report.pdf'), '.PDF')).toBe(true);
    });

    it('matches by filename even when the content type is unhelpful', () => {
        expect(
            isTypeAccepted(asFile('data.7z', 'application/octet-stream'), '.7z')
        ).toBe(true);
    });

    it('matches within a comma-separated list', () => {
        expect(isTypeAccepted(asFile('sheet.xlsx'), '.pdf,.docx,.xlsx')).toBe(
            true
        );
    });
});
