import { vi, type Mock } from 'vitest';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';

type DispatchFn = (tr: Transaction) => void;

/**
 * Creates a spy function to track dispatch calls on an existing editor view.
 *
 * When `autoUpdate` is true (the default), calling the spy automatically
 * applies the transaction to the view's state, mirroring the behavior of
 * a real EditorView.
 *
 * @param view - The editor view whose state should be updated on dispatch
 * @param autoUpdate - Whether to automatically update the view's state (default: true)
 * @returns A vitest mock function typed as a dispatch function
 */
export function createDispatchSpy(
    view: EditorView,
    autoUpdate = true
): Mock<DispatchFn> {
    return vi.fn((transaction: Transaction) => {
        if (autoUpdate) {
            view.updateState(view.state.apply(transaction));
        }
    });
}

/**
 * A lightweight mock for EditorView, suitable for unit tests that need a
 * view-shaped object (e.g., commands that accept `view` as a third argument)
 * but do not require real DOM mounting or plugin infrastructure.
 */
export interface MockEditorView {
    state: EditorState;
    dispatch: Mock<DispatchFn>;
    dom: HTMLElement;
    destroy: Mock<() => void>;
}

/**
 * Creates a lightweight mock EditorView for unit testing.
 *
 * Use this when you need a view-shaped object without real DOM mounting.
 * For tests that require actual ProseMirror DOM rendering or plugin
 * interaction, use `createEditorView` instead.
 *
 * Calling `mock.dispatch(tr)` updates `mock.state` (just like a real view),
 * so subsequent reads of `mock.state` reflect the result of applied transactions.
 *
 * @param state - Optional editor state (creates a default empty state if omitted)
 * @returns A MockEditorView with vitest spy functions for dispatch and destroy
 */
export function createMockEditorView(state?: EditorState): MockEditorView {
    const mock = {
        state: state ?? createEditorState(),
        dom: document.createElement('div'),
        destroy: vi.fn(),
    } as unknown as MockEditorView;

    mock.dispatch = vi.fn((tr: Transaction) => {
        mock.state = mock.state.apply(tr);
    });

    return mock;
}
