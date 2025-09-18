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
        dispatchSpy = jest.fn();

        const state = createEditorState('<p>Test content</p>');
        const result = createEditorView(state, dispatchSpy);
        view = result.view;
        container = result.container;

        document.body.append(container);
    });

    afterEach(() => {
        if (view) {
            cleanupEditorView(view, container);
            view = null;
            container = null;
        }

        dispatchSpy = null;
    });

    describe('simulateKeyPress', () => {
        it('should simulate a key press on the editor', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            simulateKeyPress(view, 'a');

            expect(dispatchEventSpy).toHaveBeenCalled();
            const event = dispatchEventSpy.mock.calls[0][0] as KeyboardEvent;
            expect(event instanceof KeyboardEvent).toBe(true);
            expect(event.key).toBe('a');

            dispatchEventSpy.mockRestore();
        });

        it('should include modifier keys when specified', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            const modifiers: KeyModifiers = {
                ctrl: true,
                shift: true,
            };

            simulateKeyPress(view, 'b', modifiers);

            const event = dispatchEventSpy.mock.calls[0][0] as KeyboardEvent;
            expect(event.ctrlKey).toBe(true);
            expect(event.shiftKey).toBe(true);
            expect(event.altKey).toBe(false);
            expect(event.metaKey).toBe(false);

            dispatchEventSpy.mockRestore();
        });
    });

    describe('simulatePaste', () => {
        it('should simulate pasting text content', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            const pasteContent: PasteData = {
                text: 'Pasted text',
            };
            simulatePaste(view, pasteContent);

            expect(dispatchEventSpy).toHaveBeenCalled();
            const event = dispatchEventSpy.mock.calls[0][0] as any;

            expect(event.type).toBe('paste');

            const clipboardData = event.clipboardData;
            expect(clipboardData.getData('text/plain')).toBe('Pasted text');

            dispatchEventSpy.mockRestore();
        });

        it('should simulate pasting HTML content', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            const pasteContent: PasteData = {
                html: '<p>Formatted <strong>content</strong></p>',
            };
            simulatePaste(view, pasteContent);

            const event = dispatchEventSpy.mock.calls[0][0] as any;
            const clipboardData = event.clipboardData;
            expect(clipboardData.getData('text/html')).toBe(
                '<p>Formatted <strong>content</strong></p>',
            );

            dispatchEventSpy.mockRestore();
        });
    });

    describe('simulateClick', () => {
        it('should simulate a mouse click at specified coordinates', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            simulateClick(view, 100, 50);

            expect(dispatchEventSpy).toHaveBeenCalled();
            const event = dispatchEventSpy.mock.calls[0][0] as MouseEvent;
            expect(event instanceof MouseEvent).toBe(true);
            expect(event.type).toBe('mousedown');
            expect(event.clientX).toBe(100);
            expect(event.clientY).toBe(50);
            expect(event.button).toBe(0); // Left button

            dispatchEventSpy.mockRestore();
        });

        it('should support different mouse buttons and click types', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            // Simulate right-click (button 2) with double-click (detail 2)
            simulateClick(view, 100, 50, { button: 2, detail: 2 });

            const event = dispatchEventSpy.mock.calls[0][0] as MouseEvent;
            expect(event.button).toBe(2); // Right button
            expect(event.detail).toBe(2); // Double-click

            dispatchEventSpy.mockRestore();
        });
    });

    describe('simulateDragAndDrop', () => {
        it('should simulate a complete drag and drop operation', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            simulateDragAndDrop(view, 10, 10, 50, 50);

            expect(dispatchEventSpy).toHaveBeenCalledTimes(5);

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

            const mousedown = dispatchEventSpy.mock.calls[0][0] as MouseEvent;
            expect(mousedown.clientX).toBe(10);
            expect(mousedown.clientY).toBe(10);

            const drop = dispatchEventSpy.mock.calls[3][0] as DragEvent;
            expect(drop.clientX).toBe(50);
            expect(drop.clientY).toBe(50);

            dispatchEventSpy.mockRestore();
        });

        it('should include drag data when provided', () => {
            const dispatchEventSpy = jest.spyOn(view.dom, 'dispatchEvent');

            const dragData: PasteData = {
                text: 'Dragged text',
                html: '<p>Dragged HTML</p>',
            };

            simulateDragAndDrop(view, 10, 10, 50, 50, dragData);

            const dragstart = dispatchEventSpy.mock.calls[1][0] as DragEvent;
            expect(dragstart.dataTransfer.getData('text/plain')).toBe(
                'Dragged text',
            );
            expect(dragstart.dataTransfer.getData('text/html')).toBe(
                '<p>Dragged HTML</p>',
            );

            dispatchEventSpy.mockRestore();
        });
    });
});
