import { Schema } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { isInListItem, createListKeyHandlerPlugin } from './list-key-handler';
import { createCustomTestSchema } from '../../test-setup/schema-builder';
import {
    createEditorView,
    cleanupEditorView,
} from '../../test-setup/editor-view-builder';

describe('List Key Handler Plugin', () => {
    let schema: Schema;
    let state: EditorState;
    let view: EditorView;
    let container: HTMLElement;
    let dispatch: jest.Mock;

    beforeEach(() => {
        schema = createCustomTestSchema({});
        dispatch = jest.fn((tr) => {
            state = state.apply(tr);
            view.updateState(state);
        });
    });

    afterEach(() => {
        if (view) {
            cleanupEditorView(view, container);
            view = null;
            container = null;
        }
    });

    const setupListWithItems = (items: string[]) => {
        // Create document with a list containing the specified items
        const listItems = items.map((text) => {
            return schema.nodes.list_item.create(
                null,
                schema.nodes.paragraph.create(null, schema.text(text)),
            );
        });

        const bulletList = schema.nodes.bullet_list.create(null, listItems);
        const doc = schema.nodes.doc.create(null, [bulletList]);

        state = EditorState.create({
            schema: schema,
            doc: doc,
            plugins: [createListKeyHandlerPlugin(schema)],
        });

        const result = createEditorView(state, dispatch);
        view = result.view;
        container = result.container;

        return { view: view, state: state };
    };

    describe('isInListItem', () => {
        it('should return true when cursor is in a list item', () => {
            setupListWithItems(['First item', 'Second item']);

            // Position cursor in first list item
            const pos = state.doc.resolve(6);
            const tr = state.tr.setSelection(
                TextSelection.create(state.doc, pos.pos),
            );
            state = state.apply(tr);
            view.updateState(state);

            expect(isInListItem(state)).toBe(true);
        });

        it('should return false when cursor is not in a list item', () => {
            // Create a document with plain paragraphs
            const doc = schema.nodes.doc.create(null, [
                schema.nodes.paragraph.create(
                    null,
                    schema.text('Plain paragraph'),
                ),
            ]);

            state = EditorState.create({
                schema: schema,
                doc: doc,
                plugins: [createListKeyHandlerPlugin(schema)],
            });

            const result = createEditorView(state, dispatch);
            view = result.view;
            container = result.container;

            expect(isInListItem(state)).toBe(false);
        });
    });

    describe('Tab behavior', () => {
        it('should indent a list item when Tab is pressed', () => {
            setupListWithItems(['First item', 'Second item', 'Third item']);

            // Position cursor in second list item
            const pos = state.doc.resolve(22); // Approximate position in second item
            const tr = state.tr.setSelection(
                TextSelection.create(state.doc, pos.pos),
            );
            state = state.apply(tr);
            view.updateState(state);

            // Create a mock Tab event
            const tabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
            });

            // Simulate Tab press and check if it was handled
            const result = view.dispatchEvent(tabEvent);
            const eventWasHandled = !result;

            // Check if the event was handled
            expect(eventWasHandled).toBe(true);
            expect(dispatch).toHaveBeenCalled();

            // Check the structure: first item should contain a nested list with the second item
            const firstItem = state.doc.firstChild.child(0);
            expect(firstItem.childCount).toBeGreaterThan(1);

            // Verify the nested structure
            const nestedList = firstItem.child(1);
            expect(nestedList.type.name).toBe('bullet_list');
            expect(nestedList.childCount).toBe(1);

            const nestedItem = nestedList.child(0);
            expect(nestedItem.type.name).toBe('list_item');
            expect(nestedItem.textContent).toBe('Second item');
        });

        it('should outdent a nested list item when Shift+Tab is pressed', () => {
            // Create a list with a nested item
            const innerListItem = schema.nodes.list_item.create(
                null,
                schema.nodes.paragraph.create(null, schema.text('Nested item')),
            );

            const innerList = schema.nodes.bullet_list.create(null, [
                innerListItem,
            ]);

            const outerListItem1 = schema.nodes.list_item.create(null, [
                schema.nodes.paragraph.create(null, schema.text('First item')),
                innerList,
            ]);

            const outerListItem2 = schema.nodes.list_item.create(
                null,
                schema.nodes.paragraph.create(null, schema.text('Last item')),
            );

            const bulletList = schema.nodes.bullet_list.create(null, [
                outerListItem1,
                outerListItem2,
            ]);
            const doc = schema.nodes.doc.create(null, [bulletList]);

            state = EditorState.create({
                schema: schema,
                doc: doc,
                plugins: [createListKeyHandlerPlugin(schema)],
            });

            const result = createEditorView(state, dispatch);
            view = result.view;
            container = result.container;

            // Find position of the nested item and set cursor there
            let nestedItemPos = null;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text === 'Nested item') {
                    nestedItemPos = pos;

                    return false;
                }

                return true;
            });

            const tr = state.tr.setSelection(
                TextSelection.create(state.doc, nestedItemPos + 2),
            );
            state = state.apply(tr);
            view.updateState(state);

            // Create a mock Shift+Tab event
            const shiftTabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                shiftKey: true,
                bubbles: true,
            });

            // Simulate Shift+Tab press and check if it was handled
            const result2 = view.dispatchEvent(shiftTabEvent);
            const eventWasHandled = !result2;

            // Check if the event was handled
            expect(eventWasHandled).toBe(true);
            expect(dispatch).toHaveBeenCalled();

            // Verify that the list structure changed (should now have 3 top-level items)
            expect(state.doc.firstChild.childCount).toBe(3);
        });
    });
});
