import {
    InlineImageSrc,
    InlineImageTag,
    isInlineImageTag,
} from './text-editor.types';

describe('isInlineImageTag', () => {
    it('narrows the tag shape (has tagName)', () => {
        const config: InlineImageTag = {
            tagName: 'my-image',
            getUrl: (id: string) => `/api/img/${id}`,
        };

        expect(isInlineImageTag(config)).toBe(true);
    });

    it('rejects the src shape (no tagName)', () => {
        const config: InlineImageSrc = {
            upload: () => Promise.resolve('src'),
        };

        expect(isInlineImageTag(config)).toBe(false);
    });
});
