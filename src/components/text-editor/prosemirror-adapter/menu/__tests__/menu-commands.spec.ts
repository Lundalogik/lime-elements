/* eslint-disable camelcase */
import { Schema } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { createListCommand } from '../menu-commands';

describe('List Commands', () => {
    let schema: Schema;
    let state: EditorState;
    let dispatch: jest.Mock;

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

        state = EditorState.create({ schema: schema });
        dispatch = jest.fn((tr) => {
            state = state.apply(tr);
        });
    });

    describe('list commands', () => {
        describe('single line operations', () => {
            ['bullet_list', 'ordered_list'].forEach((listType) => {
                it(`converts paragraph to ${listType}`, () => {
                    const command = createListCommand(schema, listType);

                    // Create a single paragraph with text
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

                    state.doc.forEach((node, offset) => {
                        console.log(`- Node at offset ${offset}:`, {
                            type: node.type.name,
                            text: node.textContent,
                            childCount: node.childCount,
                            nodeSize: node.nodeSize,
                        });
                    });

                    // Execute command
                    command(state, dispatch);

                    state.doc.forEach((node, offset) => {
                        console.log(`- Node at offset ${offset}:`, {
                            type: node.type.name,
                            text: node.textContent,
                            childCount: node.childCount,
                            nodeSize: node.nodeSize,
                        });

                        if (node.type.name === listType) {
                            node.forEach((childListItem, itemOffset) => {
                                console.log(
                                    `  - List item at offset ${itemOffset}:`,
                                    {
                                        type: childListItem.type.name,
                                        text: childListItem.textContent,
                                        childCount: childListItem.childCount,
                                    },
                                );

                                childListItem.forEach(
                                    (itemContent, contentOffset) => {
                                        console.log(
                                            `    - Content at offset ${contentOffset}:`,
                                            {
                                                type: itemContent.type.name,
                                                text: itemContent.textContent,
                                                childCount:
                                                    itemContent.childCount,
                                            },
                                        );
                                    },
                                );
                            });
                        }
                    });

                    // Verify structure
                    const resultList = state.doc.firstChild;
                    expect(resultList.type.name).toBe(listType);
                    expect(resultList.childCount).toBe(1);

                    const resultListItem = resultList.firstChild;
                    expect(resultListItem.type.name).toBe('list_item');
                    expect(resultListItem.childCount).toBe(1);

                    const resultContent = resultListItem.firstChild;
                    expect(resultContent.type.name).toBe('paragraph');
                    expect(resultContent.textContent).toBe('Test text');
                });
            });

            it('toggles between bullet and ordered list', () => {
                // Start with bullet list
                let command = createListCommand(schema, 'bullet_list');

                // Create initial paragraph and set selection
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

                // Ensure we have a valid selection
                const selection = TextSelection.create(
                    state.doc,
                    1,
                    state.doc.content.size - 1,
                );
                state = state.apply(state.tr.setSelection(selection));

                // Convert to bullet list
                command(state, dispatch);
                state = dispatch.mock.calls[dispatch.mock.calls.length - 1][0];
                expect(state.doc.firstChild.type.name).toBe('bullet_list');

                // Toggle to ordered list
                command = createListCommand(schema, 'ordered_list');
                command(state, dispatch);
                state = dispatch.mock.calls[dispatch.mock.calls.length - 1][0];
                expect(state.doc.firstChild.type.name).toBe('ordered_list');
            });

            // it('toggles list off back to paragraph', () => {
            //     // Create bullet list
            //     const command = createListCommand(schema, 'bullet_list');
            //     const tr = state.tr.insert(
            //         0,
            //         schema.nodes.paragraph.create(
            //             null,
            //             schema.text('Test text'),
            //         ),
            //     );
            //     state = state.apply(tr);
            //     command(state, dispatch);

            //     // Toggle it off
            //     command(state, dispatch);

            //     expect(state.doc.firstChild.type.name).toBe('paragraph');
            // });
        });

        // describe('multiple line selection', () => {
        //     beforeEach(() => {
        //         // Setup multiple paragraphs properly
        //         const tr = state.tr.insert(
        //             0,
        //             schema.nodes.paragraph.create(null, [
        //                 schema.text('First line'),
        //                 schema.nodes.paragraph.create(
        //                     null,
        //                     schema.text('Second line'),
        //                 ),
        //                 schema.nodes.paragraph.create(
        //                     null,
        //                     schema.text('Third line'),
        //                 ),
        //             ]),
        //         );
        //         state = state.apply(tr);
        //     });

        //     it('converts multiple paragraphs to list items', () => {
        //         const command = createListCommand(schema, 'bullet_list');

        //         // Select all paragraphs
        //         const tr = state.tr.setSelection(
        //             TextSelection.create(
        //                 state.doc,
        //                 1,
        //                 state.doc.content.size - 1,
        //             ),
        //         );
        //         state = state.apply(tr);

        //         command(state, dispatch);

        //         expect(state.doc.firstChild.type.name).toBe('bullet_list');
        //         expect(state.doc.firstChild.childCount).toBe(3);
        //     });

        //     it('preserves existing list items when converting mixed selection', () => {
        //         // First make first line a list
        //         let command = createListCommand(schema, 'bullet_list');
        //         let tr = state.tr.setSelection(
        //             TextSelection.create(
        //                 state.doc,
        //                 0,
        //                 state.doc.content.firstChild.nodeSize,
        //             ),
        //         );
        //         state = state.apply(tr);
        //         command(state, dispatch);

        //         // Then select all and convert to ordered list
        //         command = createListCommand(schema, 'ordered_list');
        //         tr = state.tr.setSelection(
        //             TextSelection.create(state.doc, 0, state.doc.content.size),
        //         );
        //         state = state.apply(tr);
        //         command(state, dispatch);

        //         expect(state.doc.firstChild.type.name).toBe('ordered_list');
        //         expect(state.doc.firstChild.childCount).toBe(3);
        //     });
        // });

        // describe('nested lists', () => {
        //     it('allows creating nested lists', () => {
        //         // Create outer list
        //         const command = createListCommand(schema, 'bullet_list');
        //         let tr = state.tr.insertText('Parent\nChild');
        //         state = state.apply(tr);
        //         command(state, dispatch);

        //         // Create nested list for second item
        //         const secondListItem = state.doc.firstChild.lastChild;
        //         tr = state.tr.setSelection(
        //             TextSelection.create(
        //                 state.doc,
        //                 state.doc.content.size - secondListItem.nodeSize + 1,
        //                 state.doc.content.size - 1,
        //             ),
        //         );
        //         state = state.apply(tr);
        //         command(state, dispatch);

        //         const outerList = state.doc.firstChild;
        //         const secondItem = outerList.lastChild;
        //         expect(secondItem.firstChild.type.name).toBe('bullet_list');
        //     });
        // });

        // describe('active state', () => {
        //     it('reports active state for bullet list', () => {
        //         const command = createListCommand(schema, 'bullet_list');
        //         const tr = state.tr.insertText('Test text');
        //         state = state.apply(tr);
        //         command(state, dispatch);

        //         expect(command.active(state)).toBe(true);
        //     });

        //     it('reports inactive state for different list type', () => {
        //         const bulletCommand = createListCommand(schema, 'bullet_list');
        //         const orderedCommand = createListCommand(
        //             schema,
        //             'ordered_list',
        //         );

        //         const tr = state.tr.insertText('Test text');
        //         state = state.apply(tr);
        //         bulletCommand(state, dispatch);

        //         expect(orderedCommand.active(state)).toBe(false);
        //     });

        //     it('reports active state for partial selection in list', () => {
        //         const command = createListCommand(schema, 'bullet_list');
        //         let tr = state.tr.insertText('First\nSecond\nThird');
        //         state = state.apply(tr);
        //         command(state, dispatch);

        //         // Select middle line
        //         tr = state.tr.setSelection(
        //             TextSelection.create(
        //                 state.doc,
        //                 state.doc.content.firstChild.nodeSize / 2,
        //                 state.doc.content.firstChild.nodeSize / 2 + 6,
        //             ),
        //         );
        //         state = state.apply(tr);

        //         expect(command.active(state)).toBe(true);
        //     });
        // });
    });

    // describe('edge cases', () => {
    //     describe('empty selections', () => {
    //         it('creates empty list item when no text is selected', () => {
    //             const command = createListCommand(schema, 'bullet_list');
    //             const tr = state.tr.setSelection(
    //                 TextSelection.create(state.doc, 0, 0),
    //             );
    //             state = state.apply(tr);

    //             command(state, dispatch);

    //             expect(state.doc.firstChild.type.name).toBe('bullet_list');
    //             expect(state.doc.firstChild.textContent).toBe('');
    //         });
    //     });

    //     describe('mixed content handling', () => {
    //         it('handles selection with mixed content types', () => {
    //             // Setup paragraph and header
    //             let tr = state.tr
    //                 .insertText('Regular text\n')
    //                 .insert(
    //                     state.tr.mapping.map(state.doc.content.size),
    //                     schema.nodes.heading.create(
    //                         { level: 1 },
    //                         schema.text('Heading'),
    //                     ),
    //                 );
    //             state = state.apply(tr);

    //             // Select all and convert to list
    //             const command = createListCommand(schema, 'bullet_list');
    //             tr = state.tr.setSelection(
    //                 TextSelection.create(state.doc, 0, state.doc.content.size),
    //             );
    //             state = state.apply(tr);

    //             command(state, dispatch);

    //             expect(state.doc.firstChild.type.name).toBe('bullet_list');
    //             expect(state.doc.firstChild.childCount).toBe(2);
    //         });

    //         it('handles list items containing multiple block types', () => {
    //             const command = createListCommand(schema, 'bullet_list');
    //             const tr = state.tr
    //                 .insertText('Paragraph text')
    //                 .insert(
    //                     state.tr.mapping.map(state.doc.content.size),
    //                     schema.nodes.blockquote.create(
    //                         {},
    //                         schema.text('Quote'),
    //                     ),
    //                 );
    //             state = state.apply(tr);

    //             command(state, dispatch);

    //             const listItem = state.doc.firstChild.firstChild;
    //             expect(listItem.content.childCount).toBe(2);
    //         });
    //     });

    //     describe('list structure operations', () => {
    //         it('splits list items correctly when pressing enter', () => {
    //             const command = createListCommand(schema, 'bullet_list');
    //             let tr = state.tr.insertText('First item');
    //             state = state.apply(tr);
    //             command(state, dispatch);

    //             // Simulate enter press in middle of text
    //             tr = state.tr.split(state.selection.$from.pos - 3);
    //             state = state.apply(tr);

    //             expect(state.doc.firstChild.childCount).toBe(2);
    //         });

    //         it('maintains correct indentation levels when toggling list types', () => {
    //             // Create nested bullet list
    //             let command = createListCommand(schema, 'bullet_list');
    //             const tr = state.tr.insertText('Parent\nChild\nGrandchild');
    //             state = state.apply(tr);
    //             command(state, dispatch);

    //             // Toggle to ordered list
    //             command = createListCommand(schema, 'ordered_list');
    //             command(state, dispatch);

    //             const list = state.doc.firstChild;
    //             expect(list.type.name).toBe('ordered_list');
    //             expect(list.childCount).toBe(3);
    //         });
    //     });

    //     describe('clipboard operations', () => {
    //         it('maintains list structure when pasting list content', () => {
    //             // Setup source list
    //             const command = createListCommand(schema, 'bullet_list');
    //             let tr = state.tr.insertText('Source item');
    //             state = state.apply(tr);
    //             command(state, dispatch);

    //             // Simulate copy-paste
    //             const copiedContent = state.doc.content.firstChild.copy();
    //             tr = state.tr.insert(state.selection.$from.pos, copiedContent);
    //             state = state.apply(tr);

    //             expect(state.doc.firstChild.childCount).toBe(2);
    //         });
    //     });

    //     describe('cross-boundary selections', () => {
    //         it('handles selection spanning list and non-list content', () => {
    //             // Setup mixed content
    //             let tr = state.tr
    //                 .insertText('Regular paragraph\n')
    //                 .insertText('List item');
    //             state = state.apply(tr);

    //             // Make second line a list
    //             const command = createListCommand(schema, 'bullet_list');
    //             tr = state.tr.setSelection(
    //                 TextSelection.create(
    //                     state.doc,
    //                     state.doc.content.firstChild.nodeSize,
    //                     state.doc.content.size,
    //                 ),
    //             );
    //             state = state.apply(tr);
    //             command(state, dispatch);

    //             // Select across boundary
    //             tr = state.tr.setSelection(
    //                 TextSelection.create(
    //                     state.doc,
    //                     5,
    //                     state.doc.content.size - 5,
    //                 ),
    //             );
    //             state = state.apply(tr);
    //             command(state, dispatch);

    //             expect(state.doc.firstChild.type.name).toBe('bullet_list');
    //         });
    //     });
    // });
});
