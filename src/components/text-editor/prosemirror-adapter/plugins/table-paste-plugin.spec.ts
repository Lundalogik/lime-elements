import { Schema, DOMParser, Slice, Node } from 'prosemirror-model';
import {
    EditorState,
    TextSelection,
    Transaction,
} from 'prosemirror-state';
import { CellSelection, cellAround, tableNodes } from 'prosemirror-tables';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { createTablePastePlugin } from './table-paste-plugin';

function buildSchema(): Schema {
    let nodes = basicSchema.spec.nodes;
    nodes = addListNodes(nodes, 'paragraph block*', 'block');
    nodes = nodes.append(
        tableNodes({
            tableGroup: 'block',
            cellContent: 'block+',
            cellAttributes: {},
        })
    );

    return new Schema({ nodes: nodes, marks: basicSchema.spec.marks });
}

function htmlToDoc(html: string, schema: Schema): Node {
    const div = document.createElement('div');
    div.innerHTML = html;

    return DOMParser.fromSchema(schema).parse(div);
}

function htmlToSlice(html: string, schema: Schema): Slice {
    const div = document.createElement('div');
    div.innerHTML = html;

    return DOMParser.fromSchema(schema).parseSlice(div);
}

function findTextOffset(doc: Node, needle: string): number {
    let result = -1;
    doc.descendants((node, pos) => {
        if (result !== -1) {
            return false;
        }

        if (node.isText && node.text?.includes(needle)) {
            const offsetInText = node.text.indexOf(needle);
            result = pos + offsetInText;

            return false;
        }
    });

    return result;
}

function countNodesOfType(doc: Node, typeName: string): number {
    let count = 0;
    doc.descendants((node) => {
        if (node.type.name === typeName) {
            count++;
        }
    });

    return count;
}

function extractAllText(doc: Node): string {
    return doc.textBetween(0, doc.content.size, '\n', '\n');
}

function createMockView(state: EditorState): {
    state: EditorState;
    dispatch: (tr: Transaction) => void;
} {
    const view = {
        state: state,
        dispatch(this: { state: EditorState }, tr: Transaction) {
            this.state = this.state.apply(tr);
        },
    };

    return view;
}

describe('table-paste-plugin', () => {
    let schema: Schema;

    beforeEach(() => {
        schema = buildSchema();
    });

    describe('caret inside a cell with TextSelection', () => {
        it('inserts a pasted table as a new sibling after the enclosing table', () => {
            const doc = htmlToDoc(
                '<table><tr><td><p>existing text</p></td></tr></table>',
                schema
            );
            const textPos = findTextOffset(doc, 'existing');
            const state = EditorState.create({
                doc: doc,
                selection: TextSelection.create(doc, textPos + 4),
            });
            const view = createMockView(state);

            const slice = htmlToSlice(
                '<table><tr><td>pasted row</td></tr></table>',
                schema
            );

            const plugin = createTablePastePlugin();
            const handled = plugin.props.handlePaste!(
                view as any,
                new Event('paste') as ClipboardEvent,
                slice
            );

            expect(handled).toBe(true);
            expect(countNodesOfType(view.state.doc, 'table')).toBe(2);
            expect(extractAllText(view.state.doc)).toContain('existing text');
            expect(extractAllText(view.state.doc)).toContain('pasted row');
        });

        it('preserves paragraphs and trailing content sibling to the enclosing table', () => {
            const doc = htmlToDoc(
                [
                    '<table><tr><td><p>cell content</p></td></tr></table>',
                    '<p>paragraph one</p>',
                    '<p>paragraph two</p>',
                ].join(''),
                schema
            );
            const textPos = findTextOffset(doc, 'cell content');
            const state = EditorState.create({
                doc: doc,
                selection: TextSelection.create(doc, textPos),
            });
            const view = createMockView(state);

            const slice = htmlToSlice(
                '<table><tr><td>new row</td></tr></table>',
                schema
            );

            const plugin = createTablePastePlugin();
            plugin.props.handlePaste!(
                view as any,
                new Event('paste') as ClipboardEvent,
                slice
            );

            const topLevelTypes: string[] = [];
            view.state.doc.forEach((child) => {
                topLevelTypes.push(child.type.name);
            });
            expect(topLevelTypes).toEqual([
                'table',
                'table',
                'paragraph',
                'paragraph',
            ]);

            const firstTable = view.state.doc.firstChild!;
            const secondTable = view.state.doc.child(1);
            expect(firstTable.textContent).toBe('cell content');
            expect(secondTable.textContent).toBe('new row');
            expect(view.state.doc.child(2).textContent).toBe('paragraph one');
            expect(view.state.doc.child(3).textContent).toBe('paragraph two');
        });

        it('inserts a paragraph after the table when the table is the last block', () => {
            const doc = htmlToDoc(
                '<table><tr><td><p>only cell</p></td></tr></table>',
                schema
            );
            const textPos = findTextOffset(doc, 'only cell');
            const state = EditorState.create({
                doc: doc,
                selection: TextSelection.create(doc, textPos),
            });
            const view = createMockView(state);

            const slice = htmlToSlice(
                '<table><tr><td>pasted</td></tr></table>',
                schema
            );

            const plugin = createTablePastePlugin();
            const handled = plugin.props.handlePaste!(
                view as any,
                new Event('paste') as ClipboardEvent,
                slice
            );

            expect(handled).toBe(true);
            expect(extractAllText(view.state.doc)).toContain('only cell');
            expect(extractAllText(view.state.doc)).toContain('pasted');
        });

        it('returns false when the pasted slice contains no table content', () => {
            const doc = htmlToDoc(
                '<table><tr><td><p>cell text</p></td></tr></table>',
                schema
            );
            const textPos = findTextOffset(doc, 'cell text');
            const state = EditorState.create({
                doc: doc,
                selection: TextSelection.create(doc, textPos),
            });
            const view = createMockView(state);

            const slice = htmlToSlice('<p>just a paragraph</p>', schema);

            const plugin = createTablePastePlugin();
            const handled = plugin.props.handlePaste!(
                view as any,
                new Event('paste') as ClipboardEvent,
                slice
            );

            expect(handled).toBe(false);
        });
    });

    describe('selection is a CellSelection', () => {
        it('returns false so the default tableEditing cell-grid replace runs', () => {
            const doc = htmlToDoc(
                [
                    '<table>',
                    '<tr><td><p>a1</p></td><td><p>b1</p></td></tr>',
                    '<tr><td><p>a2</p></td><td><p>b2</p></td></tr>',
                    '</table>',
                ].join(''),
                schema
            );
            const a1Pos = findTextOffset(doc, 'a1');
            const b2Pos = findTextOffset(doc, 'b2');

            const $a1Cell = cellAround(doc.resolve(a1Pos));
            const $b2Cell = cellAround(doc.resolve(b2Pos));
            if (!$a1Cell || !$b2Cell) {
                throw new Error('failed to resolve cell anchors for test');
            }

            const state = EditorState.create({
                doc: doc,
                selection: new CellSelection($a1Cell, $b2Cell),
            });
            const view = createMockView(state);

            const slice = htmlToSlice(
                '<table><tr><td>x</td></tr></table>',
                schema
            );

            const plugin = createTablePastePlugin();
            const handled = plugin.props.handlePaste!(
                view as any,
                new Event('paste') as ClipboardEvent,
                slice
            );

            expect(handled).toBe(false);
        });
    });

    describe('selection is outside any table', () => {
        it('returns false so default ProseMirror paste behavior runs', () => {
            const doc = htmlToDoc('<p>plain paragraph</p>', schema);
            const textPos = findTextOffset(doc, 'plain');
            const state = EditorState.create({
                doc: doc,
                selection: TextSelection.create(doc, textPos),
            });
            const view = createMockView(state);

            const slice = htmlToSlice(
                '<table><tr><td>x</td></tr></table>',
                schema
            );

            const plugin = createTablePastePlugin();
            const handled = plugin.props.handlePaste!(
                view as any,
                new Event('paste') as ClipboardEvent,
                slice
            );

            expect(handled).toBe(false);
        });
    });
});
