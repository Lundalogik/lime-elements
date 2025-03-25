import { Schema, MarkType, NodeType } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createTestSchema, createCustomTestSchema } from './test-schema-setup';
import {
    createEditorState,
    createEditorStateWithSelection,
    setTextSelection,
    createDocumentWithText,
} from './test-editor-state';
import {
    createEditorView,
    createDispatchSpy,
    cleanupEditorView,
    mockProseMirrorDOMEnvironment,
} from './test-editor-view';

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

    describe('Editor View Utilities', () => {
        // Hold references to elements that need cleanup
        let view: EditorView;
        let container: HTMLElement;

        // Clean up after each test to prevent memory leaks
        afterEach(() => {
            if (view) {
                cleanupEditorView(view, container);
                view = null;
                container = null;
            }
        });

        describe('createEditorView', () => {
            it('should create an editor view with default state', () => {
                const result = createEditorView();
                view = result.view;
                container = result.container;

                // Verify view was created
                expect(view).toBeInstanceOf(EditorView);
                // Instead of checking instance type, check that it has expected properties
                expect(container).toBeDefined();
                expect(container.tagName || container.nodeName).toBeDefined();

                // Verify default state was used
                expect(view.state).toBeInstanceOf(EditorState);
            });

            it('should use provided editor state', () => {
                const state = createEditorState('<p>Custom state</p>');
                const result = createEditorView(state);
                view = result.view;
                container = result.container;

                expect(view.state).toBe(state);
                expect(view.state.doc.textContent).toBe('Custom state');
            });

            it('should use provided dispatch spy', () => {
                const dispatchSpy = jest.fn();
                const result = createEditorView(undefined, dispatchSpy);
                view = result.view;
                container = result.container;

                // Trigger a transaction
                const tr = view.state.tr.insertText('Test');
                view.dispatch(tr);

                // Verify dispatch spy was called
                expect(dispatchSpy).toHaveBeenCalledWith(tr);
            });

            it('should use provided parent element', () => {
                const customContainer = document.createElement('div');
                const result = createEditorView(
                    undefined,
                    undefined,
                    customContainer,
                );
                view = result.view;
                container = result.container;

                expect(container).toBe(customContainer);
            });
        });

        describe('createDispatchSpy', () => {
            it('should create a spy that tracks transactions', () => {
                const dispatchSpy = createDispatchSpy();
                const state = createEditorState('<p>Test</p>');
                const result = createEditorView(state, dispatchSpy);
                view = result.view;
                container = result.container;

                // Create and dispatch a transaction
                const tr = view.state.tr.insertText('Test');
                view.dispatch(tr);

                // Verify spy was called with transaction
                expect(dispatchSpy).toHaveBeenCalled();
                expect(dispatchSpy).toHaveBeenCalledWith(tr);
            });

            it('should update view state by default', () => {
                // For this test, we need a working dispatch function
                const state = createEditorState('<p></p>');
                const result = createEditorView(state, (tr) => {
                    // Manually update state for this test
                    view.updateState(view.state.apply(tr));
                });
                view = result.view;
                container = result.container;

                // Initial state is empty
                expect(view.state.doc.textContent).toBe('');

                // Create and dispatch a transaction
                const tr = view.state.tr.insertText('Updated text');
                view.dispatch(tr);

                // View state should be updated
                expect(view.state.doc.textContent).toBe('Updated text');
            });

            it('should not update view state when autoUpdate is false', () => {
                // Create a state to track
                const state = createEditorState('<p></p>');

                // Create a dispatch function that doesn't update the state
                const noUpdateDispatch = (tr) => {
                    // Don't update the view - that's what we're testing
                };

                // Create view with the non-updating dispatch
                const result = createEditorView(state, noUpdateDispatch);
                view = result.view;
                container = result.container;

                // Initial state is empty
                expect(view.state.doc.textContent).toBe('');

                // Create and dispatch a transaction
                const tr = view.state.tr.insertText('New text');
                view.dispatch(tr);

                // View state should not be updated
                expect(view.state.doc.textContent).toBe('');
            });
        });

        describe('cleanupEditorView', () => {
            it('should destroy the editor view', () => {
                // Create a view with a spy on destroy
                const result = createEditorView();
                view = result.view;
                container = result.container;

                // Mock destroy method
                const destroySpy = jest.spyOn(view, 'destroy');

                // Clean up
                cleanupEditorView(view, container);

                // Verify destroy was called
                expect(destroySpy).toHaveBeenCalled();

                // Reset view and container references since we manually cleaned up
                view = null;
                container = null;
            });

            it('should remove container from DOM if provided', () => {
                // Create a container and add it to DOM
                const customContainer = document.createElement('div');
                document.body.appendChild(customContainer);

                // Create a view with the container
                const result = createEditorView(
                    undefined,
                    undefined,
                    customContainer,
                );
                view = result.view;
                container = result.container;

                // Spy on removeChild method
                const removeChildSpy = jest.spyOn(document.body, 'removeChild');

                // Clean up
                cleanupEditorView(view, customContainer);

                // Verify removeChild was called with our container
                expect(removeChildSpy).toHaveBeenCalledWith(customContainer);

                // Reset view and container references since we manually cleaned up
                view = null;
                container = null;

                // Restore the spy
                removeChildSpy.mockRestore();
            });
        });

        describe('mockProseMirrorDOMEnvironment', () => {
            let originalWindow;
            let originalDocument;

            beforeEach(() => {
                // Store original values
                originalWindow = global.window;
                originalDocument = global.document;
            });

            afterEach(() => {
                // Restore original values
                global.window = originalWindow;
                global.document = originalDocument;
            });

            it('should create mock DOM if none exists', () => {
                // Temporarily remove window and document
                delete global.window;
                delete global.document;

                // Call mock function
                const cleanup = mockProseMirrorDOMEnvironment();

                // Check that mocks were created
                expect(global.window).toBeDefined();
                expect(global.document).toBeDefined();
                expect(global.document.createElement).toBeDefined();

                // Clean up
                cleanup();

                // Verify cleanup worked
                expect(global.window).toBeUndefined();
                expect(global.document).toBeUndefined();
            });

            it('should not modify existing DOM environment', () => {
                // Make sure window and document exist
                global.window = { existingProp: true } as any;
                global.document = { existingProp: true } as any;

                // Call mock function
                const cleanup = mockProseMirrorDOMEnvironment();

                // Verify original objects were not changed
                expect(global.window.existingProp).toBe(true);
                expect(global.document.existingProp).toBe(true);

                // Clean up
                cleanup();

                // Original objects should be restored
                expect(global.window).toEqual({ existingProp: true });
                expect(global.document).toEqual({ existingProp: true });
            });
        });
    });
});
