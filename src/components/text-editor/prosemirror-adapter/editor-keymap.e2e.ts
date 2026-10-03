import { EditorView } from 'prosemirror-view';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    pressKey,
    textSelection,
} from './test/editor-test-harness';
import './test/editor-doc-matcher';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;
const bulletList = b.bullet_list;
const listItem = b.list_item;
const strong = b.strong;
const strikethrough = b.strikethrough;
const codeBlock = b.code_block;

describe('editor keymap through a mounted view', () => {
    let view: EditorView;
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
    });

    it('Mod-Shift-X strikes the selection', () => {
        const start = doc(p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 1, 6))
        ));
        const handled = pressKey(view, {
            key: 'X',
            keyCode: 88,
            mod: true,
            shiftKey: true,
        });
        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(p(strikethrough('hello'))));
    });

    it('Mod-Shift-C converts the block to a code block', () => {
        const start = doc(p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 2))
        ));
        const handled = pressKey(view, {
            key: 'C',
            keyCode: 67,
            mod: true,
            shiftKey: true,
        });
        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(codeBlock('hello')));
    });

    it('Mod-Shift-C merges a multi-block selection into one code block', () => {
        const start = doc(p('aa'), p('bb'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 2, 6))
        ));
        const handled = pressKey(view, {
            key: 'C',
            keyCode: 67,
            mod: true,
            shiftKey: true,
        });
        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(codeBlock('aa\nbb')));
    });

    it('Mod-Shift-C splits a code block back into one paragraph per line', () => {
        const start = doc(codeBlock('a\nb'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 2))
        ));
        const handled = pressKey(view, {
            key: 'C',
            keyCode: 67,
            mod: true,
            shiftKey: true,
        });
        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(p('a'), p('b')));
    });

    it(String.raw`Shift-Ctrl-\ is not bound to a code block conversion`, () => {
        const start = doc(p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 2))
        ));
        const handled = pressKey(view, {
            key: '\\',
            keyCode: 220,
            ctrlKey: true,
            shiftKey: true,
        });
        expect(handled).toBe(false);
        expect(view.state.doc).toEqualDoc(start);
    });

    it('lowercase Mod-b bolds the selection via the exampleSetup keymap', () => {
        const start = doc(p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 1, 6))
        ));
        const handled = pressKey(view, {
            key: 'b',
            keyCode: 66,
            mod: true,
        });
        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(p(strong('hello'))));
    });

    it('Mod-z undoes a text insertion and Shift-Mod-z redoes it', () => {
        const start = doc(p('a'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 2))
        ));
        view.dispatch(view.state.tr.insertText('b'));
        expect(view.state.doc).toEqualDoc(doc(p('ab')));

        const undone = pressKey(view, {
            key: 'z',
            keyCode: 90,
            mod: true,
        });
        expect(undone).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(p('a')));

        const redone = pressKey(view, {
            key: 'z',
            keyCode: 90,
            mod: true,
            shiftKey: true,
        });
        expect(redone).toBe(true);
        expect(view.state.doc).toEqualDoc(doc(p('ab')));
    });

    it('Enter splits a list item', () => {
        const start = doc(bulletList(listItem(p('ab'))));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 4))
        ));
        const handled = pressKey(view, { key: 'Enter', keyCode: 13 });
        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(
            doc(bulletList(listItem(p('a')), listItem(p('b'))))
        );
    });
});
