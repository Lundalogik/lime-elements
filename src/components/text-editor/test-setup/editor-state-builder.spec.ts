import { EditorState, TextSelection } from 'prosemirror-state';
import { createCustomTestSchema } from './schema-builder';
import {
    createEditorState,
    createEditorStateWithSelection,
    setTextSelection,
} from './editor-state-builder';

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
            const originalState = createEditorState('<p>Test selection</p>');
            const from = 1;
            const to = 5;

            const newState = setTextSelection(originalState, from, to);

            expect(newState).not.toBe(originalState); // Should be a new state object
            expect(newState.selection.from).toBe(from);
            expect(newState.selection.to).toBe(to);
        });
    });
});
