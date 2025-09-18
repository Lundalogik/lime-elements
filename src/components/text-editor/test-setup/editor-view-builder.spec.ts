import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createEditorState } from './editor-state-builder';
import { createEditorView, cleanupEditorView } from './editor-view-builder';

describe('Editor View Utilities', () => {
    let view: EditorView | null;
    let container: HTMLElement | null;

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

        it('should use provided dispatch function', () => {
            const dispatchSpy = vi.fn();
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
                customContainer
            );
            view = result.view;
            container = result.container;

            expect(container).toBe(customContainer);
        });
    });

    describe('cleanupEditorView', () => {
        it('should destroy the editor view', () => {
            const result = createEditorView();
            view = result.view;
            container = result.container;

            const destroySpy = vi.spyOn(view, 'destroy');

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
                customContainer
            );
            view = result.view;
            container = result.container;

            expect(document.body.contains(customContainer)).toBe(true);

            cleanupEditorView(view, customContainer);

            expect(document.body.contains(customContainer)).toBe(false);

            view = null;
            container = null;
        });
    });
});
