import { createFileInfo, isTypeAccepted } from './files';

describe('createFileInfo', () => {
    beforeAll(() => {
        // Mock Crypto
        if (typeof global.crypto === 'undefined') {
            (global.crypto as Partial<Crypto>) = {
                randomUUID: jest.fn(
                    () => '12345678-1234-1234-1234-123456789abc',
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

        // eslint-disable-next-line sonarjs/sonar-no-unused-vars
        const { id: h, ...resultWithoutId } = result;

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
                    isTypeAccepted({ contentType: 'image/png' } as any, accept),
                ).toEqual(expected[0]);
            });

            it(`${expected[1] ? 'accepts' : 'does not accept'} image/jpg`, () => {
                expect(
                    isTypeAccepted({ contentType: 'image/jpg' } as any, accept),
                ).toEqual(expected[1]);
            });

            it(`${expected[2] ? 'accepts' : 'does not accept'} video/webp`, () => {
                expect(
                    isTypeAccepted(
                        { contentType: 'video/webp' } as any,
                        accept,
                    ),
                ).toEqual(expected[2]);
            });

            it(`${expected[3] ? 'accepts' : 'does not accept'} document/pdf`, () => {
                expect(
                    isTypeAccepted(
                        { contentType: 'document/pdf' } as any,
                        accept,
                    ),
                ).toEqual(expected[3]);
            });
        },
    );
});
