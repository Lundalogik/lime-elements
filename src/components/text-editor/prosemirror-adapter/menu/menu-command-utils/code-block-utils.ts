import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { Node, NodeRange, Schema } from 'prosemirror-model';

type Dispatch = (tr: Transaction) => void;

/**
 * Whether every textblock covered by the selection is a code block.
 *
 * @param state - the current editor state
 * @returns true when the selection touches code blocks and nothing else
 */
export const selectionCoversOnlyCodeBlocks = (state: EditorState): boolean => {
    const range = coveredBlockRange(state);
    if (!range) {
        return false;
    }

    let sawCode = false;
    let sawOther = false;
    state.doc.nodesBetween(range.start, range.end, (node) => {
        if (!node.isTextblock) {
            return true;
        }

        if (node.type === state.schema.nodes.code_block) {
            sawCode = true;
        } else {
            sawOther = true;
        }

        return false;
    });

    return sawCode && !sawOther;
};

/**
 * Whether the blocks covered by the selection contain content that cannot
 * move into a code block without loss. Any textblock converts cleanly (its
 * text flattens to code lines), and blockquotes are transparent containers;
 * anything else intersecting the covered blocks — lists, tables, horizontal
 * rules, and non-text inline content such as images — makes the command
 * decline.
 *
 * @param state - the current editor state
 * @returns true when a non-convertible node intersects the covered blocks
 */
export const selectionHasNonCodeConvertibleBlock = (
    state: EditorState
): boolean => {
    const range = coveredBlockRange(state);
    if (!range) {
        return true;
    }

    const { schema } = state;
    let found = false;
    state.doc.nodesBetween(range.start, range.end, (node) => {
        if (found || node.isText) {
            return false;
        }

        if (node.type === schema.nodes.code_block) {
            return false;
        }

        if (node.isTextblock || node.type === schema.nodes.blockquote) {
            return true;
        }

        found = true;

        return false;
    });

    return found;
};

/**
 * Replaces every code block covered by the selection with one paragraph per
 * line of its text (empty lines become empty paragraphs), then puts the
 * caret near its original position.
 *
 * @param state - the current editor state
 * @param dispatch - the dispatch function; omit for a dry-run capability check
 * @returns true when the toggle applies
 */
export const toggleOffCodeBlocks = (
    state: EditorState,
    dispatch?: Dispatch
): boolean => {
    const range = coveredBlockRange(state);
    if (!range) {
        return false;
    }

    if (dispatch === undefined) {
        return true;
    }

    const blocks: Array<{ pos: number; node: Node }> = [];
    state.doc.nodesBetween(range.start, range.end, (node, pos) => {
        if (node.type === state.schema.nodes.code_block) {
            blocks.push({ pos: pos, node: node });

            return false;
        }

        return true;
    });

    const tr = state.tr;
    // Back-to-front keeps the position of each remaining block valid as
    // replacements change the document length.
    for (const { pos, node } of blocks.reverse()) {
        tr.replaceWith(
            pos,
            pos + node.nodeSize,
            codeBlockToParagraphs(node, state.schema)
        );
    }

    setCaretNearMappedFrom(tr, state);
    dispatch(tr.scrollIntoView());

    return true;
};

/**
 * Merges every textblock covered by the selection into a single code block:
 * paragraphs and headings contribute one line each, and code blocks keep
 * their internal newlines as lines.
 *
 * @param state - the current editor state
 * @param dispatch - the dispatch function; omit for a dry-run capability check
 * @returns true when the merge applies
 */
export const unifyToCodeBlock = (
    state: EditorState,
    dispatch?: Dispatch
): boolean => {
    const range = coveredBlockRange(state);
    if (!range) {
        return false;
    }

    if (dispatch === undefined) {
        return true;
    }

    const lines: string[] = [];
    state.doc.nodesBetween(range.start, range.end, (node) => {
        if (!node.isTextblock) {
            return true;
        }

        lines.push(...node.textContent.split('\n'));

        return false;
    });

    const text = lines.join('\n');
    const content = text === '' ? null : state.schema.text(text);
    const tr = state.tr.replaceWith(
        range.start,
        range.end,
        state.schema.nodes.code_block.create(null, content)
    );
    setCaretNearMappedFrom(tr, state);
    dispatch(tr.scrollIntoView());

    return true;
};

const coveredBlockRange = (state: EditorState): NodeRange | null => {
    const { $from, $to } = state.selection;

    return $from.blockRange($to);
};

const codeBlockToParagraphs = (node: Node, schema: Schema): Node[] =>
    node.textContent
        .split('\n')
        .map((line) =>
            schema.nodes.paragraph.create(
                null,
                line === '' ? null : schema.text(line)
            )
        );

const setCaretNearMappedFrom = (tr: Transaction, state: EditorState): void => {
    const mapped = tr.mapping.map(state.selection.from);
    tr.setSelection(TextSelection.near(tr.doc.resolve(mapped)));
};
