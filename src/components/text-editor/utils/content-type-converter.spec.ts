import { buildContentWhitelist } from './content-type-converter';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';
import { InlineImageSrc, InlineImageTag } from '../text-editor.types';

const customNodes: CustomElementDefinition[] = [
    { tagName: 'custom-mention', attributes: ['limetype', 'objectid'] },
];

const tagConfig: InlineImageTag = {
    tagName: 'my-image',
    getUrl: (id: string) => `/api/img/${id}`,
    upload: () => Promise.resolve('id'),
};

const srcConfig: InlineImageSrc = {
    upload: () => Promise.resolve('src'),
};

describe('buildContentWhitelist', () => {
    it('returns the custom nodes unchanged when no inline images are configured', () => {
        expect(buildContentWhitelist(customNodes)).toBe(customNodes);
    });

    it('returns the custom nodes unchanged for the src (plain img) shape', () => {
        expect(buildContentWhitelist(customNodes, srcConfig)).toBe(customNodes);
    });

    it('appends the inline-image tag with its attributes for the tag shape', () => {
        const result = buildContentWhitelist(customNodes, tagConfig);

        expect(result).toEqual([
            ...customNodes,
            {
                tagName: 'my-image',
                attributes: ['image-id', 'width', 'height', 'alt'],
            },
        ]);
    });

    it('rejects a tag name without a hyphen (would hijack a built-in)', () => {
        const result = buildContentWhitelist(customNodes, {
            ...tagConfig,
            tagName: 'img' as `${string}-${string}`,
        });

        expect(result).toBe(customNodes);
    });
});
