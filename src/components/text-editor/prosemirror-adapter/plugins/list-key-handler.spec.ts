import { Schema } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { isInListItem, createListKeyHandlerPlugin } from './list-key-handler';
import { createCustomTestSchema } from '../../test-setup/schema-builder';
import {
    createEditorView,
    cleanupEditorView,
    createDispatchSpy,
    mockProseMirrorDOMEnvironment,
} from '../../test-setup/editor-view-builder';
import { createEditorState } from '../../test-setup/editor-state-builder';

describe('List Key Handler Plugin', () => {
    let schema: Schema;
    let cleanupMock: () => void;

    beforeEach(() => {
        cleanupMock = mockProseMirrorDOMEnvironment();
        schema = createCustomTestSchema({});
    });

    afterEach(() => {
        cleanupMock();
    });

    describe('isInListItem', () => {
        it('should return true when cursor is in a list item', () => {
            // Create a state with a list item
            const state = createEditorState(
                '<ul><li><p>List item</p></li></ul>',
                schema,
            );

            // Create a selection inside the list item
            const pos = 5; // Position inside the list item text
            const selection = TextSelection.create(state.doc, pos);
            const newState = state.apply(state.tr.setSelection(selection));

            // Verify that isInListItem returns true
            expect(isInListItem(newState)).toBe(true);
        });

        it('should return false when cursor is not in a list item', () => {
            // Create a state with just a paragraph
            const state = createEditorState('<p>Not a list item</p>', schema);

            // Verify that isInListItem returns false
            expect(isInListItem(state)).toBe(false);
        });
    });

    describe('Tab behavior', () => {
        let view: EditorView;
        let container: HTMLElement;
        let dispatchSpy: jest.Mock;

        afterEach(() => {
            if (view) {
                cleanupEditorView(view, container);
            }
        });

        it('should indent a list item when Tab is pressed', () => {
            // Create a state with a list containing multiple items
            const state = createEditorState(
                `<ul>
                    <li><p>First item</p></li>
                    <li><p>Second item</p></li>
                    <li><p>Third item</p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with the dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Find position within the second list item's text
            let secondItemPos = 0;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text.includes('Second item')) {
                    secondItemPos = pos + 1; // Position inside the text

                    return false;
                }

                return true;
            });

            // Set selection to the second item
            const selection = TextSelection.create(state.doc, secondItemPos);
            view.dispatch(state.tr.setSelection(selection));

            // Reset the spy to track only the Tab event
            dispatchSpy.mockClear();

            // Create and dispatch a Tab keydown event
            const tabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
            });

            // Dispatch the event to the view's DOM node
            view.dom.dispatchEvent(tabEvent);

            // Verify that a transaction was dispatched
            expect(dispatchSpy).toHaveBeenCalled();

            // The createDispatchSpy with autoUpdate=true will automatically update the view state
            // Verify the document structure: first item should contain a nested list with second item
            const firstItem = view.state.doc.firstChild.child(0);
            expect(firstItem.childCount).toBeGreaterThan(1);

            // Verify that there's a nested list in the first item
            const nestedList = firstItem.child(1);
            expect(nestedList.type.name).toBe('bullet_list');
            expect(nestedList.childCount).toBe(1);

            // Verify the nested item is the second item
            const nestedItem = nestedList.child(0);
            expect(nestedItem.type.name).toBe('list_item');
            expect(nestedItem.textContent.includes('Second item')).toBe(true);
        });

        it('should outdent a nested list item when Shift+Tab is pressed', () => {
            // Create a state with a nested list structure
            const state = createEditorState(
                `<ul>
                    <li>
                        <p>First item</p>
                        <ul>
                            <li><p>Nested item</p></li>
                        </ul>
                    </li>
                    <li><p>Last item</p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with the dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Find position of the nested item content
            let nestedItemPos = 0;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text.includes('Nested item')) {
                    nestedItemPos = pos + 1; // Position inside the text

                    return false;
                }

                return true;
            });

            // Set selection to the nested item
            const selection = TextSelection.create(state.doc, nestedItemPos);
            view.dispatch(state.tr.setSelection(selection));

            // Reset the spy to track only the Shift+Tab event
            dispatchSpy.mockClear();

            // Create and dispatch a Shift+Tab keydown event
            const shiftTabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                shiftKey: true,
                bubbles: true,
            });

            // Dispatch the event
            view.dom.dispatchEvent(shiftTabEvent);

            // Verify that a transaction was dispatched
            expect(dispatchSpy).toHaveBeenCalled();

            // Verify the document structure: should now have 3 top-level items
            expect(view.state.doc.firstChild.childCount).toBe(3);
        });
    });
});
