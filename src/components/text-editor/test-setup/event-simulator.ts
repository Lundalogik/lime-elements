/* eslint-disable multiline-ternary */
import { EditorView } from 'prosemirror-view';

/**
 * Mock implementation of DataTransfer for testing environments
 * where the native DataTransfer isn't available
 */
export class MockDataTransfer {
    private data = new Map<string, string>();
    public files: File[] = [];
    public items = {
        add: (file: File) => {
            this.files.push(file);
        },
        clear: () => {
            this.files = [];
        },
        length: 0,
    };

    constructor() {
        // Update items.length when files changes
        Object.defineProperty(this.items, 'length', {
            get: () => this.files.length,
        });
    }

    setData(format: string, data: string): void {
        this.data.set(format, data);
    }

    getData(format: string): string {
        return this.data.get(format) || '';
    }

    clearData(format?: string): void {
        if (format) {
            this.data.delete(format);
        } else {
            this.data.clear();
        }
    }
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
 * @returns Whether the key event was handled by the editor
 */
export function simulateKeyPress(
    view: EditorView,
    key: string,
    modifiers: KeyModifiers = {},
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
 * ProseMirror specific paste event data
 */
export interface PasteData {
    text?: string;
    html?: string;
    files?: File[];
}

/**
 * Simulates pasting content into the editor
 *
 * @param view - The editor view to dispatch the paste event on
 * @param content - The content to paste (text, HTML, or both)
 * @returns Whether the paste event was handled by the editor
 */
export function simulatePaste(view: EditorView, content: PasteData): boolean {
    // Use our MockDataTransfer if native DataTransfer is not available
    const dataTransfer =
        typeof DataTransfer !== 'undefined'
            ? new DataTransfer()
            : new MockDataTransfer();

    if (content.text) {
        dataTransfer.setData('text/plain', content.text);
    }

    if (content.html) {
        dataTransfer.setData('text/html', content.html);
    }

    if (content.files) {
        for (const file of content.files) {
            dataTransfer.items.add(file);
        }
    }

    // Create a mock event that we can dispatch
    const pasteEvent = new CustomEvent('paste', {
        bubbles: true,
        cancelable: true,
    });

    // Add clipboardData property manually
    Object.defineProperty(pasteEvent, 'clipboardData', {
        value: dataTransfer,
        writable: false,
    });

    const domNode = view.dom;
    const eventHandled = domNode.dispatchEvent(pasteEvent);

    return eventHandled;
}

/**
 * Simulates a mouse click at specific coordinates within the editor
 * Note: In test environments, coordinate-based operations may not work as expected
 * since mock DOMs typically don't implement elementFromPoint.
 *
 * @param view - The editor view to dispatch the click event on
 * @param clientX - The x coordinate of the click
 * @param clientY - The y coordinate of the click
 * @param options - Additional mouse event options
 * @returns Whether the click event was handled by the editor
 */
export function simulateClick(
    view: EditorView,
    clientX: number,
    clientY: number,
    options: { button?: number; detail?: number } = {},
): boolean {
    // Create a basic event that doesn't rely on elementFromPoint
    const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: clientX,
        clientY: clientY,
        button: options.button || 0, // 0 = left button
        detail: options.detail || 1, // 1 = single click
    });

    // Add a noop implementation for coordinate methods that might be missing
    if (typeof document.elementFromPoint === 'undefined') {
        // For tests, just pretend the click always hits the editor
        // This prevents errors when ProseMirror calls elementFromPoint
        (view.dom as any).getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            right: 200,
            bottom: 200,
            width: 200,
            height: 200,
        });

        // Mock elementFromPoint to avoid errors
        if (typeof document.elementFromPoint === 'undefined') {
            (document as any).elementFromPoint = () => view.dom;
        }
    }

    const domNode = view.dom;
    const eventHandled = domNode.dispatchEvent(mouseEvent);

    return eventHandled;
}

/**
 * Simulates a drag and drop operation in the editor
 *
 * @param view - The editor view to dispatch drag events on
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @param dragData - Optional data to include in the drag operation
 * @returns Whether the drag operation was handled by the editor
 */
export function simulateDragAndDrop(
    view: EditorView,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    dragData?: PasteData,
): boolean {
    const domNode = view.dom;
    let eventHandled = true;

    // Use our MockDataTransfer if native DataTransfer is not available
    const dataTransfer =
        typeof DataTransfer !== 'undefined'
            ? new DataTransfer()
            : new MockDataTransfer();

    if (dragData) {
        if (dragData.text) {
            dataTransfer.setData('text/plain', dragData.text);
        }

        if (dragData.html) {
            dataTransfer.setData('text/html', dragData.html);
        }

        if (dragData.files) {
            for (const file of dragData.files) {
                dataTransfer.items.add(file);
            }
        }
    }

    // Make sure elementFromPoint is available
    if (typeof document.elementFromPoint === 'undefined') {
        (document as any).elementFromPoint = () => view.dom;
    }

    // Create events but don't use DragEvent constructor which may not be available
    // Use a more generic type for the events array to accommodate both MouseEvent and custom events
    const events: Event[] = [
        new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: startX,
            clientY: startY,
        }),
    ];

    // Create custom drag events since DragEvent constructor may not be available
    const createCustomDragEvent = (type: string, x: number, y: number) => {
        const event = new CustomEvent(type, {
            bubbles: true,
            cancelable: true,
        });

        // Add required properties
        Object.defineProperties(event, {
            clientX: { value: x },
            clientY: { value: y },
            dataTransfer: { value: dataTransfer },
        });

        return event;
    };

    // Add drag events using custom creation
    events.push(
        createCustomDragEvent('dragstart', startX, startY),
        createCustomDragEvent('dragover', endX, endY),
        createCustomDragEvent('drop', endX, endY),
        new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: endX,
            clientY: endY,
        }),
    );

    for (const event of events) {
        eventHandled = domNode.dispatchEvent(event) && eventHandled;
    }

    return eventHandled;
}
