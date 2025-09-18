import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import {
    createEditorState,
    createEditorStateWithSelection,
} from './editor-state-builder';
import { createEditorView, cleanupEditorView } from './editor-view-builder';
import { simulateKeyPress, simulatePaste } from './event-simulator';
import { createTestSchema } from './schema-builder';

describe('Event Simulation Utilities', () => {
    let view: EditorView | null;
    let container: HTMLElement | null;

    afterEach(() => {
        if (view) {
            cleanupEditorView(view, container);
            view = null;
            container = null;
        }
    });

    describe('simulateKeyPress', () => {
        it('should trigger a keymap command in ProseMirror', () => {
            const schema = createTestSchema();
            const state = createEditorStateWithSelection(
                '<p>Hello world</p>',
                1,
                6,
                schema,
                [keymap({ 'Ctrl-b': toggleMark(schema.marks.strong) })]
            );

            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            simulateKeyPress(view, 'b', { ctrl: true });

            const textNode = view.state.doc.firstChild?.firstChild;
            expect(textNode).toBeDefined();

            const hasStrongMark = textNode.marks.some(
                (m) => m.type.name === 'strong'
            );
            expect(hasStrongMark).toBe(true);
        });

        it('should distinguish between different modifier combinations', () => {
            const schema = createTestSchema();
            let boldTriggered = false;
            let italicTriggered = false;

            const state = createEditorStateWithSelection(
                '<p>Test text</p>',
                1,
                5,
                schema,
                [
                    keymap({
                        'Ctrl-b': () => {
                            boldTriggered = true;

                            return true;
                        },
                        'Ctrl-i': () => {
                            italicTriggered = true;

                            return true;
                        },
                    }),
                ]
            );

            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            simulateKeyPress(view, 'b', { ctrl: true });

            expect(boldTriggered).toBe(true);
            expect(italicTriggered).toBe(false);
        });
    });

    describe('simulatePaste', () => {
        it('should insert pasted text into the document', () => {
            const state = createEditorState('<p></p>');
            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            const contentBefore = view.state.doc.textContent;

            simulatePaste(view, { text: 'pasted content' });

            const contentAfter = view.state.doc.textContent;
            expect(contentAfter).not.toBe(contentBefore);
            expect(contentAfter).toContain('pasted content');
        });

        it('should insert text into a document that already has content', () => {
            const state = createEditorState('<p>existing</p>');
            const result = createEditorView(state);
            view = result.view;
            container = result.container;

            simulatePaste(view, { text: ' more' });

            expect(view.state.doc.textContent).toContain('more');
        });
    });
});
