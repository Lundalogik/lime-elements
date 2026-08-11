import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MarkdownConverter } from './markdown-converter';
import { buildEditorSchema } from '../prosemirror-adapter/editor-config';

function createSchema() {
    return new Schema({
        nodes: {
            doc: { content: 'block+' },
            paragraph: {
                group: 'block',
                content: 'inline*',
            },
            text: { group: 'inline' },
            image: {
                group: 'inline',
                inline: true,
                attrs: {
                    src: { default: '' },
                    alt: { default: '' },
                    fileInfoId: { default: '' },
                    state: { default: 'success' },
                },
            },
            'custom-mention': {
                group: 'inline',
                content: 'text*',
                inline: true,
                atom: true,
                selectable: true,
                attrs: {
                    limetype: {},
                    objectid: {},
                },
            },
        },
    });
}

function createMockView(schema: Schema, docJson: any): EditorView {
    const doc = schema.nodeFromJSON(docJson);

    return {
        state: { doc: doc },
    } as unknown as EditorView;
}

describe('MarkdownConverter', () => {
    let converter: MarkdownConverter;
    let schema: Schema;

    beforeEach(() => {
        converter = new MarkdownConverter(
            [
                {
                    tagName: 'custom-mention',
                    attributes: ['limetype', 'objectid'],
                },
            ],
            'en'
        );
        schema = createSchema();
    });

    describe('serialize', () => {
        it('returns empty string for an empty document', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [{ type: 'paragraph' }],
            });

            expect(converter.serialize(view)).toBe('');
        });

        it('returns markdown for a document with text', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'hello' }],
                    },
                ],
            });

            expect(converter.serialize(view)).toContain('hello');
        });

        it('does not return empty string for a document with only an image', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'image',
                                attrs: {
                                    src: 'img.jpg',
                                    alt: 'test',
                                    fileInfoId: 'id1',
                                    state: 'success',
                                },
                            },
                        ],
                    },
                ],
            });

            expect(converter.serialize(view)).not.toBe('');
        });

        it('does not return empty string for a document with only a custom element', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'custom-mention',
                                attrs: {
                                    limetype: 'user',
                                    objectid: '1',
                                },
                                content: [{ type: 'text', text: 'Admin' }],
                            },
                        ],
                    },
                ],
            });

            expect(converter.serialize(view)).not.toBe('');
        });

        it('does not return empty string for a document with only an attribute-only custom element', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'custom-mention',
                                attrs: {
                                    limetype: 'user',
                                    objectid: '1',
                                },
                            },
                        ],
                    },
                ],
            });

            expect(converter.serialize(view)).not.toBe('');
        });

        it('returns markdown containing the custom element for a document with text and a custom element', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'hello ' },
                            {
                                type: 'custom-mention',
                                attrs: {
                                    limetype: 'user',
                                    objectid: '1',
                                },
                                content: [{ type: 'text', text: 'Admin' }],
                            },
                        ],
                    },
                ],
            });

            const result = converter.serialize(view);
            expect(result).toContain('hello');
            expect(result).toContain('custom-mention');
        });

        it('escapes custom element attribute values', () => {
            const view = createMockView(schema, {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'custom-mention',
                                attrs: {
                                    limetype: 'user',
                                    objectid: '1" onmouseover="alert(1)',
                                },
                                content: [{ type: 'text', text: 'Admin' }],
                            },
                        ],
                    },
                ],
            });

            const result = converter.serialize(view);
            expect(result).toContain('&quot;');
            expect(result).not.toContain('" onmouseover="');
        });
    });
});

describe('MarkdownConverter highlight serialization', () => {
    const editorSchema = buildEditorSchema({
        customElements: [],
        contentType: 'markdown',
        language: 'en',
    });
    const converter = new MarkdownConverter([], 'en');

    const createViewWithHighlight = (color: string, text: string) => {
        const doc = editorSchema.node('doc', null, [
            editorSchema.node('paragraph', null, [
                editorSchema.text(text, [
                    editorSchema.marks.highlight.create({ color: color }),
                ]),
            ]),
        ]);

        return { state: { doc: doc } } as unknown as EditorView;
    };

    it('serializes a highlight as an inline <mark> with its background color', () => {
        const view = createViewWithHighlight('#fff176', 'glow');

        expect(converter.serialize(view)).toContain(
            '<mark style="background-color: #fff176">glow</mark>'
        );
    });

    it('escapes the color value when writing the style attribute', () => {
        const view = createViewWithHighlight('red" onmouseover="alert(1)', 'x');

        const result = converter.serialize(view);
        expect(result).toContain('&quot;');
        expect(result).not.toContain('" onmouseover="');
    });
});
