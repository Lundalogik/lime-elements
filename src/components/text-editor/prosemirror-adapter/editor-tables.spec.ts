import { DOMSerializer, Node } from 'prosemirror-model';
import { tableEditingKey } from 'prosemirror-tables';
import {
    createEditorTestHarness,
    createEditorTestState,
    parseHTML,
    textSelection,
} from './test/editor-test-harness';
import { getTableEditingPlugins } from './plugins/table-plugin';
import { editorMenuTypesArray } from './menu/types';

const harness = createEditorTestHarness();
const markdown = createEditorTestHarness({ contentType: 'markdown' });
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;
const table = b.table;
const row = b.table_row;
const cell = b.table_cell;

describe('table plugin wiring', () => {
    it('provides exactly one editing plugin when enabled and none when disabled', () => {
        expect(getTableEditingPlugins(true)).toHaveLength(1);
        expect(getTableEditingPlugins(false)).toEqual([]);
    });

    it('places the table editing plugin last in the html-mode stack', () => {
        const last = harness.plugins.at(-1);
        expect(last.spec.key).toBe(tableEditingKey);
    });

    it('has no table editing plugin in markdown mode', () => {
        expect(
            markdown.plugins.some(
                (plugin) => plugin.spec.key === tableEditingKey
            )
        ).toBe(false);
    });

    it('offers no table command in the menu types', () => {
        expect(
            editorMenuTypesArray.some((type) => type.includes('table'))
        ).toBe(false);
    });
});

describe('table node parsing and serialization', () => {
    it('reads cell background and color from inline style', () => {
        const parsed = parseHTML(
            harness.schema,
            '<table><tr><td style="background-color: red; color: blue">x</td></tr></table>'
        );

        let cellNode: Node;
        parsed.descendants((node) => {
            if (node.type.name === 'table_cell') {
                cellNode = node;
            }
        });

        expect(cellNode.attrs.background).toBe('red');
        expect(cellNode.attrs.color).toBe('blue');
    });

    it('writes cell background and color back into the style attribute', () => {
        const built = doc(
            table(row(cell({ background: 'red', color: 'blue' }, p('x'))))
        );
        const container = document.createElement('div');
        container.append(
            DOMSerializer.fromSchema(harness.schema).serializeFragment(
                built.content
            )
        );
        const td = container.querySelector('td');

        expect(td.getAttribute('style')).toContain('background-color: red');
        expect(td.getAttribute('style')).toContain('color: blue');
    });

    it('adds no style declarations for null cell attributes', () => {
        const built = doc(table(row(cell(p('x')))));
        const container = document.createElement('div');
        container.append(
            DOMSerializer.fromSchema(harness.schema).serializeFragment(
                built.content
            )
        );
        const td = container.querySelector('td');

        expect(td.getAttribute('style') ?? '').not.toContain(
            'background-color'
        );
    });

    it('round-trips a two-cell table through the builders', () => {
        const built = doc(table(row(cell(p('a')), cell(p('b')))));

        expect(() => built.check()).not.toThrow();
    });

    it('flattens a pasted table to text in markdown mode', () => {
        const parsed = parseHTML(
            markdown.schema,
            '<table><tr><td>x</td></tr></table>'
        );

        let foundTable = false;
        parsed.descendants((node) => {
            if (node.type.name === 'table') {
                foundTable = true;
            }
        });

        expect(foundTable).toBe(false);
        expect(parsed.textContent).toBe('x');
    });
});

describe('table repair', () => {
    it('repairs a structurally broken table on the next transaction', () => {
        const broken = doc(
            table(row(cell({ colspan: 2 }, p('wide'))), row(cell(p('narrow'))))
        );
        const state = createEditorTestState(
            harness,
            broken,
            textSelection(broken, 5)
        );

        const next = state.apply(state.tr.insertText('!'));

        const widths: number[] = [];
        next.doc.descendants((node) => {
            if (node.type.name === 'table_row') {
                let width = 0;
                for (let i = 0; i < node.childCount; i++) {
                    width += node.child(i).attrs.colspan;
                }
                widths.push(width);
            }
        });

        expect(widths).toHaveLength(2);
        expect(widths[0]).toBe(widths[1]);
        expect(() => next.doc.check()).not.toThrow();
    });
});
