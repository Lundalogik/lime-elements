import { vi, type Mock } from 'vitest';
import { Node, Schema } from 'prosemirror-model';
import {
    AllSelection,
    EditorState,
    NodeSelection,
    TextSelection,
} from 'prosemirror-state';
import { CommandWithActive, createCodeBlockCommand } from './menu-commands';

describe('Code Block Command', () => {
    let schema: Schema;
    let state: EditorState;
    let dispatch: Mock;
    let command: CommandWithActive;

    const paragraph = (text: string = '') =>
        schema.nodes.paragraph.create(
            null,
            text === '' ? null : schema.text(text)
        );

    const heading = (text: string) =>
        schema.nodes.heading.create({ level: 1 }, schema.text(text));

    const codeBlock = (text: string = '') =>
        schema.nodes.code_block.create(
            null,
            text === '' ? null : schema.text(text)
        );

    const bulletList = (...texts: string[]) =>
        schema.nodes.bullet_list.create(
            null,
            texts.map((text) =>
                schema.nodes.list_item.create(null, paragraph(text))
            )
        );

    const setDoc = (...nodes: Node[]) => {
        state = EditorState.create({
            schema: schema,
            doc: schema.nodes.doc.create(null, nodes),
        });
    };

    const posOfText = (text: string): number => {
        let found: number | null = null;
        state.doc.descendants((node, pos) => {
            if (found === null && node.isText && node.text.includes(text)) {
                found = pos + node.text.indexOf(text);

                return false;
            }

            return true;
        });
        if (found === null) {
            throw new Error(`Did not find text "${text}"`);
        }

        return found;
    };

    const placeCaretIn = (text: string) => {
        state = state.apply(
            state.tr.setSelection(
                TextSelection.create(state.doc, posOfText(text) + 1)
            )
        );
    };

    const selectFromTo = (fromText: string, toText: string) => {
        state = state.apply(
            state.tr.setSelection(
                TextSelection.create(
                    state.doc,
                    posOfText(fromText),
                    posOfText(toText) + toText.length
                )
            )
        );
    };

    const topLevelBlocks = (): Node[] => {
        const nodes: Node[] = [];
        for (let i = 0; i < state.doc.childCount; i++) {
            nodes.push(state.doc.child(i));
        }

        return nodes;
    };

    const blockTypes = () => topLevelBlocks().map((node) => node.type.name);

    const blockTexts = () => topLevelBlocks().map((node) => node.textContent);

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
                code_block: {
                    group: 'block',
                    content: 'text*',
                    marks: '',
                    code: true,
                    toDOM: () => ['pre', ['code', 0]],
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
                bullet_list: {
                    group: 'block',
                    content: 'list_item+',
                    toDOM: () => ['ul', 0],
                },
                list_item: {
                    content: 'paragraph block*',
                    toDOM: () => ['li', 0],
                },
                horizontal_rule: {
                    group: 'block',
                    toDOM: () => ['hr'],
                },
                text: {
                    group: 'inline',
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
        command = createCodeBlockCommand(schema);
    });

    describe('toggle on', () => {
        it('converts the caret paragraph to a code block', () => {
            setDoc(paragraph('hello'));
            placeCaretIn('hello');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['code_block']);
            expect(blockTexts()).toEqual(['hello']);
        });

        it('converts a heading to a code block', () => {
            setDoc(heading('title'));
            placeCaretIn('title');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['code_block']);
            expect(blockTexts()).toEqual(['title']);
        });

        it('merges selected paragraphs into one code block with one line per block', () => {
            setDoc(paragraph('aa'), paragraph('bb'), paragraph('cc'));
            selectFromTo('aa', 'cc');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['code_block']);
            expect(blockTexts()).toEqual(['aa\nbb\ncc']);
        });

        it('merges a paragraph and a heading into one code block', () => {
            setDoc(heading('title'), paragraph('body'));
            selectFromTo('title', 'body');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['code_block']);
            expect(blockTexts()).toEqual(['title\nbody']);
        });

        it('converts an empty paragraph to an empty code block', () => {
            setDoc(paragraph());
            state = state.apply(
                state.tr.setSelection(TextSelection.create(state.doc, 1))
            );

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['code_block']);
            expect(blockTexts()).toEqual(['']);
        });

        it('converts a paragraph inside a blockquote in place', () => {
            setDoc(schema.nodes.blockquote.create(null, paragraph('quoted')));
            placeCaretIn('quoted');

            expect(command.allowed(state)).toBe(true);
            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['blockquote']);
            expect(state.doc.firstChild.firstChild.type.name).toBe(
                'code_block'
            );
        });
    });

    describe('toggle off', () => {
        it('splits a code block into one paragraph per line', () => {
            setDoc(codeBlock('a\nb\nc'));
            placeCaretIn('a');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual([
                'paragraph',
                'paragraph',
                'paragraph',
            ]);
            expect(blockTexts()).toEqual(['a', 'b', 'c']);
        });

        it('keeps empty lines as empty paragraphs', () => {
            setDoc(codeBlock('a\n\nb'));
            placeCaretIn('a');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTexts()).toEqual(['a', '', 'b']);
        });

        it('turns an empty code block into an empty paragraph', () => {
            setDoc(codeBlock());
            state = state.apply(
                state.tr.setSelection(TextSelection.create(state.doc, 1))
            );

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['paragraph']);
            expect(blockTexts()).toEqual(['']);
        });

        it('toggles off every code block covered by the selection', () => {
            setDoc(codeBlock('a'), codeBlock('b\nc'));
            selectFromTo('a', 'b\nc');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual([
                'paragraph',
                'paragraph',
                'paragraph',
            ]);
            expect(blockTexts()).toEqual(['a', 'b', 'c']);
        });

        it('places the caret in the converted content', () => {
            setDoc(codeBlock('a\nb'));
            placeCaretIn('b');

            command(state, dispatch);

            expect(state.selection.empty).toBe(true);
            expect(state.selection.$from.parent.type.name).toBe('paragraph');
        });
    });

    describe('mixed selections', () => {
        it('unifies code blocks and paragraphs into one code block', () => {
            setDoc(codeBlock('a\nb'), paragraph('c'));
            selectFromTo('a\nb', 'c');

            expect(command(state, dispatch)).toBe(true);
            expect(blockTypes()).toEqual(['code_block']);
            expect(blockTexts()).toEqual(['a\nb\nc']);
        });
    });

    describe('applicability', () => {
        it('declines when the selection touches a list', () => {
            setDoc(paragraph('before'), bulletList('item'));
            selectFromTo('before', 'item');

            expect(command.allowed(state)).toBe(false);
            expect(command(state, dispatch)).toBe(false);
            expect(dispatch).not.toHaveBeenCalled();
        });

        it('declines with the caret inside a list item', () => {
            setDoc(bulletList('item'));
            placeCaretIn('item');

            expect(command.allowed(state)).toBe(false);
            expect(command(state, dispatch)).toBe(false);
            expect(dispatch).not.toHaveBeenCalled();
        });

        it('declines when the selection covers a horizontal rule', () => {
            setDoc(
                paragraph('above'),
                schema.nodes.horizontal_rule.create(),
                paragraph('below')
            );
            selectFromTo('above', 'below');

            expect(command.allowed(state)).toBe(false);
            expect(command(state, dispatch)).toBe(false);
            expect(dispatch).not.toHaveBeenCalled();
        });

        it('declines a node selection', () => {
            setDoc(paragraph('text'), schema.nodes.horizontal_rule.create());
            state = state.apply(
                state.tr.setSelection(NodeSelection.create(state.doc, 6))
            );

            expect(command.allowed(state)).toBe(false);
            expect(command(state, dispatch)).toBe(false);
            expect(dispatch).not.toHaveBeenCalled();
        });

        it('declines an all selection', () => {
            setDoc(paragraph('text'));
            state = state.apply(
                state.tr.setSelection(new AllSelection(state.doc))
            );

            expect(command.allowed(state)).toBe(false);
            expect(command(state, dispatch)).toBe(false);
            expect(dispatch).not.toHaveBeenCalled();
        });
    });

    describe('active state', () => {
        it('reports active with the caret inside a code block', () => {
            setDoc(codeBlock('code'));
            placeCaretIn('code');

            expect(command.active(state)).toBe(true);
        });

        it('reports inactive with the caret in a paragraph', () => {
            setDoc(paragraph('text'));
            placeCaretIn('text');

            expect(command.active(state)).toBe(false);
        });

        it('reports the state of the selection start in a mixed selection', () => {
            setDoc(codeBlock('code'), paragraph('text'));
            selectFromTo('code', 'text');

            expect(command.active(state)).toBe(true);
        });
    });
});
