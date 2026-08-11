import { Schema } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
    isInListItem,
    createListKeyHandlerPlugin,
    isEmptyListItem,
    isAtStartOfListItem,
} from './list-key-handler';
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

    describe('isEmptyListItem', () => {
        it('should return true for an empty list item', () => {
            // Create a state with an empty list item
            const state = createEditorState(
                '<ul><li><p></p></li></ul>',
                schema,
            );

            // Create a selection inside the empty list item
            const pos = 3; // Position inside the empty paragraph
            const selection = TextSelection.create(state.doc, pos);
            const newState = state.apply(state.tr.setSelection(selection));

            // Verify that isEmptyListItem returns true
            expect(isEmptyListItem(newState)).toBe(true);
        });

        it('should return false for a non-empty list item', () => {
            // Create a state with a non-empty list item
            const state = createEditorState(
                '<ul><li><p>Content</p></li></ul>',
                schema,
            );

            // Create a selection inside the non-empty list item
            const pos = 5; // Position inside the text
            const selection = TextSelection.create(state.doc, pos);
            const newState = state.apply(state.tr.setSelection(selection));

            // Verify that isEmptyListItem returns false
            expect(isEmptyListItem(newState)).toBe(false);
        });
    });

    describe('isAtStartOfListItem', () => {
        it('should return true when cursor is at the start of a list item', () => {
            // Create a state with a list item
            const state = createEditorState(
                '<ul><li><p>List item</p></li></ul>',
                schema,
            );

            // Get the position at the start of the paragraph inside the list item
            const listItemStart = 3; // Position at the start of the paragraph inside list item
            const selection = TextSelection.create(state.doc, listItemStart);
            const newState = state.apply(state.tr.setSelection(selection));

            // Verify that isAtStartOfListItem returns true
            expect(isAtStartOfListItem(newState)).toBe(true);
        });

        it('should return false when cursor is not at the start of a list item', () => {
            // Create a state with a list item
            const state = createEditorState(
                '<ul><li><p>List item</p></li></ul>',
                schema,
            );

            // Create a selection inside the list item, but not at the start
            const posInText = 5; // Position inside the text, not at start
            const selection = TextSelection.create(state.doc, posInText);
            const newState = state.apply(state.tr.setSelection(selection));

            // Verify that isAtStartOfListItem returns false
            expect(isAtStartOfListItem(newState)).toBe(false);
        });

        it('should return false for non-empty selections', () => {
            // Create a state with a list item
            const state = createEditorState(
                '<ul><li><p>List item</p></li></ul>',
                schema,
            );

            // Create a non-empty selection
            const start = 3; // Start of text
            const end = 7; // A few characters in
            const selection = TextSelection.create(state.doc, start, end);
            const newState = state.apply(state.tr.setSelection(selection));

            // Verify that isAtStartOfListItem returns false for non-empty selections
            expect(isAtStartOfListItem(newState)).toBe(false);
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

    describe('Enter behavior', () => {
        let view: EditorView;
        let container: HTMLElement;
        let dispatchSpy: jest.Mock;

        afterEach(() => {
            if (view) {
                cleanupEditorView(view, container);
            }
        });

        it('should split a list item when Enter is pressed in a non-empty item', () => {
            // Create a state with a list containing a non-empty item
            const state = createEditorState(
                `<ul>
                    <li><p>List item text</p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Set cursor position in the middle of the text
            let listItemTextPos = 0;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text.includes('List item')) {
                    // Position cursor after "List "
                    listItemTextPos = pos + 5;

                    return false;
                }

                return true;
            });

            const selection = TextSelection.create(state.doc, listItemTextPos);
            view.dispatch(state.tr.setSelection(selection));
            dispatchSpy.mockClear();

            // Create and dispatch Enter key event
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
            });

            view.dom.dispatchEvent(enterEvent);

            // Verify transaction was dispatched
            expect(dispatchSpy).toHaveBeenCalled();

            // Verify list now has two items
            const list = view.state.doc.firstChild;
            expect(list.childCount).toBe(2);

            // First item should contain "List"
            expect(list.child(0).textContent).toBe('List ');

            // Second item should contain "item text"
            expect(list.child(1).textContent).toBe('item text');
        });

        it('should exit the list when Enter is pressed in an empty list item', () => {
            // Create a state with a list containing an empty item
            const state = createEditorState(
                `<ul>
                    <li><p></p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Position cursor in the empty paragraph inside list item
            const emptyParaPos = 3; // Approximate position inside empty paragraph
            const selection = TextSelection.create(state.doc, emptyParaPos);
            view.dispatch(state.tr.setSelection(selection));
            dispatchSpy.mockClear();

            // Create and dispatch Enter key event
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
            });

            view.dom.dispatchEvent(enterEvent);

            // Verify transaction was dispatched
            expect(dispatchSpy).toHaveBeenCalled();

            // Verify list has been replaced with a paragraph
            expect(view.state.doc.firstChild.type.name).toBe('paragraph');
        });
    });

    describe('Backspace behavior', () => {
        let view: EditorView;
        let container: HTMLElement;
        let dispatchSpy: jest.Mock;

        afterEach(() => {
            if (view) {
                cleanupEditorView(view, container);
            }
        });

        it('should join with previous list item when Backspace is pressed at the start', () => {
            // Create a state with a list containing multiple items
            const state = createEditorState(
                `<ul>
                    <li><p>First item</p></li>
                    <li><p>Second item</p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Find position at the start of the second list item's paragraph
            let secondItemStart = 0;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text === 'Second item') {
                    secondItemStart = pos; // Position at the start of the paragraph

                    return false;
                }

                return true;
            });

            const selection = TextSelection.create(state.doc, secondItemStart);
            view.dispatch(state.tr.setSelection(selection));
            dispatchSpy.mockClear();

            // Create and dispatch Backspace key event
            const backspaceEvent = new KeyboardEvent('keydown', {
                key: 'Backspace',
                bubbles: true,
            });

            view.dom.dispatchEvent(backspaceEvent);

            // Verify transaction was dispatched
            expect(dispatchSpy).toHaveBeenCalled();

            // Verify list now has only one item
            const list = view.state.doc.firstChild;
            expect(list.childCount).toBe(1);

            // The item should contain both texts joined
            expect(list.child(0).textContent).toBe('First itemSecond item');
        });

        it('should lift list item out when Backspace is pressed at the start of the first item', () => {
            // Create a state with a list containing a single item
            const state = createEditorState(
                `<ul>
                    <li><p>Single item</p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Find position at the start of the list item's paragraph
            const listItemStart = 3; // Approximate position at the start of the paragraph
            const selection = TextSelection.create(state.doc, listItemStart);
            view.dispatch(state.tr.setSelection(selection));
            dispatchSpy.mockClear();

            // Create and dispatch Backspace key event
            const backspaceEvent = new KeyboardEvent('keydown', {
                key: 'Backspace',
                bubbles: true,
            });

            view.dom.dispatchEvent(backspaceEvent);

            // Verify transaction was dispatched
            expect(dispatchSpy).toHaveBeenCalled();

            // Verify list has been replaced with a paragraph
            expect(view.state.doc.firstChild.type.name).toBe('paragraph');
            expect(view.state.doc.firstChild.textContent).toBe('Single item');
        });

        it('should not handle Backspace when not at the start of a list item', () => {
            // Create a state with a list containing an item
            const state = createEditorState(
                `<ul>
                    <li><p>List item</p></li>
                </ul>`,
                schema,
                [createListKeyHandlerPlugin(schema)],
            );

            // Create a view with dispatch spy
            dispatchSpy = createDispatchSpy();
            const result = createEditorView(state, dispatchSpy);
            view = result.view;
            container = result.container;

            // Position cursor inside the text, not at the start
            let middlePos = 0;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text === 'List item') {
                    middlePos = pos + 5; // Middle of the text

                    return false;
                }

                return true;
            });

            const selection = TextSelection.create(state.doc, middlePos);
            view.dispatch(state.tr.setSelection(selection));
            dispatchSpy.mockClear();

            // Create and dispatch Backspace key event
            const backspaceEvent = new KeyboardEvent('keydown', {
                key: 'Backspace',
                bubbles: true,
            });

            // We'll need to manually track if preventDefault was called
            let defaultPrevented = false;
            const originalPreventDefault = backspaceEvent.preventDefault;
            backspaceEvent.preventDefault = function () {
                defaultPrevented = true;
                if (originalPreventDefault) {
                    originalPreventDefault.call(this);
                }
            };

            view.dom.dispatchEvent(backspaceEvent);

            // Verify plugin did not prevent default (let the regular backspace behavior happen)
            expect(defaultPrevented).toBe(false);
        });
    });
});
