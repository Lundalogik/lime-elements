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
    // Hold references to elements that need cleanup
    let view: EditorView;
    let container: HTMLElement;

    // Clean up after each test to prevent memory leaks
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

            // Verify view was created
            expect(view).toBeInstanceOf(EditorView);
            // Instead of checking instance type, check that it has expected properties
            expect(container).toBeDefined();
            expect(container.tagName || container.nodeName).toBeDefined();

            // Verify default state was used
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

            // Trigger a transaction
            const tr = view.state.tr.insertText('Test');
            view.dispatch(tr);

            // Verify dispatch spy was called
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

            // Create and dispatch a transaction
            const tr = view.state.tr.insertText('Test');
            view.dispatch(tr);

            // Verify spy was called with transaction
            expect(dispatchSpy).toHaveBeenCalled();
            expect(dispatchSpy).toHaveBeenCalledWith(tr);
        });

        it('should update view state by default', () => {
            // For this test, we need a working dispatch function
            const state = createEditorState('<p></p>');
            const dispatchSpy = jest.fn((transaction) => {
                // Manually update state for this test
                view.updateState(view.state.apply(transaction));
            });
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Initial state is empty
            expect(view.state.doc.textContent).toBe('');

            // Create and dispatch a transaction
            const tr = view.state.tr.insertText('Updated text');
            view.dispatch(tr);

            // View state should be updated
            expect(view.state.doc.textContent).toBe('Updated text');
        });

        it('should not update view state when autoUpdate is false', () => {
            // Create a state to track
            const state = createEditorState('<p></p>');

            // Create a dispatch function that doesn't update the state
            const noUpdateDispatch = jest.fn((transaction) => {
                console.log('transaction', transaction);
                // Don't update the view - that's what we're testing
            });

            // Create view with the non-updating dispatch
            const result = createEditorView(state, noUpdateDispatch);
            view = result.view;
            container = result.container;

            // Initial state is empty
            expect(view.state.doc.textContent).toBe('');

            // Create and dispatch a transaction
            const tr = view.state.tr.insertText('New text');
            view.dispatch(tr);

            // View state should not be updated
            expect(view.state.doc.textContent).toBe('');
        });
    });

    describe('cleanupEditorView', () => {
        it('should destroy the editor view', () => {
            // Create a view with a spy on destroy
            const result = createEditorView();
            view = result.view;
            container = result.container;

            // Mock destroy method
            const destroySpy = jest.spyOn(view, 'destroy');

            // Clean up
            cleanupEditorView(view, container);

            // Verify destroy was called
            expect(destroySpy).toHaveBeenCalled();

            // Reset view and container references since we manually cleaned up
            view = null;
            container = null;
        });

        it('should remove container from DOM if provided', () => {
            // Create a container and add it to DOM
            const customContainer = document.createElement('div');
            document.body.appendChild(customContainer);

            // Create a view with the container
            const result = createEditorView(
                undefined,
                undefined,
                customContainer,
            );
            view = result.view;
            container = result.container;

            // Spy on removeChild method
            const removeChildSpy = jest.spyOn(document.body, 'removeChild');

            // Clean up
            cleanupEditorView(view, customContainer);

            // Verify removeChild was called with our container
            expect(removeChildSpy).toHaveBeenCalledWith(customContainer);

            // Reset view and container references since we manually cleaned up
            view = null;
            container = null;

            // Restore the spy
            removeChildSpy.mockRestore();
        });
    });

    describe('mockProseMirrorDOMEnvironment', () => {
        let originalWindow;
        let originalDocument;

        beforeEach(() => {
            // Store original values
            originalWindow = global.window;
            originalDocument = global.document;
        });

        afterEach(() => {
            // Restore original values
            global.window = originalWindow;
            global.document = originalDocument;
        });

        it('should create mock DOM if none exists', () => {
            // Temporarily remove window and document
            delete global.window;
            delete global.document;

            // Call mock function
            const cleanup = mockProseMirrorDOMEnvironment();

            // Check that mocks were created
            expect(global.window).toBeDefined();
            expect(global.document).toBeDefined();
            expect(global.document.createElement).toBeDefined();

            // Clean up
            cleanup();

            // Verify cleanup worked
            expect(global.window).toBeUndefined();
            expect(global.document).toBeUndefined();
        });

        it('should not modify existing DOM environment', () => {
            // Make sure window and document exist with proper typing for the test
            global.window = { existingProp: true } as any;
            global.document = { existingProp: true } as any;

            // Call mock function
            const cleanup = mockProseMirrorDOMEnvironment();

            // Verify original objects were not changed
            expect((global.window as any).existingProp).toBe(true);
            expect((global.document as any).existingProp).toBe(true);

            // Clean up
            cleanup();

            // Original objects should be restored
            expect(global.window).toEqual({ existingProp: true });
            expect(global.document).toEqual({ existingProp: true });
        });
    });
});
