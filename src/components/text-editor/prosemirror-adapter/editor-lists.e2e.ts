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

describe('list key handling through the real stack', () => {
    let view: EditorView;
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
    });

    const mountDoc = (startDoc: any, caretPos: number) => {
        ({ view, cleanup } = mountView(
            createEditorTestState(
                harness,
                startDoc,
                textSelection(startDoc, caretPos)
            )
        ));
    };

    describe('Tab', () => {
        it('indents an item under its preceding sibling', () => {
            const start = doc(
                bulletList(listItem(p('one')), listItem(p('two')))
            );
            mountDoc(start, 11);

            pressKey(view, { key: 'Tab', keyCode: 9 });

            expect(view.state.doc).toEqualDoc(
                doc(
                    bulletList(
                        listItem(p('one'), bulletList(listItem(p('two'))))
                    )
                )
            );
        });

        it('leaves the document unchanged on a first item', () => {
            const start = doc(
                bulletList(listItem(p('one')), listItem(p('two')))
            );
            mountDoc(start, 4);

            pressKey(view, { key: 'Tab', keyCode: 9 });

            expect(view.state.doc).toEqualDoc(start);
        });
    });

    describe('Shift-Tab', () => {
        it('outdents a nested item one level', () => {
            const start = doc(
                bulletList(listItem(p('one'), bulletList(listItem(p('two')))))
            );
            mountDoc(start, 11);

            pressKey(view, { key: 'Tab', keyCode: 9, shiftKey: true });

            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('one')), listItem(p('two'))))
            );
        });

        it('lifts a top-level item out to a paragraph', () => {
            const start = doc(
                bulletList(listItem(p('one')), listItem(p('two')))
            );
            mountDoc(start, 11);

            pressKey(view, { key: 'Tab', keyCode: 9, shiftKey: true });

            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('one'))), p('two'))
            );
        });
    });

    describe('Enter', () => {
        it('splits a non-empty item into a new item', () => {
            const start = doc(bulletList(listItem(p('one'))));
            mountDoc(start, 6);

            pressKey(view, { key: 'Enter', keyCode: 13 });

            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('one')), listItem(p())))
            );
        });

        it('outdents an empty nested item one level', () => {
            const start = doc(
                bulletList(listItem(p('one'), bulletList(listItem(p()))))
            );
            mountDoc(start, 10);

            pressKey(view, { key: 'Enter', keyCode: 13 });

            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('one')), listItem(p())))
            );
        });

        it('exits the list from an empty top-level item', () => {
            const start = doc(bulletList(listItem(p('one')), listItem(p())));
            mountDoc(start, 10);

            pressKey(view, { key: 'Enter', keyCode: 13 });

            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('one'))), p())
            );
        });
    });

    describe('Backspace', () => {
        it('joins with the previous item at item start', () => {
            const start = doc(
                bulletList(listItem(p('one')), listItem(p('two')))
            );
            mountDoc(start, 10);

            pressKey(view, { key: 'Backspace', keyCode: 8 });

            const list = view.state.doc.firstChild;
            expect(list.childCount).toBe(1);
            expect(list.child(0).textContent).toBe('onetwo');
        });
    });

    describe('Mod-Shift-8', () => {
        it('toggles the item off instead of wrapping it deeper', () => {
            const start = doc(
                bulletList(listItem(p('one')), listItem(p('two')))
            );
            mountDoc(start, 11);

            pressKey(view, {
                key: '8',
                keyCode: 56,
                mod: true,
                shiftKey: true,
            });

            expect(view.state.doc).toEqualDoc(
                doc(bulletList(listItem(p('one'))), p('two'))
            );
        });
    });
});
