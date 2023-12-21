import {
    getFileIcon,
    getFileColor,
    getFileBackgroundColor,
} from './file-metadata';

describe('file metadata', () => {
    [
        {
            description: 'with a known file extension',
            input: {
                id: '',
                filename: 'file.docx',
            },
            expectedOutput: {
                iconName: 'ms_word_copyrighted',
                iconColor: 'rgb(var(--color-sky-dark))',
                iconBackgroundColor: 'rgba(var(--color-sky-lighter), 0.4)',
            },
        },
        {
            description: 'with an unknown file extension',
            input: {
                id: '',
                filename: 'file.justsomethingrandom',
            },
            expectedOutput: {
                iconName: 'file',
                iconColor: 'rgb(var(--color-gray-dark))',
                iconBackgroundColor: 'rgba(var(--color-gray-lighter), 0.4)',
            },
        },
        {
            description: 'with no file extension',
            input: {
                id: '',
                filename: 'README',
            },
            expectedOutput: {
                iconName: 'file',
                iconColor: 'rgb(var(--color-gray-dark))',
                iconBackgroundColor: 'rgba(var(--color-gray-lighter), 0.4)',
            },
        },
        {
            description: 'file extension matching should be case insensitive',
            input: {
                id: '',
                filename: 'file.DOCX',
            },
            expectedOutput: {
                iconName: 'ms_word_copyrighted',
                iconColor: 'rgb(var(--color-sky-dark))',
                iconBackgroundColor: 'rgba(var(--color-sky-lighter), 0.4)',
            },
        },
    ].forEach(({ description, input, expectedOutput }) => {
        describe(description, () => {
            describe('getFileIcon', () => {
                it('returns the expected icon name', () => {
                    expect(getFileIcon(input)).toEqual(expectedOutput.iconName);
                });
            });
            describe('getFileColor', () => {
                it('returns the expected color', () => {
                    expect(getFileColor(input)).toEqual(
                        expectedOutput.iconColor,
                    );
                });
            });
            describe('getFileBackgroundColor', () => {
                it('returns the expected color', () => {
                    expect(getFileBackgroundColor(input)).toEqual(
                        expectedOutput.iconBackgroundColor,
                    );
                });
            });
        });
    });
});
