import { DOMParser, Node, Slice } from 'prosemirror-model';
import { CellSelection, cellAround } from 'prosemirror-tables';
import {
    createEditorTestHarness,
    createEditorTestState,
    createFakeView,
    FakeViewHolder,
    textSelection,
} from '../test/editor-test-harness';
import '../test/editor-doc-matcher';
import { createTablePastePlugin } from './table-paste-plugin';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;
const table = b.table;
const row = b.table_row;
const cell = b.table_cell;

function htmlToSlice(html: string): Slice {
    const container = document.createElement('div');
    container.innerHTML = html;

    return DOMParser.fromSchema(harness.schema).parseSlice(container);
}

function fakeViewAt(d: Node, from: number, to?: number): FakeViewHolder {
    return createFakeView(
        createEditorTestState(harness, d, textSelection(d, from, to))
    );
}

function paste(holder: FakeViewHolder, slice: Slice): boolean {
    return createTablePastePlugin().props.handlePaste!(
        holder.view,
        new Event('paste') as ClipboardEvent,
        slice
    ) as boolean;
}

describe('table-paste-plugin', () => {
    describe('caret inside a cell with TextSelection', () => {
        it('inserts a pasted table as a new sibling after the enclosing table', () => {
            const d = doc(table(row(cell(p('existing<a> text')))));
            const holder = fakeViewAt(d, d.tag.a);

            const handled = paste(
                holder,
                htmlToSlice('<table><tr><td>pasted row</td></tr></table>')
            );

            expect(handled).toBe(true);
            expect(holder.current().doc).toEqualDoc(
                doc(
                    table(row(cell(p('existing text')))),
                    table(row(cell(p('pasted row'))))
                )
            );
        });

        it('preserves paragraphs and trailing content sibling to the enclosing table', () => {
            const d = doc(
                table(row(cell(p('cell content<a>')))),
                p('paragraph one'),
                p('paragraph two')
            );
            const holder = fakeViewAt(d, d.tag.a);

            paste(
                holder,
                htmlToSlice('<table><tr><td>new row</td></tr></table>')
            );

            expect(holder.current().doc).toEqualDoc(
                doc(
                    table(row(cell(p('cell content')))),
                    table(row(cell(p('new row')))),
                    p('paragraph one'),
                    p('paragraph two')
                )
            );
        });

        it('relocates trailing content along with the pasted table', () => {
            const d = doc(table(row(cell(p('cell text<a>')))));
            const holder = fakeViewAt(d, d.tag.a);

            const handled = paste(
                holder,
                htmlToSlice(
                    '<table><tr><td>pasted</td></tr></table><p>after</p>'
                )
            );

            expect(handled).toBe(true);
            expect(holder.current().doc).toEqualDoc(
                doc(
                    table(row(cell(p('cell text')))),
                    table(row(cell(p('pasted')))),
                    p('after')
                )
            );
        });

        it('relocates leading content along with the pasted table', () => {
            const d = doc(table(row(cell(p('cell text<a>')))));
            const holder = fakeViewAt(d, d.tag.a);

            const handled = paste(
                holder,
                htmlToSlice(
                    '<p>before</p><table><tr><td>pasted</td></tr></table>'
                )
            );

            expect(handled).toBe(true);
            expect(holder.current().doc).toEqualDoc(
                doc(
                    table(row(cell(p('cell text')))),
                    p('before'),
                    table(row(cell(p('pasted'))))
                )
            );
        });

        it('returns false and leaves the document untouched when the pasted slice contains no table', () => {
            const d = doc(table(row(cell(p('cell text<a>')))));
            const holder = fakeViewAt(d, d.tag.a);

            const handled = paste(
                holder,
                htmlToSlice('<p>just a paragraph</p>')
            );

            expect(handled).toBe(false);
            expect(holder.current().doc).toEqualDoc(d);
        });
    });

    it('replaces a range selection and inserts the pasted table after the enclosing table', () => {
        const d = doc(table(row(cell(p('alpha <a>bravo<b>')))));
        const holder = fakeViewAt(d, d.tag.a, d.tag.b);

        const handled = paste(
            holder,
            htmlToSlice('<table><tr><td>pasted row</td></tr></table>')
        );

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(row(cell(p('alpha ')))),
                table(row(cell(p('pasted row'))))
            )
        );
    });

    it('returns false for a CellSelection so the default tableEditing cell-grid replace runs', () => {
        const d = doc(
            table(
                row(cell(p('a1<a>')), cell(p('b1'))),
                row(cell(p('a2')), cell(p('b2<b>')))
            )
        );
        const $a1Cell = cellAround(d.resolve(d.tag.a));
        const $b2Cell = cellAround(d.resolve(d.tag.b));
        if (!$a1Cell || !$b2Cell) {
            throw new Error('failed to resolve cell anchors for test');
        }

        const holder = createFakeView(
            createEditorTestState(
                harness,
                d,
                new CellSelection($a1Cell, $b2Cell)
            )
        );

        const handled = paste(
            holder,
            htmlToSlice('<table><tr><td>x</td></tr></table>')
        );

        expect(handled).toBe(false);
        expect(holder.current().doc).toEqualDoc(d);
    });

    it('returns false outside any table so default ProseMirror paste behavior runs', () => {
        const d = doc(p('plain <a>paragraph'));
        const holder = fakeViewAt(d, d.tag.a);

        const handled = paste(
            holder,
            htmlToSlice('<table><tr><td>x</td></tr></table>')
        );

        expect(handled).toBe(false);
        expect(holder.current().doc).toEqualDoc(d);
    });
});
