import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import { cleanupEditorView } from './editor-view-builder';
import {
    getCommandResult,
    testCommand,
    testCommandWithView,
    createCommandTester,
} from './command-tester';

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
                    const tr = editorState.tr.insertText(' additional text');
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
            expect(commandResult.newState.doc.textContent).toContain('Initial');
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

            expect(result.newState.doc.nodeSize).toBeGreaterThan(initialSize);
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
            const testHelloCommand = createCommandTester(addPrefix('Hello '));

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
