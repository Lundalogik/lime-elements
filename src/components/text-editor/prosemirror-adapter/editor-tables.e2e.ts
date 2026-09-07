import { Node } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CellSelection, cellAround } from 'prosemirror-tables';
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
const table = b.table;
const row = b.table_row;
const cell = b.table_cell;

describe('table editing on a mounted view', () => {
    let view: EditorView;
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
    });

    it('empties cell contents on Delete while keeping the table structure', () => {
        const start = doc(table(row(cell(p('a')), cell(p('b')))));
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));

        view.dispatch(
            view.state.tr.setSelection(
                CellSelection.create(view.state.doc, 2, 7)
            )
        );
        const handled = pressKey(view, { key: 'Delete', keyCode: 46 });

        expect(handled).toBe(true);
        expect(view.state.doc).toEqualDoc(
            doc(table(row(cell(p()), cell(p()))))
        );
    });

    it('does not handle Tab in a table cell', () => {
        const start = doc(table(row(cell(p('a')), cell(p('b')))));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 4))
        ));

        const handled = pressKey(view, { key: 'Tab', keyCode: 9 });

        expect(handled).toBe(false);
        expect(view.state.doc).toEqualDoc(start);
    });
});

describe('pasting into a table on a mounted view', () => {
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
    });

    function mount(d: Node, selection: Selection): EditorView {
        const mounted = mountView(createEditorTestState(harness, d, selection));
        cleanup = mounted.cleanup;

        return mounted.view;
    }

    function copy(view: EditorView): DataTransfer {
        const data = new DataTransfer();
        view.dom.dispatchEvent(
            new ClipboardEvent('copy', { clipboardData: data, bubbles: true })
        );

        return data;
    }

    function paste(view: EditorView, data: DataTransfer): void {
        view.dom.dispatchEvent(
            new ClipboardEvent('paste', {
                clipboardData: data,
                bubbles: true,
                cancelable: true,
            })
        );
    }

    function htmlData(html: string): DataTransfer {
        const data = new DataTransfer();
        data.setData('text/html', html);

        return data;
    }

    it('inserts text copied from one cell at the caret in another cell', () => {
        const d = doc(table(row(cell(p('<a>alpha<b>')), cell(p('<c>beta')))));
        const view = mount(d, textSelection(d, d.tag.a, d.tag.b));
        const copied = copy(view);

        view.dispatch(view.state.tr.setSelection(textSelection(d, d.tag.c)));
        paste(view, copied);

        expect(view.state.doc).toEqualDoc(
            doc(table(row(cell(p('alpha')), cell(p('alphabeta')))))
        );
    });

    it('adds copied rows below the caret row instead of overwriting rows', () => {
        const d = doc(
            table(
                row(cell(p('r1c1<a>')), cell(p('r1c2'))),
                row(cell(p('r2c1')), cell(p('r2c2<b>'))),
                row(cell(p('r3c1')), cell(p('r3c2')))
            )
        );
        const view = mount(
            d,
            new CellSelection(
                cellAround(d.resolve(d.tag.a))!,
                cellAround(d.resolve(d.tag.b))!
            )
        );
        const copied = copy(view);

        view.dispatch(view.state.tr.setSelection(textSelection(d, d.tag.a)));
        paste(view, copied);

        expect(view.state.doc).toEqualDoc(
            doc(
                table(
                    row(cell(p('r1c1')), cell(p('r1c2'))),
                    row(cell(p('r1c1')), cell(p('r1c2'))),
                    row(cell(p('r2c1')), cell(p('r2c2'))),
                    row(cell(p('r2c1')), cell(p('r2c2'))),
                    row(cell(p('r3c1')), cell(p('r3c2')))
                )
            )
        );
    });

    it('adds an external table with matching columns as rows below the caret row', () => {
        const d = doc(
            table(
                row(cell(p('r1c1<a>')), cell(p('r1c2'))),
                row(cell(p('r2c1')), cell(p('r2c2')))
            )
        );
        const view = mount(d, textSelection(d, d.tag.a));

        paste(view, htmlData('<table><tr><td>x1</td><td>y1</td></tr></table>'));

        expect(view.state.doc).toEqualDoc(
            doc(
                table(
                    row(cell(p('r1c1')), cell(p('r1c2'))),
                    row(cell(p('x1')), cell(p('y1'))),
                    row(cell(p('r2c1')), cell(p('r2c2')))
                )
            )
        );
    });

    it('keeps a pasted table out of the cell when the selection reaches past the table', () => {
        const d = doc(
            table(row(cell(p('r1<a>c1')), cell(p('r1c2')))),
            p('after the <b>table')
        );
        const view = mount(d, textSelection(d, d.tag.b, d.tag.a));

        paste(view, htmlData('<table><tr><td>x</td></tr></table>'));

        expect(view.state.doc).toEqualDoc(
            doc(table(row(cell(p('r1table'))), row(cell(p('x')))))
        );
    });
});
