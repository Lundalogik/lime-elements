import { vi, type Mock } from 'vitest';
import { Node, Schema } from 'prosemirror-model';
import { AllSelection, EditorState, TextSelection } from 'prosemirror-state';
import { createListCommand } from './menu-commands';
import { EditorMenuTypes } from './types';

describe('List Commands', () => {
    let schema: Schema;
    let state: EditorState;
    let dispatch: Mock;

    const createParagraph = (text: string) =>
        schema.nodes.paragraph.create(null, schema.text(text));

    const createParagraphs = (texts: string[]) => {
        let tr = state.tr;
        for (const [i, text] of texts.entries()) {
            const paragraph = createParagraph(text);
            if (i === 0) {
                tr = tr.replaceWith(0, state.doc.content.size, paragraph);
            } else {
                tr = tr.insert(tr.doc.content.size, paragraph);
            }
        }

        return tr;
    };

    const selectAll = () => {
        const $from = state.doc.resolve(1); // Start after doc node
        const $to = state.doc.resolve(state.doc.content.size - 1); // End before doc node

        const selTr = state.tr.setSelection(
            TextSelection.create(state.doc, $from.pos, $to.pos)
        );

        state = state.apply(selTr);
    };

    const verifyListStructure = (
        listType: string,
        expectedItems: string[],
        expectedCount: number = expectedItems.length
    ) => {
        expect(state.doc.firstChild.type.name).toBe(listType);
        expect(state.doc.firstChild.childCount).toBe(expectedCount);

        for (let i = 0; i < state.doc.firstChild.childCount; i++) {
            const item = state.doc.firstChild.child(i);
            expect(item.type.name).toBe('list_item');
            expect(item.firstChild.textContent).toBe(expectedItems[i]);
        }
    };

    beforeEach(() => {
        schema = new Schema({
            nodes: {
                doc: {
                    content: 'block+',
                    toDOM: () => ['div', 0],
                },
                paragraph: {
                    group: 'block',
                    content: 'inline*',
                    toDOM: () => ['p', 0],
                },
                bullet_list: {
                    group: 'block',
                    content: 'list_item+',
                    toDOM: () => ['ul', 0],
                },
                ordered_list: {
                    group: 'block',
                    content: 'list_item+',
                    toDOM: () => ['ol', 0],
                },
                list_item: {
                    content: 'paragraph block*',
                    toDOM: () => ['li', 0],
                },
                text: {
                    group: 'inline',
                    toDOM: () => ['span', 0],
                },
                heading: {
                    group: 'block',
                    content: 'inline*',
                    attrs: { level: { default: 1 } },
                    toDOM: (node) => [`h${node.attrs.level}`, 0],
                },
                blockquote: {
                    group: 'block',
                    content: 'block+',
                    toDOM: () => ['blockquote', 0],
                },
            },
            marks: {},
        });

        state = EditorState.create({
            schema: schema,
            doc: schema.topNodeType.createAndFill(),
        });
        dispatch = vi.fn((tr) => {
            state = state.apply(tr);
        });
    });

    describe('basic list operations', () => {
        it.each([
            [EditorMenuTypes.BulletList, EditorMenuTypes.BulletList],
            [EditorMenuTypes.OrderedList, EditorMenuTypes.OrderedList],
        ])('converts paragraph to %s', (menuType, listType) => {
            const command = createListCommand(schema, menuType);

            state = state.apply(createParagraphs(['Test text']));
            command(state, dispatch);

            verifyListStructure(listType, ['Test text'], 1);
        });

        it('toggles between bullet and ordered list with single paragraph', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList
            );

            state = state.apply(createParagraphs(['Test text']));

            bulletCommand(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.BulletList
            );

            orderedCommand(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.OrderedList
            );
        });

        it('toggles between bullet and ordered list with multiple paragraphs', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList
            );

            const expectedItems = ['First item', 'Second item', 'Third item'];
            state = state.apply(createParagraphs(expectedItems));
            selectAll();

            bulletCommand(state, dispatch);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, expectedItems);

            orderedCommand(state, dispatch);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.OrderedList, expectedItems);
        });

        it('toggles list off back to paragraph', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            state = state.apply(createParagraphs(['Test text']));

            command(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.BulletList
            );

            command(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe('paragraph');
            expect(state.doc.firstChild.textContent).toBe('Test text');
        });
    });

    describe('multiple line selection', () => {
        const TEST_LINES = ['First line', 'Second line', 'Third line'];

        beforeEach(() => {
            const tr = createParagraphs(TEST_LINES);
            state = state.apply(tr);
        });

        it('converts multiple paragraphs to list items', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            selectAll();

            command(state, dispatch);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, TEST_LINES);
        });

        it('preserves existing list items when converting mixed selection', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList
            );

            selectAll();

            bulletCommand(state, dispatch);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, TEST_LINES);

            orderedCommand(state, dispatch);

            verifyListStructure(EditorMenuTypes.OrderedList, TEST_LINES);
        });
    });

    describe('selection spanning multiple lists', () => {
        const listItem = (...children: Node[]) =>
            schema.nodes.list_item.create(null, children);

        const selectAcrossLists = (first: Node, second: Node) => {
            const doc = schema.nodes.doc.create(null, [first, second]);
            state = EditorState.create({
                schema: schema,
                doc: doc,
                selection: TextSelection.create(doc, 4, doc.content.size - 4),
            });
        };

        it('unifies two lists of different types into the target type', () => {
            selectAcrossLists(
                schema.nodes.bullet_list.create(null, [
                    listItem(createParagraph('one')),
                ]),
                schema.nodes.ordered_list.create(null, [
                    listItem(createParagraph('two')),
                ])
            );
            const command = createListCommand(
                schema,
                EditorMenuTypes.OrderedList
            );

            expect(command(state, dispatch)).toBe(true);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.OrderedList, ['one', 'two']);
        });

        it('unifies into the type of the first list as well', () => {
            selectAcrossLists(
                schema.nodes.bullet_list.create(null, [
                    listItem(createParagraph('one')),
                ]),
                schema.nodes.ordered_list.create(null, [
                    listItem(createParagraph('two')),
                ])
            );
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            expect(command(state, dispatch)).toBe(true);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, ['one', 'two']);
        });

        it('wraps each paragraph in its own item when unifying with a list', () => {
            const doc = schema.nodes.doc.create(null, [
                createParagraph('one'),
                createParagraph('two'),
                schema.nodes.ordered_list.create(null, [
                    listItem(createParagraph('alpha')),
                ]),
            ]);
            state = EditorState.create({
                schema: schema,
                doc: doc,
                selection: TextSelection.create(doc, 1, doc.content.size - 4),
            });
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            expect(command(state, dispatch)).toBe(true);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, [
                'one',
                'two',
                'alpha',
            ]);
        });

        it('preserves nested sublists when unifying', () => {
            selectAcrossLists(
                schema.nodes.bullet_list.create(null, [
                    listItem(
                        createParagraph('one'),
                        schema.nodes.bullet_list.create(null, [
                            listItem(createParagraph('nested')),
                        ])
                    ),
                ]),
                schema.nodes.ordered_list.create(null, [
                    listItem(createParagraph('two')),
                ])
            );
            const command = createListCommand(
                schema,
                EditorMenuTypes.OrderedList
            );

            expect(command(state, dispatch)).toBe(true);

            expect(state.doc.childCount).toBe(1);
            const list = state.doc.firstChild;
            expect(list.type.name).toBe(EditorMenuTypes.OrderedList);
            expect(list.childCount).toBe(2);

            const sublist = list.child(0).child(1);
            expect(sublist.type.name).toBe(EditorMenuTypes.BulletList);
        });
    });

    describe('select-all selections', () => {
        const applyAllSelection = () => {
            state = state.apply(
                state.tr.setSelection(new AllSelection(state.doc))
            );
        };

        it('wraps every paragraph in its own item', () => {
            state = state.apply(createParagraphs(['one', 'two']));
            applyAllSelection();
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            expect(command.allowed(state)).toBe(true);
            expect(command(state, dispatch)).toBe(true);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, ['one', 'two']);
        });

        it('toggles a fully selected list off', () => {
            const doc = schema.nodes.doc.create(
                null,
                schema.nodes.bullet_list.create(null, [
                    schema.nodes.list_item.create(null, createParagraph('one')),
                    schema.nodes.list_item.create(null, createParagraph('two')),
                ])
            );
            state = EditorState.create({ schema: schema, doc: doc });
            applyAllSelection();
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            expect(command.allowed(state)).toBe(true);
            expect(command(state, dispatch)).toBe(true);

            expect(state.doc.childCount).toBe(2);
            expect(state.doc.child(0).type.name).toBe('paragraph');
            expect(state.doc.child(1).type.name).toBe('paragraph');
        });
    });

    describe('toggle inside an existing list', () => {
        it('lifts the selected item out of the list', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );

            state = state.apply(createParagraphs(['Parent', 'Child']));

            selectAll();
            command(state, dispatch);

            let childPos: number | null = null;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text.includes('Child')) {
                    const index = node.text.indexOf('Child');
                    childPos = pos + index;

                    return false; // Stop traversal.
                }

                return true;
            });
            if (childPos === null) {
                throw new Error('Did not find text "Child"');
            }

            // For a text "Child" (length = 5), select from offset 1 up to offset 4.
            const selFrom = childPos + 1;
            const selTo = childPos + 4;
            const tr = state.tr.setSelection(
                TextSelection.create(state.doc, selFrom, selTo)
            );
            state = state.apply(tr);

            command(state, dispatch);

            expect(state.doc.childCount).toBe(2);

            const remainingList = state.doc.child(0);
            expect(remainingList.type.name).toBe(EditorMenuTypes.BulletList);
            expect(remainingList.childCount).toBe(1);
            expect(remainingList.child(0).textContent).toBe('Parent');

            const liftedParagraph = state.doc.child(1);
            expect(liftedParagraph.type.name).toBe('paragraph');
            expect(liftedParagraph.textContent).toBe('Child');
        });
    });

    describe('joining with adjacent lists', () => {
        const createList = (type: string, texts: string[]) =>
            schema.nodes[type].create(
                {},
                texts.map((text) =>
                    schema.nodes.list_item.create({}, [createParagraph(text)])
                )
            );

        const placeCaret = (pos: number) => {
            state = state.apply(
                state.tr.setSelection(TextSelection.create(state.doc, pos))
            );
        };

        it('joins a wrapped paragraph with a preceding list of the same type', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            state = state.apply(
                state.tr.replaceWith(0, state.doc.content.size, [
                    createList('bullet_list', ['one']),
                    createParagraph('two'),
                ])
            );
            placeCaret(11);

            command(state, dispatch);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, ['one', 'two']);
        });

        it('joins a wrapped paragraph with lists on both sides', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            state = state.apply(
                state.tr.replaceWith(0, state.doc.content.size, [
                    createList('bullet_list', ['one']),
                    createParagraph('two'),
                    createList('bullet_list', ['three']),
                ])
            );
            placeCaret(11);

            command(state, dispatch);

            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, [
                'one',
                'two',
                'three',
            ]);
        });

        it('leaves a neighboring list of another type alone', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            state = state.apply(
                state.tr.replaceWith(0, state.doc.content.size, [
                    createList('ordered_list', ['one']),
                    createParagraph('two'),
                ])
            );
            placeCaret(11);

            command(state, dispatch);

            expect(state.doc.childCount).toBe(2);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.OrderedList
            );
            expect(state.doc.lastChild.type.name).toBe(
                EditorMenuTypes.BulletList
            );
        });

        it('restores a single list when an item is toggled off and back on', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            state = state.apply(
                state.tr.replaceWith(
                    0,
                    state.doc.content.size,
                    createList('bullet_list', ['one', 'two'])
                )
            );
            placeCaret(11);

            command(state, dispatch);
            expect(state.doc.childCount).toBe(2);

            command(state, dispatch);
            expect(state.doc.childCount).toBe(1);
            verifyListStructure(EditorMenuTypes.BulletList, ['one', 'two']);
        });
    });

    describe('active state', () => {
        it('reports active state for bullet list', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            const tr = state.tr.insertText('Test text');
            state = state.apply(tr);
            command(state, dispatch);

            expect(command.active(state)).toBe(true);
        });

        it('reports inactive state for different list type', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList
            );

            const tr = state.tr.insertText('Test text');
            state = state.apply(tr);
            bulletCommand(state, dispatch);

            expect(orderedCommand.active(state)).toBe(false);
            expect(bulletCommand.active(state)).toBe(true);
        });

        it('reports active state for partial selection in list', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList
            );
            state = state.apply(createParagraphs(['First', 'Second', 'Third']));
            selectAll();
            command(state, dispatch);

            // Select part of the text inside the second list item.
            let secondPos: number | null = null;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text === 'Second') {
                    secondPos = pos;

                    return false;
                }

                return true;
            });
            if (secondPos === null) {
                throw new Error('Did not find text "Second"');
            }

            const tr = state.tr.setSelection(
                TextSelection.create(state.doc, secondPos + 1, secondPos + 4)
            );
            state = state.apply(tr);

            expect(command.active(state)).toBe(true);
        });
    });

    describe('edge cases', () => {
        describe('empty selections', () => {
            it('creates empty list item when no text is selected', () => {
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList
                );
                const tr = state.tr.setSelection(
                    TextSelection.create(state.doc, 1, 1)
                );
                state = state.apply(tr);

                command(state, dispatch);

                expect(state.doc.firstChild.type.name).toBe(
                    EditorMenuTypes.BulletList
                );
                expect(state.doc.firstChild.textContent).toBe('');
            });
        });

        describe('mixed content handling', () => {
            it('does not apply when the selection includes a heading', () => {
                const tr = state.tr
                    .insertText('Regular text\n')
                    .insert(
                        state.tr.mapping.map(state.doc.content.size),
                        schema.nodes.heading.create(
                            { level: 1 },
                            schema.text('Heading')
                        )
                    );
                state = state.apply(tr);

                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList
                );
                selectAll();

                expect(command.allowed(state)).toBe(false);
                expect(command(state, dispatch)).toBe(false);
                expect(dispatch).not.toHaveBeenCalled();
            });

            it('does not apply when the selection includes a blockquote', () => {
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList
                );
                const tr = state.tr
                    .insertText('Paragraph text')
                    .insert(
                        state.tr.mapping.map(state.doc.content.size),
                        schema.nodes.blockquote.create({}, schema.text('Quote'))
                    );
                state = state.apply(tr);

                selectAll();

                expect(command.allowed(state)).toBe(false);
                expect(command(state, dispatch)).toBe(false);
                expect(dispatch).not.toHaveBeenCalled();
            });

            it('wraps a blockquote paragraph holding the caret in a list', () => {
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList
                );
                const quote = schema.nodes.blockquote.create({}, [
                    createParagraph('Quote'),
                ]);
                state = state.apply(
                    state.tr.replaceWith(0, state.doc.content.size, quote)
                );
                state = state.apply(
                    state.tr.setSelection(TextSelection.create(state.doc, 3))
                );

                expect(command.allowed(state)).toBe(true);
                expect(command(state, dispatch)).toBe(true);

                const quoteNode = state.doc.firstChild;
                expect(quoteNode.type.name).toBe('blockquote');
                expect(quoteNode.firstChild.type.name).toBe(
                    EditorMenuTypes.BulletList
                );
                expect(quoteNode.firstChild.firstChild.type.name).toBe(
                    'list_item'
                );
                expect(quoteNode.textContent).toBe('Quote');
            });

            it('does not apply with the caret in a heading', () => {
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList
                );
                const heading = schema.nodes.heading.create(
                    { level: 1 },
                    schema.text('Heading')
                );
                state = state.apply(
                    state.tr.replaceWith(0, state.doc.content.size, heading)
                );
                state = state.apply(
                    state.tr.setSelection(TextSelection.create(state.doc, 2))
                );

                expect(command.allowed(state)).toBe(false);
                expect(command(state, dispatch)).toBe(false);
                expect(dispatch).not.toHaveBeenCalled();
            });

            it('allows toggling a list nested inside a blockquote', () => {
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList
                );
                const nested = schema.nodes.blockquote.create(
                    {},
                    schema.nodes.bullet_list.create({}, [
                        schema.nodes.list_item.create({}, [
                            schema.nodes.paragraph.create(
                                null,
                                schema.text('Item')
                            ),
                        ]),
                    ])
                );
                const tr = state.tr.replaceWith(
                    0,
                    state.doc.content.size,
                    nested
                );
                state = state.apply(tr);

                // Place the caret inside the nested list item.
                const sel = state.tr.setSelection(
                    TextSelection.create(state.doc, 4)
                );
                state = state.apply(sel);

                expect(command.allowed(state)).toBe(true);
            });
        });
    });
});
