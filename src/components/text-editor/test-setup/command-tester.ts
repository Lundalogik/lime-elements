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
        undefined,
    );

    if (!commandResult) {
        return { result: false };
    }

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
 * Verifies if the document's exact text content matches the expected content
 */
function verifyExactDocumentContent(
    doc: { textContent: string },
    expectedContent: string,
): void {
    expect(doc.textContent).toBe(expectedContent);
}

/**
 * Verifies if the document contains all the expected text snippets
 */
function verifyDocumentIncludes(
    doc: { textContent: string },
    expectedContent: string | string[],
): void {
    if (Array.isArray(expectedContent)) {
        // Check that all strings in the array are contained in the doc content
        for (const content of expectedContent) {
            expect(doc.textContent).toContain(content);
        }
    } else {
        expect(doc.textContent).toContain(expectedContent);
    }
}

/**
 * Verifies if the document's node size matches the expected size
 */
function verifyDocumentSize(
    doc: { nodeSize: number },
    expectedSize: number,
): void {
    expect(doc.nodeSize).toBe(expectedSize);
}

/**
 * Verifies the content of the document against expected values
 *
 * @param state - The editor state containing the document to verify
 * @param expected - The expected values to verify against
 */
function verifyDocumentContent(
    state: EditorState,
    expected: {
        docContentAfter?: string;
        docSizeAfter?: number;
        includesContent?: string | string[];
    },
): void {
    if (expected.docContentAfter !== undefined) {
        verifyExactDocumentContent(state.doc, expected.docContentAfter);
    }

    if ('includesContent' in expected) {
        verifyDocumentIncludes(state.doc, expected.includesContent);
    }

    if (expected.docSizeAfter !== undefined) {
        verifyDocumentSize(state.doc, expected.docSizeAfter);
    }
}

/**
 * Tests a ProseMirror command and verifies its result
 *
 * @param command - The ProseMirror command to test
 * @param state - The editor state to apply the command to
 * @param expected - An object containing expected values to verify:
 *  - `shouldApply`: whether the command should be applicable
 *  - `docContentAfter?`: expected document content after applying
 *  - `docSizeAfter?`: expected document size after applying
 *  = `includesContent?`: content that should exist in the document
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
        verifyDocumentContent(commandResult.newState, expected);
    }

    return commandResult;
}

/**
 * Tests a command with a view context, useful for commands that require access to DOM
 *
 * @param command - The command to test
 * @param state - The editor state to apply the command to
 * @param expected - Expected results after command execution
 *  - `shouldApply`: Whether the command should be applicable
 *  - `docContentAfter?`: Expected document content after applying
 *  - `docSizeAfter?`: Expected document size after applying
 * @returns An extended result containing the command result and the created view
 */
export function testCommandWithView(
    command: Command,
    state: EditorState,
    expected: {
        shouldApply: boolean;
        docContentAfter?: string;
        docSizeAfter?: number;
        includesContent?: string | string[];
    },
): { result: CommandResult; view: EditorView; container: HTMLElement } {
    const { view, container } = createEditorView(state);

    let result = false;
    let transaction: Transaction | undefined;

    const commandResult = command(
        state,
        (tr) => {
            transaction = tr;
            view.updateState(state.apply(tr));
            result = true;
        },
        view,
    );

    const commandResultObj: CommandResult = {
        result: commandResult && result,
    };

    if (transaction) {
        commandResultObj.transaction = transaction;
        commandResultObj.newState = state.apply(transaction);
    }

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
            includesContent?: string | string[];
        },
    ) => testCommand(command, state, expected);
}
