import { DOMParser, Node, Slice } from 'prosemirror-model';
import { NodeSelection, Selection, TextSelection } from 'prosemirror-state';
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
const image = b.image;

// Like prosemirror-view's clipboard parsing, external HTML stays open only
// down to the first isolating node, so a table arrives as a complete node.
function htmlToSlice(html: string): Slice {
    const container = document.createElement('div');
    container.innerHTML = html;
    const parsed = DOMParser.fromSchema(harness.schema).parseSlice(container);

    return new Slice(
        parsed.content,
        openDepth(parsed.content.firstChild, parsed.openStart, 'firstChild'),
        openDepth(parsed.content.lastChild, parsed.openEnd, 'lastChild')
    );
}

function openDepth(
    node: Node | null,
    max: number,
    side: 'firstChild' | 'lastChild'
): number {
    let depth = 0;
    for (
        let n = node;
        depth < max && n && !n.type.spec.isolating;
        n = n[side]
    ) {
        depth++;
    }

    return depth;
}

function copiedCells(source: Node, fromTag: number, toTag: number): Slice {
    const $anchor = cellAround(source.resolve(fromTag))!;
    const $head = cellAround(source.resolve(toTag))!;

    return new CellSelection($anchor, $head).content();
}

function copiedText(source: Node, fromTag: number, toTag: number): Slice {
    return TextSelection.create(source, fromTag, toTag).content();
}

function viewWith(d: Node, selection: Selection): FakeViewHolder {
    return createFakeView(createEditorTestState(harness, d, selection));
}

function viewAt(d: Node, from: number, to?: number): FakeViewHolder {
    return viewWith(d, textSelection(d, from, to));
}

function paste(holder: FakeViewHolder, slice: Slice): boolean {
    return createTablePastePlugin().props.handlePaste!(
        holder.view,
        new Event('paste') as ClipboardEvent,
        slice
    ) as boolean;
}

const oneColumnTable = '<table><tr><td>pasted</td></tr></table>';
const twoColumnTable = '<table><tr><td>x1</td><td>y1</td></tr></table>';

describe('table-paste-plugin', () => {
    it('adds an external table with matching columns as rows below the caret row', () => {
        const d = doc(
            table(
                row(cell(p('r1c1<a>')), cell(p('r1c2'))),
                row(cell(p('r2c1')), cell(p('r2c2')))
            )
        );
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, htmlToSlice(twoColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(
                    row(cell(p('r1c1')), cell(p('r1c2'))),
                    row(cell(p('x1')), cell(p('y1'))),
                    row(cell(p('r2c1')), cell(p('r2c2')))
                )
            )
        );
    });

    it('adds an external table with a different column count as a new table below the enclosing table', () => {
        const d = doc(
            table(row(cell(p('r1c1<a>')), cell(p('r1c2')))),
            p('paragraph one'),
            p('paragraph two')
        );
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, htmlToSlice(oneColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(row(cell(p('r1c1')), cell(p('r1c2')))),
                table(row(cell(p('pasted')))),
                p('paragraph one'),
                p('paragraph two')
            )
        );
    });

    it('squares off a ragged pasted table with empty cells', () => {
        const d = doc(
            table(
                row(cell(p('r1c1<a>')), cell(p('r1c2'))),
                row(cell(p('r2c1')), cell(p('r2c2')))
            )
        );
        const holder = viewAt(d, d.tag.a);

        const handled = paste(
            holder,
            htmlToSlice(
                '<table><tr><td>x1</td><td>y1</td></tr><tr><td>x2</td></tr></table>'
            )
        );

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(
                    row(cell(p('r1c1')), cell(p('r1c2'))),
                    row(cell(p('x1')), cell(p('y1'))),
                    row(cell(p('x2')), cell(p())),
                    row(cell(p('r2c1')), cell(p('r2c2')))
                )
            )
        );
    });

    it('places the caret at the end of the pasted rows', () => {
        const d = doc(table(row(cell(p('r1c1<a>')))));
        const holder = viewAt(d, d.tag.a);

        paste(holder, htmlToSlice(oneColumnTable));

        const { doc: result, selection } = holder.current();
        expect(selection.empty).toBe(true);
        expect(result.textBetween(0, selection.from)).toBe('r1c1pasted');
    });

    it('places the caret at the end of a table added below the enclosing table', () => {
        const d = doc(
            table(row(cell(p('r1c1<a>')), cell(p('r1c2')))),
            p('after')
        );
        const holder = viewAt(d, d.tag.a);

        paste(holder, htmlToSlice(oneColumnTable));

        const { doc: result, selection } = holder.current();
        expect(selection.empty).toBe(true);
        expect(result.textBetween(0, selection.from)).toBe('r1c1r1c2pasted');
    });

    it('replaces a selected node inside a cell before adding the rows', () => {
        const d = doc(
            table(
                row(
                    cell(p('<a>', image({ src: 'x.png' }), 'text')),
                    cell(p('r1c2'))
                )
            )
        );
        const holder = viewWith(d, NodeSelection.create(d, d.tag.a));

        const handled = paste(holder, htmlToSlice(twoColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(
                    row(cell(p('text')), cell(p('r1c2'))),
                    row(cell(p('x1')), cell(p('y1')))
                )
            )
        );
    });

    it('adds copied cells as rows below the caret row', () => {
        const d = doc(
            table(
                row(cell(p('r1c1<a>')), cell(p('r1c2'))),
                row(cell(p('r2c1')), cell(p('r2c2<b>'))),
                row(cell(p('r3c1')), cell(p('r3c2')))
            )
        );
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, copiedCells(d, d.tag.a, d.tag.b));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
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

    it('adds copied cells that are narrower than the table as a new table below it', () => {
        const source = doc(
            table(
                row(cell(p('x1<a>')), cell(p('y1'))),
                row(cell(p('x2<b>')), cell(p('y2')))
            )
        );
        const d = doc(table(row(cell(p('a1<a>')), cell(p('b1')))));
        const holder = viewAt(d, d.tag.a);

        const handled = paste(
            holder,
            copiedCells(source, source.tag.a, source.tag.b)
        );

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(row(cell(p('a1')), cell(p('b1')))),
                table(row(cell(p('x1'))), row(cell(p('x2'))))
            )
        );
    });

    it('leaves text copied from inside a cell to the default paste', () => {
        const d = doc(table(row(cell(p('<a>alpha<b>')), cell(p('<c>beta')))));
        const slice = copiedText(d, d.tag.a, d.tag.b);
        expect(slice.openStart).toBe(4);
        expect(slice.content.firstChild!.type.spec.tableRole).toBe('table');
        const holder = viewAt(d, d.tag.c);

        const handled = paste(holder, slice);

        expect(handled).toBe(false);
        expect(holder.current().doc).toEqualDoc(d);
    });

    it('leaves a slice without a table to the default paste', () => {
        const d = doc(table(row(cell(p('cell text<a>')))));
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, htmlToSlice('<p>just a paragraph</p>'));

        expect(handled).toBe(false);
        expect(holder.current().doc).toEqualDoc(d);
    });

    it('replaces a selected range inside a cell before adding the rows', () => {
        const d = doc(table(row(cell(p('alpha <a>bravo<b>')))));
        const holder = viewAt(d, d.tag.a, d.tag.b);

        const handled = paste(holder, htmlToSlice(oneColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(table(row(cell(p('alpha '))), row(cell(p('pasted')))))
        );
    });

    it('adds a new table below when a cell spans the row boundary under the caret', () => {
        const d = doc(
            table(
                row(cell({ rowspan: 2 }, p('spans')), cell(p('r1c2<a>'))),
                row(cell(p('r2c2'))),
                row(cell(p('r3c1')), cell(p('r3c2')))
            )
        );
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, htmlToSlice(twoColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(
                    row(cell({ rowspan: 2 }, p('spans')), cell(p('r1c2'))),
                    row(cell(p('r2c2'))),
                    row(cell(p('r3c1')), cell(p('r3c2')))
                ),
                table(row(cell(p('x1')), cell(p('y1'))))
            )
        );
    });

    it('adds rows below the caret row when no cell spans that boundary', () => {
        const d = doc(
            table(
                row(cell({ rowspan: 2 }, p('spans')), cell(p('r1c2'))),
                row(cell(p('r2c2<a>'))),
                row(cell(p('r3c1')), cell(p('r3c2')))
            )
        );
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, htmlToSlice(twoColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                table(
                    row(cell({ rowspan: 2 }, p('spans')), cell(p('r1c2'))),
                    row(cell(p('r2c2'))),
                    row(cell(p('x1')), cell(p('y1'))),
                    row(cell(p('r3c1')), cell(p('r3c2')))
                )
            )
        );
    });

    it('replaces a selection reaching from a paragraph into the table as Backspace would, then pastes at the paragraph', () => {
        const d = doc(
            p('before<a> the table'),
            table(
                row(cell(p('r1c1<b>')), cell(p('r1c2'))),
                row(cell(p('r2c1')), cell(p('r2c2')))
            ),
            p('after')
        );
        const holder = viewAt(d, d.tag.a, d.tag.b);

        const handled = paste(holder, htmlToSlice(oneColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(
                p('before'),
                table(row(cell(p('pasted')))),
                table(
                    row(cell(p()), cell(p('r1c2'))),
                    row(cell(p('r2c1')), cell(p('r2c2')))
                ),
                p('after')
            )
        );
    });

    it('replaces a selection reaching from a cell into the paragraph after as Backspace would, then adds the rows', () => {
        const d = doc(
            table(row(cell(p('r1c1<a>')), cell(p('r1c2')))),
            p('af<b>ter')
        );
        const holder = viewWith(d, textSelection(d, d.tag.b, d.tag.a));

        const handled = paste(holder, htmlToSlice(oneColumnTable));

        expect(handled).toBe(true);
        expect(holder.current().doc).toEqualDoc(
            doc(table(row(cell(p('r1c1ter'))), row(cell(p('pasted')))))
        );
    });

    it('moves a paste that mixes a table with trailing blocks below the enclosing table', () => {
        const d = doc(table(row(cell(p('cell text<a>')))));
        const holder = viewAt(d, d.tag.a);

        const handled = paste(
            holder,
            htmlToSlice(`${oneColumnTable}<p>after</p>`)
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

    it('moves a paste that mixes leading blocks with a table below the enclosing table', () => {
        const d = doc(table(row(cell(p('cell text<a>')))));
        const holder = viewAt(d, d.tag.a);

        const handled = paste(
            holder,
            htmlToSlice(`<p>before</p>${oneColumnTable}`)
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

    it('returns false for a CellSelection so the tableEditing cell-grid replace runs', () => {
        const d = doc(
            table(
                row(cell(p('a1<a>')), cell(p('b1'))),
                row(cell(p('a2')), cell(p('b2<b>')))
            )
        );
        const holder = viewWith(
            d,
            new CellSelection(
                cellAround(d.resolve(d.tag.a))!,
                cellAround(d.resolve(d.tag.b))!
            )
        );

        const handled = paste(holder, htmlToSlice(oneColumnTable));

        expect(handled).toBe(false);
        expect(holder.current().doc).toEqualDoc(d);
    });

    it('returns false outside any table so the default paste runs', () => {
        const d = doc(p('plain <a>paragraph'));
        const holder = viewAt(d, d.tag.a);

        const handled = paste(holder, htmlToSlice(oneColumnTable));

        expect(handled).toBe(false);
        expect(holder.current().doc).toEqualDoc(d);
    });
});
