import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import { createEditorView, cleanupEditorView } from './editor-view-builder';
import {
    simulateKeyPress,
    simulatePaste,
    simulateClick,
    simulateDragAndDrop,
    KeyModifiers,
    PasteData,
} from './event-simulator';

describe('Event Simulation Utilities', () => {
    let view: EditorView;
    let container: HTMLElement;
    let dispatchSpy: jest.Mock;

    beforeEach(() => {
        // Create a spy to track dispatched transactions
        dispatchSpy = jest.fn();

        // Create an editor view for testing events
        const state = createEditorState('<p>Test content</p>');
        const result = createEditorView(state, dispatchSpy);
        view = result.view;
        container = result.container;

        // Add the container to the document for events
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
            const event = dispatchEventSpy.mock.calls[0][0] as KeyboardEvent;
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

            // Verify that modifiers were included
            const event = dispatchEventSpy.mock.calls[0][0] as KeyboardEvent;
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
        it('should simulate a mouse click at specified coordinates', () => {
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
            // Mock the editor's DOM events
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
            // Mock the editor's DOM events
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
            const mousedown = dispatchEventSpy.mock.calls[0][0] as MouseEvent;
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
            const dragstart = dispatchEventSpy.mock.calls[1][0] as DragEvent;
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
