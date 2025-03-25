import { EditorState, Transaction, Command } from 'prosemirror-state';
import { createEditorView } from './editor-view-builder';
import { EditorView } from 'prosemirror-view';

/**
 * CommandResult represents the possible outcomes of a command execution
 * - For successfully applied commands:
 *   - result is true
 *   - transaction contains the transaction that was created
 *   - newState contains the state after applying the transaction
 * - For commands that couldn't be applied:
 *   - result is false
 *   - transaction is undefined
 *   - newState is undefined
 */
export interface CommandResult {
    result: boolean;
    transaction?: Transaction;
    newState?: EditorState;
}

/**
 * Gets the result of applying a ProseMirror command to a state
 *
 * @param command - The ProseMirror command to test
 * @param state - The editor state to apply the command to
 * @returns An object containing the command result, transaction, and new state (if successful)
 */
export function getCommandResult(
    command: Command,
    state: EditorState,
): CommandResult {
    let transaction: Transaction | undefined;

    // Command signature is (state, dispatch, view?) => boolean
    const commandResult = command(
        state,
        (tr) => {
            transaction = tr;
        },
        null,
    );

    // If command returned false immediately, it couldn't be applied to this state
    if (!commandResult) {
        return { result: false };
    }

    // If we have a transaction, create the new state
    let newState: EditorState | undefined;
    if (transaction) {
        newState = state.apply(transaction);
    }

    return {
        result: true,
        transaction: transaction,
        newState: newState,
    };
}

/**
 * Tests a ProseMirror command and verifies its result
 *
 * @param command - The ProseMirror command to test
 * @param state - The editor state to apply the command to
 * @param expected - An object containing expected values to verify
 * @param shouldApply - Whether the command should be applicable to the state
 * @param docContentAfter - Optional expected document content after applying command
 * @param docSizeAfter - Optional expected document size after applying command
 * @param includesContent - Optional content to check if it exists in the document content
 * @returns The result of applying the command for further assertions if needed
 */
export function testCommand(
    command: Command,
    state: EditorState,
    expected: {
        shouldApply: boolean;
        docContentAfter?: string;
        docSizeAfter?: number;
        includesContent?: string | string[];
    },
): CommandResult {
    const commandResult = getCommandResult(command, state);

    // Verify if command was applicable as expected
    expect(commandResult.result).toBe(expected.shouldApply);

    // If command should apply, verify the new state if expectations are provided
    if (expected.shouldApply && commandResult.newState) {
        if (expected.docContentAfter !== undefined) {
            expect(commandResult.newState.doc.textContent).toBe(
                expected.docContentAfter,
            );
        }

        if (expected.includesContent) {
            if (Array.isArray(expected.includesContent)) {
                // Check that all strings in the array are contained in the doc content
                expected.includesContent.forEach((content) => {
                    expect(commandResult.newState.doc.textContent).toContain(
                        content,
                    );
                });
            } else {
                expect(commandResult.newState.doc.textContent).toContain(
                    expected.includesContent,
                );
            }
        }

        if (expected.docSizeAfter !== undefined) {
            expect(commandResult.newState.doc.nodeSize).toBe(
                expected.docSizeAfter,
            );
        }
    }

    return commandResult;
}

/**
 * Tests a command with a view context, useful for commands that require access to DOM
 *
 * @param command - The command to test
 * @param state - The editor state to apply the command to
 * @param expected - Expected results after command execution
 * @returns An extended result containing the command result and the created view
 */
export function testCommandWithView(
    command: Command,
    state: EditorState,
    expected: {
        shouldApply: boolean;
        docContentAfter?: string;
        docSizeAfter?: number;
    },
): { result: CommandResult; view: EditorView; container: HTMLElement } {
    // Create a view for the command
    const { view, container } = createEditorView(state);

    let result = false;
    let transaction: Transaction | undefined;

    // Apply command with the view
    const commandResult = command(
        state,
        (tr) => {
            transaction = tr;
            view.updateState(state.apply(tr));
            result = true;
        },
        view,
    );

    // Build result object
    const commandResultObj: CommandResult = {
        result: commandResult && result,
    };

    if (transaction) {
        commandResultObj.transaction = transaction;
        commandResultObj.newState = state.apply(transaction);
    }

    // Perform assertions
    expect(commandResultObj.result).toBe(expected.shouldApply);

    if (expected.shouldApply && commandResultObj.newState) {
        if (expected.docContentAfter !== undefined) {
            expect(commandResultObj.newState.doc.textContent).toBe(
                expected.docContentAfter,
            );
        }

        if (expected.docSizeAfter !== undefined) {
            expect(commandResultObj.newState.doc.nodeSize).toBe(
                expected.docSizeAfter,
            );
        }
    }

    // Return both the result and the view so it can be cleaned up
    return { result: commandResultObj, view: view, container: container };
}

/**
 * Creates a reusable test function for testing commands under various conditions
 *
 * @param command - The command to test
 * @returns A function that accepts a state and expected results
 */
export function createCommandTester(command: Command) {
    return (
        state: EditorState,
        expected: {
            shouldApply: boolean;
            docContentAfter?: string;
            docSizeAfter?: number;
        },
    ) => testCommand(command, state, expected);
}
