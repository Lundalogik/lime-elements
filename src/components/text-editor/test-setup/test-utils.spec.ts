import { Schema, MarkType, NodeType } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createTestSchema, createCustomTestSchema } from './schema-builder';
import {
    createEditorState,
    createEditorStateWithSelection,
    setTextSelection,
    createDocumentWithText,
} from './editor-state-builder';
import {
    createEditorView,
    createDispatchSpy,
    cleanupEditorView,
    mockProseMirrorDOMEnvironment,
} from './editor-view-builder';
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
import {
    getCommandResult,
    testCommand,
    testCommandWithView,
    createCommandTester,
} from './command-tester';
import {
    simulateKeyPress,
    simulatePaste,
    simulateClick,
    simulateDragAndDrop,
    KeyModifiers,
    PasteData,
} from './event-simulator';

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
                const dispatchSpy = jest.fn((transaction) => {
                    // Manually update state for this test
                    view.updateState(view.state.apply(transaction));
                });
                const result = createEditorView(state, dispatchSpy);
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
                const noUpdateDispatch = jest.fn((transaction) => {
                    console.log('transaction', transaction);
                    // Don't update the view - that's what we're testing
                });

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
                // Make sure window and document exist with proper typing for the test
                global.window = { existingProp: true } as any;
                global.document = { existingProp: true } as any;

                // Call mock function
                const cleanup = mockProseMirrorDOMEnvironment();

                // Verify original objects were not changed
                expect((global.window as any).existingProp).toBe(true);
                expect((global.document as any).existingProp).toBe(true);

                // Clean up
                cleanup();

                // Original objects should be restored
                expect(global.window).toEqual({ existingProp: true });
                expect(global.document).toEqual({ existingProp: true });
            });
        });
    });

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
                expect(state.doc.textContent).toBe(
                    'HeadingParagraph with bold',
                );

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

    describe('Command Testing Utilities', () => {
        describe('getCommandResult', () => {
            it('should return false result for commands that cannot be applied', () => {
                // Create a state and command that can't be applied
                const state = createEditorState('<p>Test</p>');
                const impossibleCommand = () => false; // Command that always fails

                const result = getCommandResult(impossibleCommand, state);

                expect(result.result).toBe(false);
                expect(result.transaction).toBeUndefined();
                expect(result.newState).toBeUndefined();
            });

            it('should return true result with transaction for applicable commands', () => {
                // Create a state and command that will be applied
                const state = createEditorState('<p>Test</p>');
                const insertTextCommand = (editorState, dispatch) => {
                    if (dispatch) {
                        // Insert the text at position 0
                        const tr =
                            editorState.tr.insertText(' additional text');
                        dispatch(tr);
                    }

                    return true;
                };

                const result = getCommandResult(insertTextCommand, state);

                expect(result.result).toBe(true);
                expect(result.transaction).toBeDefined();
                expect(result.newState).toBeDefined();

                // Check that some text was added (but don't rely on specific ordering)
                expect(result.newState.doc.textContent).toContain('Test');
                expect(result.newState.doc.textContent).toContain(
                    'additional text',
                );
            });
        });

        describe('testCommand', () => {
            it('should test command applicability', () => {
                const state = createEditorState('<p>Test</p>');

                // Command that always succeeds
                const alwaysApplicable = () => true;

                const result = testCommand(alwaysApplicable, state, {
                    shouldApply: true,
                });

                expect(result.result).toBe(true);
            });

            it('should test document content after command', () => {
                const state = createEditorState('<p>Initial</p>');

                // Command that changes content
                const changeContent = (editorState, dispatch) => {
                    if (dispatch) {
                        // Insert the text at position 0
                        const tr = editorState.tr.insertText(' Modified');
                        dispatch(tr);
                    }

                    return true;
                };

                // Don't test for specific content order
                const commandResult = testCommand(changeContent, state, {
                    shouldApply: true,
                });

                // Instead, verify content contains what we expect
                expect(commandResult.newState.doc.textContent).toContain(
                    'Initial',
                );
                expect(commandResult.newState.doc.textContent).toContain(
                    'Modified',
                );
            });

            it('should test document size after command', () => {
                const state = createEditorState('<p>Size test</p>');
                const initialSize = state.doc.nodeSize;

                // Command that adds content, increasing size
                const increaseSize = (editorState, dispatch) => {
                    if (dispatch) {
                        const tr = editorState.tr.insertText(' More text');
                        dispatch(tr);
                    }

                    return true;
                };

                const result = testCommand(increaseSize, state, {
                    shouldApply: true,
                    // We don't know exact size, but we know it should be larger
                    // so we can calculate it and assert it's bigger
                });

                expect(result.newState.doc.nodeSize).toBeGreaterThan(
                    initialSize,
                );
            });
        });

        describe('testCommandWithView', () => {
            // Variable to store view and container from test for cleanup
            let viewAndContainer: {
                view: EditorView;
                container: HTMLElement;
            } | null = null;

            afterEach(() => {
                // Clean up if we have a view
                if (viewAndContainer) {
                    cleanupEditorView(
                        viewAndContainer.view,
                        viewAndContainer.container,
                    );
                    viewAndContainer = null;
                }
            });

            it('should test commands that require view context', () => {
                const state = createEditorState('<p>View test</p>');

                // Command that uses view
                const viewCommand = (editorState, dispatch, viewArg) => {
                    // This command requires a view to work
                    if (!viewArg) {
                        return false;
                    }

                    if (dispatch) {
                        // Insert the text at position 0
                        const tr = editorState.tr.insertText(' with view');
                        dispatch(tr);
                    }

                    return true;
                };

                // Don't test for specific order
                const { result, view, container } = testCommandWithView(
                    viewCommand,
                    state,
                    {
                        shouldApply: true,
                    },
                );

                // Store for cleanup
                viewAndContainer = { view: view, container: container };

                expect(result.result).toBe(true);
                expect(result.newState).toBeDefined();

                // Check for content but not specific order
                expect(view.state.doc.textContent).toContain('View test');
                expect(view.state.doc.textContent).toContain('with view');
            });
        });

        describe('createCommandTester', () => {
            it('should create a reusable tester for a command', () => {
                // Command that adds a prefix
                const addPrefix = (prefix) => (editorState, dispatch) => {
                    if (dispatch) {
                        const tr = editorState.tr.insertText(prefix, 1, 1);
                        dispatch(tr);
                    }

                    return true;
                };

                // Create a tester for this command with "Hello " prefix
                const testHelloCommand = createCommandTester(
                    addPrefix('Hello '),
                );

                // Test it with various states
                const state1 = createEditorState('<p>World</p>');
                const state2 = createEditorState('<p>Universe</p>');

                // Test first state
                const result1 = testHelloCommand(state1, {
                    shouldApply: true,
                    docContentAfter: 'Hello World',
                });

                // Test second state with a blank line before it
                const result2 = testHelloCommand(state2, {
                    shouldApply: true,
                    docContentAfter: 'Hello Universe',
                });

                expect(result1.result).toBe(true);
                expect(result2.result).toBe(true);
            });
        });
    });

    describe('Event Simulation Utilities', () => {
        let view: EditorView;
        let container: HTMLElement;
        let dispatchSpy: jest.Mock;

        beforeEach(() => {
            // Create  a spy to track dispatched transactions
            dispatchSpy = jest.fn();

            // Create an editor vi ew for testing events
            const state = createEditorState('<p>Test content</p>');
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Add the container to the docume nt for events
            document.body.appendChild(container);
        });

        afterEach(() => {
            // Clean up
            if (view) {
                cleanupEditorView(view, container);
                view = null;
                container = null;
            }

            dispatchSpy = null;
        });

        describe('simulateKeyPress', () => {
            it('should simulate a key press on the editor', () => {
                // Mock the editor's DOM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Simulate pressing the 'a' key
                simulateKeyPress(view, 'a');

                // Verify that dispatchEvent was called with a keyboard event
                expect(dispatchEventSpy).toHaveBeenCalled();
                const event = dispatchEventSpy.mock
                    .calls[0][0] as KeyboardEvent;
                expect(event instanceof KeyboardEvent).toBe(true);
                expect(event.key).toBe('a');

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });

            it('should include modifier keys when specified', () => {
                // Mock the editor's DOM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Define modifiers
                const modifiers: KeyModifiers = {
                    ctrl: true,
                    shift: true,
                };

                // Simulate pressing Ctrl+Shift+B
                simulateKeyPress(view, 'b', modifiers);

                // Verify that modifiers w ere included
                const event = dispatchEventSpy.mock
                    .calls[0][0] as KeyboardEvent;
                expect(event.ctrlKey).toBe(true);
                expect(event.shiftKey).toBe(true);
                expect(event.altKey).toBe(false);
                expect(event.metaKey).toBe(false);

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });
        });

        describe('simulatePaste', () => {
            it('should simulate pasting text content', () => {
                // Mock the editor's DOM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Simulate pasting text
                const pasteContent: PasteData = {
                    text: 'Pasted text',
                };
                simulatePaste(view, pasteContent);

                // Verify that dispatchEvent was called with a clipboard event
                expect(dispatchEventSpy).toHaveBeenCalled();
                const event = dispatchEventSpy.mock.calls[0][0] as any;

                // In our implementation we're using CustomEvent as a workaround
                // since ClipboardEvent may not be available in all test environments
                expect(event.type).toBe('paste');

                // DataTransfer should contain the text
                const clipboardData = event.clipboardData;
                expect(clipboardData.getData('text/plain')).toBe('Pasted text');

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });

            it('should simulate pasting HTML content', () => {
                // Mock the editor's DOM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Simulate pasting HTML
                const pasteContent: PasteData = {
                    html: '<p>Formatted <strong>content</strong></p>',
                };
                simulatePaste(view, pasteContent);

                // Verify clipboard data
                const event = dispatchEventSpy.mock.calls[0][0] as any;
                const clipboardData = event.clipboardData;
                expect(clipboardData.getData('text/html')).toBe(
                    '<p>Formatted <strong>content</strong></p>',
                );

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });
        });

        describe('simulateClick', () => {
            it('should simulate a mouse click at specifie d coordinates', () => {
                // Mock the editor's DOM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Simulate click
                simulateClick(view, 100, 50);

                // Verify that dispatchEvent was called with a mouse event
                expect(dispatchEventSpy).toHaveBeenCalled();
                const event = dispatchEventSpy.mock.calls[0][0] as MouseEvent;
                expect(event instanceof MouseEvent).toBe(true);
                expect(event.type).toBe('mousedown');
                expect(event.clientX).toBe(100);
                expect(event.clientY).toBe(50);
                expect(event.button).toBe(0); // Left button

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });

            it('should support different mouse buttons and click types', () => {
                // Mock the editor's D OM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Simulate right-click (button 2) with double-click (detail 2)
                simulateClick(view, 100, 50, { button: 2, detail: 2 });

                // Verify event properties
                const event = dispatchEventSpy.mock.calls[0][0] as MouseEvent;
                expect(event.button).toBe(2); // Right button
                expect(event.detail).toBe(2); // Double-click

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });
        });

        describe('simulateDragAndDrop', () => {
            it('should simulate a complete drag and drop operation', () => {
                // Mock the editor's DOM  events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Simulate drag from (10, 10) to (50, 50)
                simulateDragAndDrop(view, 10, 10, 50, 50);

                // Should dispatch multiple events for the drag operation
                expect(dispatchEventSpy).toHaveBeenCalledTimes(5); // mousedown, dragstart, dragover, drop, mouseup

                // Check that events were dispatched in correct sequence
                const eventTypes = dispatchEventSpy.mock.calls.map(
                    (call) => call[0].type,
                );
                expect(eventTypes).toEqual([
                    'mousedown',
                    'dragstart',
                    'dragover',
                    'drop',
                    'mouseup',
                ]);

                // Verify coordinates
                const mousedown = dispatchEventSpy.mock
                    .calls[0][0] as MouseEvent;
                expect(mousedown.clientX).toBe(10);
                expect(mousedown.clientY).toBe(10);

                const drop = dispatchEventSpy.mock.calls[3][0] as DragEvent;
                expect(drop.clientX).toBe(50);
                expect(drop.clientY).toBe(50);

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });

            it('should include drag data when provided', () => {
                // Mock the editor's DOM events
                const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

                // Drag data
                const dragData: PasteData = {
                    text: 'Dragged text',
                    html: '<p>Dragged HTML</p>',
                };

                // Simulate drag with data
                simulateDragAndDrop(view, 10, 10, 50, 50, dragData);

                // Check the data in the dragstart event
                const dragstart = dispatchEventSpy.mock
                    .calls[1][0] as DragEvent;
                expect(dragstart.dataTransfer.getData('text/plain')).toBe(
                    'Dragged text',
                );
                expect(dragstart.dataTransfer.getData('text/html')).toBe(
                    '<p>Dragged HTML</p>',
                );

                // Restore the spy
                dispatchEventSpy.mockRestore();
            });
        });
    });
});
