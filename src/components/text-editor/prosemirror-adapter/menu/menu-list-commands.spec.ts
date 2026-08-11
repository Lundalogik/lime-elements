/* eslint-disable camelcase */
import { Schema } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { createListCommand } from './menu-commands';
import { EditorMenuTypes } from './types';

describe('List Commands', () => {
    let schema: Schema;
    let state: EditorState;
    let dispatch: jest.Mock;

    // Helper functions
    const createParagraph = (text: string) =>
        schema.nodes.paragraph.create(null, schema.text(text));

    const createParagraphs = (texts: string[]) => {
        let tr = state.tr;
        texts.forEach((text, i) => {
            const paragraph = createParagraph(text);
            if (i === 0) {
                tr = tr.replaceWith(0, state.doc.content.size, paragraph);
            } else {
                tr = tr.insert(tr.doc.content.size, paragraph);
            }
        });

        return tr;
    };

    const selectAll = () => {
        const $from = state.doc.resolve(1); // Start after doc node
        const $to = state.doc.resolve(state.doc.content.size - 1); // End before doc node

        const selTr = state.tr.setSelection(
            TextSelection.create(state.doc, $from.pos, $to.pos),
        );

        state = state.apply(selTr);
    };

    const verifyListStructure = (
        listType: string,
        expectedItems: string[],
        expectedCount: number = expectedItems.length,
    ) => {
        expect(state.doc.firstChild.type.name).toBe(listType);
        expect(state.doc.firstChild.childCount).toBe(expectedCount);

        state.doc.firstChild.forEach((item, _offset, i) => {
            expect(item.type.name).toBe('list_item');
            expect(item.firstChild.textContent).toBe(expectedItems[i]);
        });
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
        dispatch = jest.fn((tr) => {
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
                EditorMenuTypes.BulletList,
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList,
            );

            // Create initial paragraph
            const paragraph = schema.nodes.paragraph.create(
                null,
                schema.text('Test text'),
            );
            const tr = state.tr.replaceWith(
                0,
                state.doc.content.size,
                paragraph,
            );
            state = state.apply(tr);

            // Convert to bullet list
            bulletCommand(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.BulletList,
            );

            // Convert to ordered list
            orderedCommand(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.OrderedList,
            );
        });

        it('toggles between bullet and ordered list with multiple paragraphs', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList,
            );

            // Create multiple paragraphs
            const paragraphs = [
                schema.nodes.paragraph.create(null, schema.text('First item')),
                schema.nodes.paragraph.create(null, schema.text('Second item')),
                schema.nodes.paragraph.create(null, schema.text('Third item')),
            ];

            // Create a document with multiple paragraphs
            let tr = state.tr;
            paragraphs.forEach((p, i) => {
                if (i === 0) {
                    tr = tr.replaceWith(0, state.doc.content.size, p);
                } else {
                    tr = tr.insert(tr.doc.content.size, p);
                }
            });
            state = state.apply(tr);

            const selTr = state.tr.setSelection(
                TextSelection.create(
                    state.doc,
                    state.doc.resolve(1).pos,
                    state.doc.resolve(state.doc.content.size - 1).pos,
                ),
            );

            state = state.apply(selTr);

            // Convert to bullet list
            bulletCommand(state, dispatch);

            // Verify bullet list structure
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.BulletList,
            );
            expect(state.doc.firstChild.childCount).toBe(3);

            // Verify each list item individually for better error messages
            const expectedItems = ['First', 'Second', 'Third'];
            const bulletList = state.doc.firstChild;

            for (let i = 0; i < bulletList.childCount; i++) {
                const item = bulletList.child(i);
                expect(item.type.name).toBe('list_item');
                expect(item.firstChild.textContent).toBe(
                    `${expectedItems[i]} item`,
                );
            }

            // Convert to ordered list
            orderedCommand(state, dispatch);

            // Verify ordered list structure
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.OrderedList,
            );
            expect(state.doc.firstChild.childCount).toBe(3);

            const orderedList = state.doc.firstChild;
            for (let i = 0; i < orderedList.childCount; i++) {
                const item = orderedList.child(i);
                expect(item.type.name).toBe('list_item');
                expect(item.firstChild.textContent).toBe(
                    `${expectedItems[i]} item`,
                );
            }
        });

        it('toggles list off back to paragraph', () => {
            // Create bullet list
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );

            // Create initial paragraph
            const paragraph = schema.nodes.paragraph.create(
                null,
                schema.text('Test text'),
            );
            const tr = state.tr.replaceWith(
                0,
                state.doc.content.size,
                paragraph,
            );
            state = state.apply(tr);

            // Convert to bullet list
            command(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe(
                EditorMenuTypes.BulletList,
            );

            // Toggle it off
            command(state, dispatch);
            expect(state.doc.firstChild.type.name).toBe('paragraph');
            expect(state.doc.firstChild.textContent).toBe('Test text');
        });
    });

    describe('multiple line selection', () => {
        const TEST_LINES = ['First line', 'Second line', 'Third line'];

        beforeEach(() => {
            // Setup multiple paragraphs
            const tr = createParagraphs(TEST_LINES);
            state = state.apply(tr);
        });

        it('converts multiple paragraphs to list items', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );

            // Setup multiple paragraphs
            state = state.apply(createParagraphs(TEST_LINES));

            // Select all content
            selectAll();

            command(state, dispatch);

            // Update verification to match actual structure
            const list = state.doc.firstChild;
            expect(list.type.name).toBe(EditorMenuTypes.BulletList);
            expect(list.childCount).toBe(TEST_LINES.length);

            list.forEach((item, _offset, i) => {
                expect(item.type.name).toBe('list_item');
                expect(item.firstChild.type.name).toBe('paragraph');
                expect(item.firstChild.textContent).toBe(TEST_LINES[i]);
            });
        });

        it('preserves existing list items when converting mixed selection', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList,
            );

            // Setup multiple paragraphs
            state = state.apply(createParagraphs(TEST_LINES));

            // Select all content
            selectAll();

            // Convert to bullet list first
            bulletCommand(state, dispatch);

            // Verify bullet list structure
            const bulletList = state.doc.firstChild;
            expect(bulletList.type.name).toBe(EditorMenuTypes.BulletList);
            expect(bulletList.childCount).toBe(TEST_LINES.length);

            // Convert to ordered list
            orderedCommand(state, dispatch);

            // Verify ordered list structure
            const orderedList = state.doc.firstChild;
            expect(orderedList.type.name).toBe(EditorMenuTypes.OrderedList);
            expect(orderedList.childCount).toBe(TEST_LINES.length);

            orderedList.forEach((item, _offset, i) => {
                expect(item.type.name).toBe('list_item');
                expect(item.firstChild.type.name).toBe('paragraph');
                expect(item.firstChild.textContent).toBe(TEST_LINES[i]);
            });
        });
    });

    describe('nested lists', () => {
        it('allows creating nested lists', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );

            // Create initial content as separate paragraphs.
            state = state.apply(createParagraphs(['Parent', 'Child']));

            // Convert both paragraphs to a list
            selectAll();
            command(state, dispatch);

            // Find the text node containing "Child" and capture its text content.
            let childPos: number | null = null;
            state.doc.descendants((node, pos) => {
                if (node.isText && node.text.includes('Child')) {
                    // Compute absolute position of "Child" inside this text node.
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
                TextSelection.create(state.doc, selFrom, selTo),
            );
            state = state.apply(tr);

            // Create nested list
            command(state, dispatch);

            // Verify structure
            const outerList = state.doc.firstChild;
            expect(outerList.type.name).toBe(EditorMenuTypes.BulletList);
            expect(outerList.childCount).toBe(1);

            const firstItem = outerList.child(0);
            expect(firstItem.type.name).toBe('list_item');
            expect(firstItem.childCount).toBe(2);

            // First child of the list item is the "Parent" paragraph.
            expect(firstItem.child(0).type.name).toBe('paragraph');
            expect(firstItem.child(0).textContent).toBe('Parent');

            // Second child is the nested bullet_list.
            const nestedList = firstItem.child(1);
            expect(nestedList.type.name).toBe(EditorMenuTypes.BulletList);
            expect(nestedList.childCount).toBe(1);

            const nestedItem = nestedList.child(0);
            expect(nestedItem.type.name).toBe('list_item');
            expect(nestedItem.firstChild.type.name).toBe('paragraph');
            expect(nestedItem.firstChild.textContent).toBe('Child');
        });
    });

    describe('active state', () => {
        it('reports active state for bullet list', () => {
            const command = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );
            const tr = state.tr.insertText('Test text');
            state = state.apply(tr);
            command(state, dispatch);

            expect(command.active(state)).toBe(true);
        });

        it('reports inactive state for different list type', () => {
            const bulletCommand = createListCommand(
                schema,
                EditorMenuTypes.BulletList,
            );
            const orderedCommand = createListCommand(
                schema,
                EditorMenuTypes.OrderedList,
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
                EditorMenuTypes.BulletList,
            );
            let tr = state.tr.insertText('First\nSecond\nThird');
            state = state.apply(tr);
            command(state, dispatch);

            // Select middle line
            tr = state.tr.setSelection(
                TextSelection.create(
                    state.doc,
                    state.doc.content.firstChild.nodeSize / 2,
                    state.doc.content.firstChild.nodeSize / 2 + 6,
                ),
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
                    EditorMenuTypes.BulletList,
                );
                const tr = state.tr.setSelection(
                    TextSelection.create(state.doc, 1, 1),
                );
                state = state.apply(tr);

                command(state, dispatch);

                expect(state.doc.firstChild.type.name).toBe(
                    EditorMenuTypes.BulletList,
                );
                expect(state.doc.firstChild.textContent).toBe('');
            });
        });

        describe('mixed content handling', () => {
            it('handles selection with mixed content types', () => {
                // Setup paragraph and header
                let tr = state.tr
                    .insertText('Regular text\n')
                    .insert(
                        state.tr.mapping.map(state.doc.content.size),
                        schema.nodes.heading.create(
                            { level: 1 },
                            schema.text('Heading'),
                        ),
                    );
                state = state.apply(tr);

                // Select all and convert to list
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList,
                );
                tr = state.tr.setSelection(
                    TextSelection.create(
                        state.doc,
                        state.doc.resolve(1).pos,
                        state.doc.resolve(state.doc.content.size - 1).pos,
                    ),
                );
                state = state.apply(tr);

                command(state, dispatch);

                expect(state.doc.firstChild.type.name).toBe(
                    EditorMenuTypes.BulletList,
                );
                expect(state.doc.firstChild.childCount).toBe(2);
            });

            it('handles list items containing multiple block types', () => {
                const command = createListCommand(
                    schema,
                    EditorMenuTypes.BulletList,
                );
                const tr = state.tr
                    .insertText('Paragraph text')
                    .insert(
                        state.tr.mapping.map(state.doc.content.size),
                        schema.nodes.blockquote.create(
                            {},
                            schema.text('Quote'),
                        ),
                    );
                state = state.apply(tr);

                // Select all content so that both blocks are included in the conversion.
                const selTr = state.tr.setSelection(
                    TextSelection.create(
                        state.doc,
                        state.doc.resolve(1).pos,
                        state.doc.resolve(state.doc.content.size - 1).pos,
                    ),
                );
                state = state.apply(selTr);
                command(state, dispatch);

                const listItem = state.doc.firstChild.firstChild;
                expect(listItem.content.childCount).toBe(2);
            });
        });
    });
});
