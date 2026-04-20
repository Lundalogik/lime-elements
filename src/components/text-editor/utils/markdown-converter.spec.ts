import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MarkdownConverter } from './markdown-converter';

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
    });
});
