import { EditorState } from 'prosemirror-state';
import { createCustomTestSchema } from './schema-builder';
import {
    createDocWithText,
    createDocWithHTML,
    createDocWithFormattedText,
    createDocWithBulletList,
    createDocWithHeading,
    createDocWithBlockquote,
    createDocWithCodeBlock,
    MarkSpec,
} from './content-generator';

describe('Content Generation Utilities', () => {
    describe('createDocWithText', () => {
        it('should create a document with plain text', () => {
            const text = 'Plain text content';
            const state = createDocWithText(text);

            expect(state).toBeInstanceOf(EditorState);
            expect(state.doc.textContent).toBe(text);

            // Verify structure: doc -> paragraph -> text
            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();
            if (firstChild) {
                expect(firstChild.type.name).toBe('paragraph');
                expect(firstChild.textContent).toBe(text);
            }
        });

        it('should accept custom schema', () => {
            const customSchema = createCustomTestSchema({
                addLists: false,
            });

            const state = createDocWithText('Test', customSchema);

            expect(state.schema.nodes.bullet_list).toBeUndefined();
        });
    });

    describe('createDocWithHTML', () => {
        it('should parse HTML content into a document', () => {
            const html =
                '<h1>Heading</h1><p>Paragraph <strong>with bold</strong></p>';
            const state = createDocWithHTML(html);

            expect(state).toBeInstanceOf(EditorState);
            expect(state.doc.textContent).toBe('HeadingParagraph with bold');

            // Check the structure
            const firstChild = state.doc.firstChild;
            const secondChild = state.doc.child(1);

            expect(firstChild).toBeDefined();
            expect(secondChild).toBeDefined();

            if (firstChild && secondChild) {
                expect(firstChild.type.name).toBe('heading');
                expect(secondChild.type.name).toBe('paragraph');
            }
        });

        it('should handle empty or invalid HTML', () => {
            const state = createDocWithHTML('');

            expect(state).toBeInstanceOf(EditorState);
            // Should at least have a valid document structure
            expect(state.doc.childCount).toBeGreaterThan(0);
        });
    });

    describe('createDocWithFormattedText', () => {
        it('should apply specified marks to text', () => {
            const text = 'Formatted text';
            const marks: MarkSpec[] = [{ type: 'strong' }, { type: 'em' }];

            const state = createDocWithFormattedText(text, marks);

            expect(state).toBeInstanceOf(EditorState);
            expect(state.doc.textContent).toBe(text);

            // Check that marks were applied
            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();

            if (firstChild) {
                const textNode = firstChild.firstChild;
                expect(textNode).toBeDefined();

                if (textNode) {
                    const appliedMarks = textNode.marks;
                    expect(appliedMarks.length).toBe(2);

                    const markNames = appliedMarks.map((m) => m.type.name);
                    expect(markNames).toContain('strong');
                    expect(markNames).toContain('em');
                }
            }
        });

        it('should apply marks with attributes', () => {
            const text = 'Link text';
            const marks: MarkSpec[] = [
                {
                    type: 'link',
                    attrs: {
                        href: 'https://example.com',
                        title: 'Example',
                    },
                },
            ];

            const state = createDocWithFormattedText(text, marks);

            // Check mark attributes
            const firstChild = state.doc.firstChild;
            if (firstChild && firstChild.firstChild) {
                const linkMark = firstChild.firstChild.marks.find(
                    (m) => m.type.name === 'link',
                );
                expect(linkMark).toBeDefined();

                if (linkMark) {
                    expect(linkMark.attrs.href).toBe('https://example.com');
                    expect(linkMark.attrs.title).toBe('Example');
                }
            }
        });

        it('should throw an error for invalid mark types', () => {
            const text = 'Test';
            const marks: MarkSpec[] = [{ type: 'nonexistent_mark' }];

            expect(() => {
                createDocWithFormattedText(text, marks);
            }).toThrow(/not found in schema/);
        });
    });

    describe('createDocWithBulletList', () => {
        it('should create a document with a bullet list', () => {
            const items = ['Item 1', 'Item 2', 'Item 3'];
            const state = createDocWithBulletList(items);

            expect(state).toBeInstanceOf(EditorState);

            // Check structure
            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();

            if (firstChild) {
                expect(firstChild.type.name).toBe('bullet_list');
                expect(firstChild.childCount).toBe(3);

                // Check each list item
                for (let i = 0; i < items.length; i++) {
                    const listItem = firstChild.child(i);
                    expect(listItem.type.name).toBe('list_item');
                    expect(listItem.textContent).toBe(items[i]);
                }
            }
        });

        it('should handle empty list', () => {
            const state = createDocWithBulletList([]);

            expect(state).toBeInstanceOf(EditorState);

            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();

            if (firstChild) {
                expect(firstChild.type.name).toBe('bullet_list');
                expect(firstChild.childCount).toBe(0);
            }
        });
    });

    describe('createDocWithHeading', () => {
        it('should create a document with a heading', () => {
            const text = 'Heading Text';
            const level = 2;
            const state = createDocWithHeading(text, level);

            expect(state).toBeInstanceOf(EditorState);
            expect(state.doc.textContent).toBe(text);

            // Check structure
            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();

            if (firstChild) {
                expect(firstChild.type.name).toBe('heading');
                expect(firstChild.attrs.level).toBe(level);
            }
        });

        it('should default to level 1 if not specified', () => {
            const state = createDocWithHeading('Heading');

            const firstChild = state.doc.firstChild;
            if (firstChild) {
                expect(firstChild.attrs.level).toBe(1);
            }
        });
    });

    describe('createDocWithBlockquote', () => {
        it('should create a document with a blockquote', () => {
            const text = 'Quote text';
            const state = createDocWithBlockquote(text);

            expect(state).toBeInstanceOf(EditorState);
            expect(state.doc.textContent).toBe(text);

            // Check structure
            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();

            if (firstChild) {
                expect(firstChild.type.name).toBe('blockquote');

                // Blockquote should contain a paragraph
                const paragraph = firstChild.firstChild;
                expect(paragraph).toBeDefined();

                if (paragraph) {
                    expect(paragraph.type.name).toBe('paragraph');
                    expect(paragraph.textContent).toBe(text);
                }
            }
        });
    });

    describe('createDocWithCodeBlock', () => {
        it('should create a document with a code block', () => {
            const code = 'function test() { return true; }';
            const state = createDocWithCodeBlock(code);

            expect(state).toBeInstanceOf(EditorState);
            expect(state.doc.textContent).toBe(code);

            // Check structure
            const firstChild = state.doc.firstChild;
            expect(firstChild).toBeDefined();

            if (firstChild) {
                expect(firstChild.type.name).toBe('code_block');
                expect(firstChild.textContent).toBe(code);
            }
        });
    });
});
