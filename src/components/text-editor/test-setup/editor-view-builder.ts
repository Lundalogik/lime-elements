import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import { createTestSchema } from './schema-builder';

/**
 * Creates a ProseMirror editor view for testing purposes.
 *
 * @param state - The editor state to use (will create a default one if not provided)
 * @param dispatchSpy - Optional spy function to track dispatch calls
 * @param parentElement - Optional parent DOM element (will create one if not provided)
 * @returns The created EditorView instance and its container element
 */
export function createEditorView(
    state?: EditorState,
    dispatchSpy?: jest.Mock,
    parentElement?: HTMLElement,
): { view: EditorView; container: HTMLElement } {
    const container = parentElement || document.createElement('div');
    if (!parentElement) {
        document.body.append(container);
    }

    const editorState =
        state || createEditorState('<p></p>', createTestSchema());

    const viewProps: {
        state: EditorState;
        dispatchTransaction?: (tr: any) => void;
    } = {
        state: editorState,
    };

    if (dispatchSpy) {
        viewProps.dispatchTransaction = dispatchSpy;
    }

    const view = new EditorView(container, viewProps);

    if (dispatchSpy && typeof (dispatchSpy as any).setView === 'function') {
        (dispatchSpy as any).setView(view);
    }

    return { view: view, container: container };
}

/**
 * Creates a spy function to track dispatch calls for an editor view.
 *
 * @param autoUpdate - Whether to automatically update the view's state (default: true)
 * @returns A Jest mock function that can be used as a dispatch spy
 */
export function createDispatchSpy(autoUpdate = true): jest.Mock {
    let viewRef: EditorView;

    const spy = jest.fn((transaction) => {
        if (autoUpdate && viewRef) {
            viewRef.updateState(viewRef.state.apply(transaction));
        }

        return transaction;
    });

    (spy as any).setView = (view: EditorView) => {
        viewRef = view;
    };

    return spy;
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
    container?: HTMLElement,
): void {
    view.destroy();

    container?.remove();
}

/**
 * Sets up a minimal DOM environment for ProseMirror if one doesn't exist.
 * This is useful for testing in Node environments without a full DOM.
 *
 * @returns A cleanup function to restore the original environment
 */
export function mockProseMirrorDOMEnvironment(): () => void {
    const originalWindow = global.window;
    const originalDocument = global.document;

    if (!global.window || !global.document) {
        const mockDocument = {
            createElement: () => ({
                appendChild: () => {},
                style: {},
                classList: {
                    add: () => {},
                    remove: () => {},
                    contains: () => false,
                },
            }),
            createTextNode: () => ({}),
            body: {
                appendChild: () => {},
                removeChild: () => {},
            },
            defaultView: {},
            addEventListener: () => {},
            removeEventListener: () => {},
        };

        const mockWindow = {
            document: mockDocument,
            getComputedStyle: () => ({
                getPropertyValue: () => '',
            }),
            addEventListener: () => {},
            removeEventListener: () => {},
        };

        global.window = mockWindow as any;
        global.document = mockDocument as any;
    }

    return () => {
        global.window = originalWindow;
        global.document = originalDocument;
    };
}
