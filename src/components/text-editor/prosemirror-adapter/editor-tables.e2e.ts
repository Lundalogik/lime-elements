import { EditorView } from 'prosemirror-view';
import { CellSelection } from 'prosemirror-tables';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    pressKey,
    textSelection,
} from './editor-test-harness';
import './editor-doc-matcher';

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
