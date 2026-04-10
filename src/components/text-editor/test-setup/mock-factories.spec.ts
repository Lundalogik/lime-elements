import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import { createEditorView, cleanupEditorView } from './editor-view-builder';
import { createDispatchSpy, createMockEditorView } from './mock-factories';

describe('Mock Factories', () => {
    describe('createDispatchSpy', () => {
        let view: EditorView | null;
        let container: HTMLElement | null;

        afterEach(() => {
            if (view) {
                cleanupEditorView(view, container);
                view = null;
                container = null;
            }
        });

        it('should create a spy that tracks transactions', () => {
            const state = createEditorState('<p>Test</p>');
            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            const dispatchSpy = createDispatchSpy(view);

            const tr = view.state.tr.insertText(' added');
            dispatchSpy(tr);

            expect(dispatchSpy).toHaveBeenCalledWith(tr);
        });

        it('should update view state when autoUpdate is true', () => {
            const state = createEditorState('<p></p>');
            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            const dispatchSpy = createDispatchSpy(view, true);

            expect(view.state.doc.textContent).toBe('');

            const tr = view.state.tr.insertText('Updated text');
            dispatchSpy(tr);

            expect(view.state.doc.textContent).toBe('Updated text');
        });

        it('should not update view state when autoUpdate is false', () => {
            const state = createEditorState('<p></p>');
            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            const dispatchSpy = createDispatchSpy(view, false);

            expect(view.state.doc.textContent).toBe('');

            const tr = view.state.tr.insertText('New text');
            dispatchSpy(tr);

            expect(view.state.doc.textContent).toBe('');
        });
    });

    describe('createMockEditorView', () => {
        it('should create a mock view with default state', () => {
            const mock = createMockEditorView();

            expect(mock.state).toBeDefined();
            expect(typeof mock.dispatch).toBe('function');
            expect(mock.dom).toBeDefined();
        });

        it('should use provided state', () => {
            const state = createEditorState('<p>Custom</p>');
            const mock = createMockEditorView(state);

            expect(mock.state).toBe(state);
            expect(mock.state.doc.textContent).toBe('Custom');
        });

        it('should have spy functions for dispatch and destroy', () => {
            const mock = createMockEditorView();

            expect(mock.dispatch).toHaveBeenCalledTimes(0);
            mock.destroy();
            expect(mock.destroy).toHaveBeenCalledTimes(1);
        });

        it('should update state when dispatch is called', () => {
            const state = createEditorState('<p>Hello</p>');
            const mock = createMockEditorView(state);
            const tr = mock.state.tr.insertText(
                ' world',
                mock.state.doc.content.size - 1
            );
            mock.dispatch(tr);
            expect(mock.state.doc.textContent).toBe('Hello world');
        });
    });
});
