import { Schema, MarkType, NodeType } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { createTestSchema, createCustomTestSchema } from './test-schema-setup';
import {
    createEditorState,
    createEditorStateWithSelection,
    setTextSelection,
    createDocumentWithText,
} from './test-editor-state';

describe('Text Editor Test Utilities', () => {
    describe('Schema Utilities', () => {
        describe('createTestSchema', () => {
            it('should create a schema with basic marks and nodes', () => {
                const schema = createTestSchema();

                expect(schema).toBeInstanceOf(Schema);

                expect(schema.nodes.doc).toBeDefined();
                expect(schema.nodes.paragraph).toBeDefined();
                expect(schema.nodes.text).toBeDefined();

                expect(schema.nodes.bullet_list).toBeDefined();
                expect(schema.nodes.ordered_list).toBeDefined();
                expect(schema.nodes.list_item).toBeDefined();
                expect(schema.nodes.heading).toBeDefined();
                expect(schema.nodes.blockquote).toBeDefined();
                expect(schema.nodes.code_block).toBeDefined();

                expect(schema.marks.strong).toBeDefined();
                expect(schema.marks.em).toBeDefined();
                expect(schema.marks.code).toBeDefined();
                expect(schema.marks.link).toBeDefined();

                expect(schema.marks.strikethrough).toBeDefined();
                expect(schema.marks.underline).toBeDefined();
            });
        });

        describe('createCustomTestSchema', () => {
            it('should create a schema with specified options', () => {
                const customSchema = createCustomTestSchema({
                    addLists: false,
                    addStrikethrough: true,
                    addUnderline: false,
                });

                expect(customSchema).toBeInstanceOf(Schema);

                expect(customSchema.nodes.bullet_list).toBeUndefined();
                expect(customSchema.nodes.ordered_list).toBeUndefined();
                expect(customSchema.nodes.list_item).toBeUndefined();

                expect(customSchema.marks.strikethrough).toBeDefined();
                expect(customSchema.marks.underline).toBeUndefined();
            });

            it('should support custom marks', () => {
                const highlightMark = {
                    parseDOM: [{ tag: 'mark' }],
                    toDOM: () => ['mark', 0],
                };

                const customSchema = createCustomTestSchema({
                    customMarks: { highlight: highlightMark },
                });

                expect(customSchema.marks.highlight).toBeDefined();
                expect(customSchema.marks.highlight instanceof MarkType).toBe(
                    true,
                );
            });

            it('should support custom nodes', () => {
                const customNode = {
                    content: 'inline*',
                    group: 'block',
                    parseDOM: [{ tag: 'div.custom' }],
                    toDOM: () => ['div', { class: 'custom' }, 0],
                };

                const customSchema = createCustomTestSchema({
                    customNodes: { custom: customNode },
                });

                expect(customSchema.nodes.custom).toBeDefined();
                expect(customSchema.nodes.custom instanceof NodeType).toBe(
                    true,
                );
            });
        });
    });

    describe('Editor State Utilities', () => {
        describe('createEditorState', () => {
            it('should create an empty state with default schema', () => {
                const state = createEditorState();

                expect(state).toBeInstanceOf(EditorState);
                expect(state.doc.childCount).toBeGreaterThan(0);

                expect(state.schema.nodes.doc).toBeDefined();
                expect(state.schema.marks.strong).toBeDefined();
            });

            it('should create a state with content', () => {
                const content = '<p>Hello <strong>world</strong>!</p>';
                const state = createEditorState(content);

                expect(state).toBeInstanceOf(EditorState);

                const text = state.doc.textContent;
                expect(text).toBe('Hello world!');

                const wordPos = text.indexOf('world') + 1;

                const $pos = state.doc.resolve(wordPos);
                const node = state.doc.nodeAt(wordPos);
                expect($pos).toBeDefined();
                expect(node).toBeDefined();

                if (node) {
                    const hasStrongMark = node.marks.some(
                        (m) => m.type.name === 'strong',
                    );
                    expect(hasStrongMark).toBe(true);
                }
            });

            it('should accept a custom schema', () => {
                const customSchema = createCustomTestSchema({
                    addStrikethrough: false,
                });

                const state = createEditorState('<p>Test</p>', customSchema);

                expect(state.schema.marks.strikethrough).toBeUndefined();
            });
        });

        describe('createEditorStateWithSelection', () => {
            it('should create a state with the specified selection', () => {
                const content = '<p>Select this text</p>';
                const from = 1; // Start of "Select"
                const to = 11; // End of "this"

                const state = createEditorStateWithSelection(content, from, to);

                expect(state).toBeInstanceOf(EditorState);
                expect(state.selection).toBeInstanceOf(TextSelection);
                expect(state.selection.from).toBe(from);
                expect(state.selection.to).toBe(to);
            });
        });

        describe('setTextSelection', () => {
            it('should create a new state with the specified selection', () => {
                const originalState = createEditorState(
                    '<p>Test selection</p>',
                );
                const from = 1;
                const to = 5;

                const newState = setTextSelection(originalState, from, to);

                expect(newState).not.toBe(originalState); // Should be a new state object
                expect(newState.selection.from).toBe(from);
                expect(newState.selection.to).toBe(to);
            });
        });

        describe('createDocumentWithText', () => {
            it('should create a simple document with the provided text', () => {
                const text = 'Simple paragraph';
                const state = createDocumentWithText(text);

                expect(state).toBeInstanceOf(EditorState);
                expect(state.doc.textContent).toBe(text);

                const firstChild = state.doc.firstChild;
                expect(firstChild).toBeDefined();
                if (firstChild) {
                    expect(firstChild.type.name).toBe('paragraph');
                }
            });

            it('should create an empty paragraph if no text is provided', () => {
                const state = createDocumentWithText();

                expect(state).toBeInstanceOf(EditorState);

                const firstChild = state.doc.firstChild;
                expect(firstChild).toBeDefined();
                if (firstChild) {
                    expect(firstChild.type.name).toBe('paragraph');
                    expect(firstChild.textContent).toBe('');
                }
            });
        });
    });
});
