import { EditorView } from 'prosemirror-view';

/**
 * ProseMirror specific paste event data
 */
export interface PasteData {
    text?: string;
    html?: string;
}

/**
 * Key modifiers that can be used with keyboard events
 */
export interface KeyModifiers {
    shift?: boolean;
    alt?: boolean;
    ctrl?: boolean;
    meta?: boolean;
}

/**
 * Simulates a key press on the editor view
 *
 * @param view - The editor view to dispatch the key event on
 * @param key - The key to simulate (e.g., 'a', 'Enter', 'ArrowUp')
 * @param modifiers - Optional key modifiers (Shift, Alt, Ctrl, Meta)
 * @returns The result of dispatchEvent — false if a listener called preventDefault
 */
export function simulateKeyPress(
    view: EditorView,
    key: string,
    modifiers: KeyModifiers = {}
): boolean {
    const options: KeyboardEventInit = {
        key: key,
        bubbles: true,
        cancelable: true,
        shiftKey: !!modifiers.shift,
        altKey: !!modifiers.alt,
        ctrlKey: !!modifiers.ctrl,
        metaKey: !!modifiers.meta,
    };

    const event = new KeyboardEvent('keydown', options);

    const domNode = view.dom;
    const eventHandled = domNode.dispatchEvent(event);

    return eventHandled;
}

/**
 * Simulates pasting content into the editor
 *
 * @param view - The editor view to dispatch the paste event on
 * @param content - The content to paste (text, HTML, or both)
 * @returns The result of dispatchEvent — false if a listener called preventDefault
 */
export function simulatePaste(view: EditorView, content: PasteData): boolean {
    const dataTransfer = createDataTransfer(content);

    const pasteEvent = new CustomEvent('paste', {
        bubbles: true,
        cancelable: true,
    });

    Object.defineProperty(pasteEvent, 'clipboardData', {
        value: dataTransfer,
        writable: false,
    });

    const domNode = view.dom;
    const eventHandled = domNode.dispatchEvent(pasteEvent);

    return eventHandled;
}

/**
 * Minimal clipboard data mock for test environments where the native
 * DataTransfer constructor is not available (e.g., Stencil/Jest).
 * Only implements the getData/setData API that ProseMirror's paste
 * handler requires.
 */
class ClipboardDataMock {
    private readonly data = new Map<string, string>();

    setData(format: string, value: string): void {
        this.data.set(format, value);
    }

    getData(format: string): string {
        return this.data.get(format) || '';
    }
}

/**
 * Creates a clipboard data object and populates it with the provided content.
 * Uses the native DataTransfer when available, otherwise falls back to a
 * minimal mock.
 * @param content
 */
function createDataTransfer(
    content: PasteData
): DataTransfer | ClipboardDataMock {
    const dataTransfer =
        typeof DataTransfer === 'undefined'
            ? new ClipboardDataMock()
            : new DataTransfer();

    if (content.text !== undefined) {
        dataTransfer.setData('text/plain', content.text);
    }

    if (content.html !== undefined) {
        dataTransfer.setData('text/html', content.html);
    }

    return dataTransfer;
}
