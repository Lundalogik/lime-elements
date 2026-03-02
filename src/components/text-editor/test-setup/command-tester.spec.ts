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
            const state = createEditorState('<p>Test</p>');
            const impossibleCommand = () => false; // Command that always fails

            const result = getCommandResult(impossibleCommand, state);

            expect(result.result).toBe(false);
            expect(result.transaction).toBeUndefined();
            expect(result.newState).toBeUndefined();
        });

        it('should return true result with transaction for applicable commands', () => {
            const state = createEditorState('<p>Test</p>');
            const insertTextCommand = (editorState, dispatch) => {
                if (dispatch) {
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

            const changeContent = (editorState, dispatch) => {
                if (dispatch) {
                    const tr = editorState.tr.insertText(' Modified');
                    dispatch(tr);
                }

                return true;
            };

            const commandResult = testCommand(changeContent, state, {
                shouldApply: true,
            });

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
            });

            expect(result.newState.doc.nodeSize).toBeGreaterThan(initialSize);
        });
    });

    describe('testCommandWithView', () => {
        let viewAndContainer: {
            view: EditorView;
            container: HTMLElement;
        } | null = null;

        afterEach(() => {
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

            const viewCommand = (editorState, dispatch, viewArg) => {
                // This command requires a view to work
                if (!viewArg) {
                    return false;
                }

                if (dispatch) {
                    const tr = editorState.tr.insertText(' with view');
                    dispatch(tr);
                }

                return true;
            };

            const { result, view, container } = testCommandWithView(
                viewCommand,
                state,
                {
                    shouldApply: true,
                },
            );

            viewAndContainer = { view: view, container: container };

            expect(result.result).toBe(true);
            expect(result.newState).toBeDefined();

            expect(view.state.doc.textContent).toContain('View test');
            expect(view.state.doc.textContent).toContain('with view');
        });
    });

    describe('createCommandTester', () => {
        it('should create a reusable tester for a command', () => {
            const addPrefix = (prefix) => (editorState, dispatch) => {
                if (dispatch) {
                    const tr = editorState.tr.insertText(prefix, 1, 1);
                    dispatch(tr);
                }

                return true;
            };

            const testHelloCommand = createCommandTester(addPrefix('Hello '));

            const state1 = createEditorState('<p>World</p>');
            const state2 = createEditorState('<p>Universe</p>');

            const result1 = testHelloCommand(state1, {
                shouldApply: true,
                docContentAfter: 'Hello World',
            });

            const result2 = testHelloCommand(state2, {
                shouldApply: true,
                docContentAfter: 'Hello Universe',
            });

            expect(result1.result).toBe(true);
            expect(result2.result).toBe(true);
        });
    });
});
