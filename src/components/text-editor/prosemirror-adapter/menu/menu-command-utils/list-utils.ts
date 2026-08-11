import { EditorState, Transaction } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export type Dispatch = (tr: Transaction) => void;

export type ListContext =
    | { kind: 'same-type' | 'other-type'; listDepth: number }
    | { kind: 'no-list' | 'mixed'; listDepth: null };

const LIST_NODE_NAMES = ['bullet_list', 'ordered_list'];

const innermostListDepth = (state: EditorState): number | null => {
    const { $from } = state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
        if (LIST_NODE_NAMES.includes($from.node(depth).type.name)) {
            return depth;
        }
    }

    return null;
};

/**
 * Whether the selection touches top-level blocks that cannot become list
 * items (list_item requires a leading paragraph, so headings, blockquotes,
 * code blocks and tables are not listable).
 *
 * @param state - the current editor state
 * @returns true when a non-listable block intersects the selection
 */
export const selectionHasNonListableBlock = (state: EditorState): boolean => {
    const { from, to } = state.selection;
    let found = false;
    state.doc.nodesBetween(from, to, (node, _pos, parent) => {
        if (found) {
            return false;
        }

        const isTopLevelBlock = parent?.type.name === 'doc';
        const listable =
            node.type.name === 'paragraph' ||
            LIST_NODE_NAMES.includes(node.type.name) ||
            node.type.name === 'list_item';
        if (isTopLevelBlock && !listable) {
            found = true;

            return false;
        }

        return !isTopLevelBlock || LIST_NODE_NAMES.includes(node.type.name);
    });

    return found;
};

/**
 * Classifies the selection for the list command ladder.
 *
 * @param state - the current editor state
 * @param listType - the list type the command targets
 * @returns the ladder branch to take, plus the innermost list depth when
 * the selection sits inside a list
 */
export const resolveListContext = (
    state: EditorState,
    listType: NodeType
): ListContext => {
    const { $from, $to } = state.selection;
    const fromDepth = innermostListDepth(state);
    const sameTopLevelBlock =
        state.selection.empty ||
        $from.sameParent($to) ||
        $from.node(1) === $to.node(1);

    if (fromDepth !== null && sameTopLevelBlock) {
        const kind =
            $from.node(fromDepth).type === listType
                ? 'same-type'
                : 'other-type';

        return { kind: kind, listDepth: fromDepth };
    }

    if (fromDepth === null && sameTopLevelBlock) {
        return { kind: 'no-list', listDepth: null };
    }

    // The range spans multiple top-level blocks: uniform paragraphs mean a
    // plain wrap; any list in the mix means unification.
    let sawList = false;
    let sawParagraph = false;
    state.doc.nodesBetween(
        state.selection.from,
        state.selection.to,
        (node, _pos, parent) => {
            if (parent?.type.name !== 'doc') {
                return false;
            }

            if (LIST_NODE_NAMES.includes(node.type.name)) {
                sawList = true;
            } else if (node.type.name === 'paragraph') {
                sawParagraph = true;
            }

            return false;
        }
    );

    if (sawList && fromDepth !== null && !sawParagraph) {
        const kind =
            $from.node(fromDepth).type === listType
                ? 'same-type'
                : 'other-type';

        return { kind: kind, listDepth: fromDepth };
    }

    if (sawList) {
        return { kind: 'mixed', listDepth: null };
    }

    return { kind: 'no-list', listDepth: null };
};

/**
 * Converts the innermost list around the selection to the target list type.
 * bullet_list and ordered_list share the list_item+ content model, so the
 * node can change type in place.
 *
 * @param state - the current editor state
 * @param listDepth - depth of the list node, from resolveListContext
 * @param targetType - the list type to convert to
 * @param dispatch - the dispatch function; omit for a dry-run capability check
 * @returns true when the conversion applies
 */
export const convertInnermostList = (
    state: EditorState,
    listDepth: number,
    targetType: NodeType,
    dispatch?: Dispatch
): boolean => {
    const { $from } = state.selection;
    const pos = $from.before(listDepth);
    const node = state.doc.nodeAt(pos);
    if (!node) {
        return false;
    }

    if (dispatch) {
        const attrs =
            targetType.name === 'ordered_list'
                ? { ...node.attrs, order: node.attrs.order ?? 1 }
                : {};
        dispatch(
            state.tr.setNodeMarkup(pos, targetType, attrs).scrollIntoView()
        );
    }

    return true;
};

/**
 * Turns a mixed top-level selection (paragraphs and lists) into a single
 * list of the target type.
 *
 * @param _state - the current editor state
 * @param _targetType - the list type to unify into
 * @param _dispatch - the dispatch function
 * @returns true when the unification applies
 */
export const unifyToList = (
    _state: EditorState,
    _targetType: NodeType,
    _dispatch?: Dispatch
): boolean => {
    return false;
};
