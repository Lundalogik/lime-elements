import { NodeSpec, TagParseRule } from 'prosemirror-model';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import {
    getImageNode,
    getImageNodeMarkdownSerializer,
    ImageNodeAttrs,
} from './node';
import { InlineImageTag } from '../../../text-editor.types';

const inlineImages: InlineImageTag = {
    tagName: 'my-image',
    getUrl: (id: string) => `/api/img/${id}`,
    upload: () => Promise.resolve('id'),
};

function getSpec(): NodeSpec {
    return getImageNode('en', inlineImages).image;
}

function getTagParseRule(): TagParseRule {
    const rules = getSpec().parseDOM as TagParseRule[];

    return rules.find((rule) => rule.tag === 'my-image');
}

function getImgParseRule(): TagParseRule {
    const rules = getSpec().parseDOM as TagParseRule[];

    return rules.find((rule) => rule.tag === 'img');
}

function createElement(
    tag: string,
    attrs: Record<string, string>
): HTMLElement {
    const element = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        element.setAttribute(name, value);
    }

    return element;
}

function serializeToMarkdown(attrs: Partial<ImageNodeAttrs>): string {
    const serializer = getImageNodeMarkdownSerializer('en', inlineImages).image;
    let written = '';
    const state = {
        write: (text: string) => {
            written += text;
        },
    } as unknown as MarkdownSerializerState;
    serializer(state, { attrs: attrs } as any);

    return written;
}

describe('inline-image node', () => {
    describe('parseDOM (tag rule)', () => {
        it('resolves the id to a src via getUrl', () => {
            const attrs = getTagParseRule().getAttrs(
                createElement('my-image', {
                    'image-id': 'abc',
                    width: '300px',
                    height: '200px',
                    alt: 'a cat',
                })
            ) as ImageNodeAttrs;

            expect(attrs).toMatchObject({
                src: '/api/img/abc',
                imageId: 'abc',
                width: '300px',
                height: '200px',
                alt: 'a cat',
                state: 'success',
            });
        });

        it('rejects a tag with no image-id', () => {
            const result = getTagParseRule().getAttrs(
                createElement('my-image', { alt: 'no id' })
            );

            expect(result).toBe(false);
        });

        it('rejects a tag with an empty image-id', () => {
            const result = getTagParseRule().getAttrs(
                createElement('my-image', { 'image-id': '' })
            );

            expect(result).toBe(false);
        });

        it('preserves an absent alt as empty rather than synthesizing one', () => {
            const attrs = getTagParseRule().getAttrs(
                createElement('my-image', { 'image-id': 'abc' })
            ) as ImageNodeAttrs;

            expect(attrs.alt).toBe('');
            expect(attrs.width).toBe('');
            expect(attrs.height).toBe('');
        });
    });

    describe('parseDOM (img fallback rule)', () => {
        it('reads src and inline-style dimensions from a plain img', () => {
            const img = document.createElement('img');
            img.setAttribute('src', 'data:image/png;base64,AAAA');
            img.style.width = '120px';
            img.style.height = '80px';

            const attrs = getImgParseRule().getAttrs(img) as ImageNodeAttrs;

            expect(attrs).toMatchObject({
                src: 'data:image/png;base64,AAAA',
                width: '120px',
                height: '80px',
                state: 'success',
            });
        });
    });

    describe('markdown serialization', () => {
        it('serializes a stored image back to the inline-image tag', () => {
            const html = serializeToMarkdown({
                state: 'success',
                imageId: 'abc',
                alt: 'a cat',
                width: '300px',
                height: '200px',
            });

            expect(html).toBe(
                '<my-image image-id="abc" width="300px" height="200px" alt="a cat"></my-image>'
            );
        });

        it('round-trips an id-only tag without gaining attributes', () => {
            const parsed = getTagParseRule().getAttrs(
                createElement('my-image', { 'image-id': 'abc' })
            ) as ImageNodeAttrs;

            const html = serializeToMarkdown(parsed);

            expect(html).toBe('<my-image image-id="abc"></my-image>');
        });

        it('escapes attribute values', () => {
            const html = serializeToMarkdown({
                state: 'success',
                imageId: 'a"b&c',
                alt: '<script>',
            });

            expect(html).toContain('image-id="a&quot;b&amp;c"');
            expect(html).toContain('alt="&lt;script&gt;"');
        });

        it('falls back to a plain img when no imageId is present', () => {
            const html = serializeToMarkdown({
                state: 'success',
                src: 'https://example.com/x.png',
                alt: 'x',
            });

            expect(html).toBe(
                '<img src="https://example.com/x.png" alt="x" />'
            );
        });
    });

    describe('toDOM (tag path)', () => {
        it('emits the inline-image tag with whitelisted attributes', () => {
            const spec = getSpec();
            const output = spec.toDOM({
                attrs: {
                    state: 'success',
                    imageId: 'abc',
                    alt: 'a cat',
                    width: '300px',
                    height: '200px',
                },
            } as any) as [string, Record<string, string>];

            expect(output[0]).toBe('my-image');
            expect(output[1]).toEqual({
                'image-id': 'abc',
                alt: 'a cat',
                width: '300px',
                height: '200px',
            });
        });
    });
});
