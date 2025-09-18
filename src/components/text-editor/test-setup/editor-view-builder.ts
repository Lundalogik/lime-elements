import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import { createTestSchema } from './schema-builder';

/**
 * Creates a ProseMirror editor view for testing purposes.
 *
 * @param state - The editor state to use (will create a default one if not provided)
 * @param dispatchTransaction - Optional custom dispatch function (e.g., a vi.fn() spy)
 * @param parentElement - Optional parent DOM element (will create one if not provided)
 * @returns The created EditorView instance and its container element
 */
export function createEditorView(
    state?: EditorState,
    dispatchTransaction?: (tr: Transaction) => void,
    parentElement?: HTMLElement
): { view: EditorView; container: HTMLElement } {
    const container = parentElement || document.createElement('div');
    if (!parentElement) {
        document.body.append(container);
    }

    const editorState =
        state || createEditorState('<p></p>', createTestSchema());

    const viewProps: {
        state: EditorState;
        dispatchTransaction?: (tr: Transaction) => void;
    } = {
        state: editorState,
    };

    if (dispatchTransaction) {
        viewProps.dispatchTransaction = dispatchTransaction;
    }

    const view = new EditorView(container, viewProps);

    return { view: view, container: container };
}

/**
 * Properly cleans up an editor view to prevent memory leaks.
 * This should be called in test cleanup/afterEach.
 *
 * @param view - The editor view to destroy
 * @param container - The container element to remove (if created by test)
 */
export function cleanupEditorView(
    view: EditorView,
    container?: HTMLElement
): void {
    view.destroy();

    container?.remove();
}
