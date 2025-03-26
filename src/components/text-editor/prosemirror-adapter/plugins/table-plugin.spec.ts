import { Schema, NodeType } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { createCustomTestSchema } from '../../test-setup/schema-builder';
import { createEditorState } from '../../test-setup/editor-state-builder';
import {
    createEditorView,
    createDispatchSpy,
    cleanupEditorView,
} from '../../test-setup/editor-view-builder';
import {
    getTableEditingPlugins,
    getTableNodes,
    createStyleAttribute,
} from './table-plugin';

describe('Table Plugin', () => {
    let view;
    let container;

    afterEach(() => {
        if (view) {
            cleanupEditorView(view, container);
            view = null;
            container = null;
        }
    });

    describe('getTableEditingPlugins', () => {
        it('should return an array with table editing plugin when tables are enabled', () => {
            const plugins = getTableEditingPlugins(true);

            expect(plugins).toBeInstanceOf(Array);
            expect(plugins.length).toBe(1);
            expect(plugins[0]).toBeInstanceOf(Plugin);
        });

        it('should return an empty array when tables are disabled', () => {
            const plugins = getTableEditingPlugins(false);

            expect(plugins).toBeInstanceOf(Array);
            expect(plugins.length).toBe(0);
        });

        it('should create a working plugin that can be added to an editor state', () => {
            const baseSchema = createCustomTestSchema({});
            const tableNodes = getTableNodes();
            let nodes = baseSchema.spec.nodes;

            Object.entries(tableNodes).forEach(([name, spec]) => {
                nodes = nodes.addToEnd(name, spec);
            });

            const schema = new Schema({
                nodes: nodes,
                marks: baseSchema.spec.marks,
            });

            const content = '<p>Text with table support</p>';
            const plugins = getTableEditingPlugins(true);
            const state = createEditorState(content, schema, plugins);

            const dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            expect(plugins.length).toBe(1);
            expect(view.state.plugins).toContain(plugins[0]);
        });
    });

    describe('getTableNodes', () => {
        it('should return an object with table node specs', () => {
            const tableNodes = getTableNodes();

            expect(tableNodes).toBeDefined();
            expect(typeof tableNodes).toBe('object');

            expect(tableNodes.table).toBeDefined();
            expect(tableNodes.table_row).toBeDefined();
            expect(tableNodes.table_cell).toBeDefined();
            expect(tableNodes.table_header).toBeDefined();
        });

        it('should create node specs that can be added to a schema', () => {
            const baseSchema = createCustomTestSchema({});
            const tableNodes = getTableNodes();
            let nodes = baseSchema.spec.nodes;

            Object.entries(tableNodes).forEach(([name, spec]) => {
                nodes = nodes.addToEnd(name, spec);
            });

            const schema = new Schema({
                nodes: nodes,
                marks: baseSchema.spec.marks,
            });

            expect(schema.nodes.table instanceof NodeType).toBe(true);
            expect(schema.nodes.table_row instanceof NodeType).toBe(true);
            expect(schema.nodes.table_cell instanceof NodeType).toBe(true);
            expect(schema.nodes.table_header instanceof NodeType).toBe(true);
        });

        it('should include custom cell attributes for styling', () => {
            const tableNodes = getTableNodes();

            expect(tableNodes.table_cell).toBeDefined();
            expect(tableNodes.table_cell.attrs).toBeDefined();
            expect(tableNodes.table_cell.attrs.background).toBeDefined();
            expect(tableNodes.table_cell.attrs.color).toBeDefined();

            expect(tableNodes.table_cell.attrs.background.default).toBe(null);
            expect(tableNodes.table_cell.attrs.color.default).toBe(null);
        });
    });

    describe('Style attribute helper', () => {
        it('should get style values from DOM elements', () => {
            const backgroundAttr = createStyleAttribute('backgroundColor');

            const element = document.createElement('td');
            element.style.backgroundColor = 'red';

            expect(backgroundAttr.getFromDOM(element)).toBe('red');
        });

        it('should set style values on attributes object', () => {
            const backgroundAttr = createStyleAttribute('backgroundColor');
            const attrs: Record<string, any> = {};

            backgroundAttr.setDOMAttr('blue', attrs);

            expect(attrs.style).toBe('backgroundColor: blue;');
        });

        it('should append to existing style attribute when setting multiple styles', () => {
            const backgroundAttr = createStyleAttribute('backgroundColor');
            const colorAttr = createStyleAttribute('color');
            const attrs: Record<string, any> = {};

            backgroundAttr.setDOMAttr('blue', attrs);
            colorAttr.setDOMAttr('white', attrs);

            expect(attrs.style).toBe('backgroundColor: blue;color: white;');
        });

        it('should not modify the style attribute when value is falsy', () => {
            const backgroundAttr = createStyleAttribute('backgroundColor');
            const attrs: Record<string, any> = {};

            // Test with empty string
            backgroundAttr.setDOMAttr('', attrs);
            expect(attrs.style).toBeUndefined();

            // Test with null
            backgroundAttr.setDOMAttr(null, attrs);
            expect(attrs.style).toBeUndefined();

            // Test with undefined
            backgroundAttr.setDOMAttr(undefined, attrs);
            expect(attrs.style).toBeUndefined();

            // Test that existing style is preserved when falsy value is passed
            attrs.style = 'color: red;';
            backgroundAttr.setDOMAttr('', attrs);
            expect(attrs.style).toBe('color: red;');
        });
    });
});
