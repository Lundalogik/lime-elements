import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import {
    createEditorView,
    createDispatchSpy,
    cleanupEditorView,
    mockProseMirrorDOMEnvironment,
} from './editor-view-builder';

describe('Editor View Utilities', () => {
    let view: EditorView;
    let container: HTMLElement;

    afterEach(() => {
        if (view) {
            cleanupEditorView(view, container);
            view = null;
            container = null;
        }
    });

    describe('createEditorView', () => {
        it('should create an editor view with default state', () => {
            const result = createEditorView();
            view = result.view;
            container = result.container;

            expect(view).toBeInstanceOf(EditorView);
            expect(container).toBeDefined();
            expect(container.tagName || container.nodeName).toBeDefined();

            expect(view.state).toBeInstanceOf(EditorState);
        });

        it('should use provided editor state', () => {
            const state = createEditorState('<p>Custom state</p>');
            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            expect(view.state).toBe(state);
            expect(view.state.doc.textContent).toBe('Custom state');
        });

        it('should use provided dispatch spy', () => {
            const dispatchSpy = jest.fn();
            const result = createEditorView(undefined, dispatchSpy);
            view = result.view;
            container = result.container;

            const tr = view.state.tr.insertText('Test');
            view.dispatch(tr);

            expect(dispatchSpy).toHaveBeenCalledWith(tr);
        });

        it('should use provided parent element', () => {
            const customContainer = document.createElement('div');
            const result = createEditorView(
                undefined,
                undefined,
                customContainer,
            );
            view = result.view;
            container = result.container;

            expect(container).toBe(customContainer);
        });
    });

    describe('createDispatchSpy', () => {
        it('should create a spy that tracks transactions', () => {
            const dispatchSpy = createDispatchSpy();
            const state = createEditorState('<p>Test</p>');
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            const tr = view.state.tr.insertText('Test');
            view.dispatch(tr);

            expect(dispatchSpy).toHaveBeenCalled();
            expect(dispatchSpy).toHaveBeenCalledWith(tr);
        });

        it('should update view state when autoUpdate is true', () => {
            const state = createEditorState('<p></p>');
            const dispatchSpy = createDispatchSpy(true);

            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            expect(view.state.doc.textContent).toBe('');

            const tr = view.state.tr.insertText('Updated text');
            dispatchSpy(tr);

            expect(view.state.doc.textContent).toBe('Updated text');
        });

        it('should not update view state when autoUpdate is false', () => {
            const state = createEditorState('<p></p>');
            const dispatchSpy = createDispatchSpy(false);

            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            expect(view.state.doc.textContent).toBe('');

            const tr = view.state.tr.insertText('New text');
            dispatchSpy(tr);

            expect(view.state.doc.textContent).toBe('');
        });
    });

    describe('cleanupEditorView', () => {
        it('should destroy the editor view', () => {
            const result = createEditorView();
            view = result.view;
            container = result.container;

            const destroySpy = jest.spyOn(view, 'destroy');

            cleanupEditorView(view, container);

            expect(destroySpy).toHaveBeenCalled();

            view = null;
            container = null;
        });

        it('should remove container from DOM if provided', () => {
            const customContainer = document.createElement('div');
            document.body.append(customContainer);

            const result = createEditorView(
                undefined,
                undefined,
                customContainer,
            );
            view = result.view;
            container = result.container;

            const removeChildSpy = jest.spyOn(document.body, 'removeChild');

            cleanupEditorView(view, customContainer);

            expect(removeChildSpy).toHaveBeenCalledWith(customContainer);

            view = null;
            container = null;

            removeChildSpy.mockRestore();
        });
    });

    describe('mockProseMirrorDOMEnvironment', () => {
        let originalWindow;
        let originalDocument;

        beforeEach(() => {
            originalWindow = global.window;
            originalDocument = global.document;
        });

        afterEach(() => {
            global.window = originalWindow;
            global.document = originalDocument;
        });

        it('should create mock DOM if none exists', () => {
            try {
                global.window = undefined;
                global.document = undefined;

                const cleanup = mockProseMirrorDOMEnvironment();

                expect(global.window).toBeDefined();
                expect(global.document).toBeDefined();
                expect(global.document.createElement).toBeDefined();

                cleanup();

                expect(global.window).toBeUndefined();
                expect(global.document).toBeUndefined();
            } finally {
                global.window = originalWindow;
                global.document = originalDocument;
            }
        });

        it('should not modify existing DOM environment', () => {
            let cleanup: () => void;

            try {
                global.window = { existingProp: true } as any;
                global.document = { existingProp: true } as any;

                cleanup = mockProseMirrorDOMEnvironment();

                expect((global.window as any).existingProp).toBe(true);
                expect((global.document as any).existingProp).toBe(true);

                expect(global.window).toEqual({ existingProp: true });
                expect(global.document).toEqual({ existingProp: true });
            } finally {
                if (cleanup) {
                    cleanup();
                }

                global.window = originalWindow;
                global.document = originalDocument;
            }
        });
    });
});
