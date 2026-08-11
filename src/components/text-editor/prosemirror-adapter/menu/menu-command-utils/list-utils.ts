import { EditorState, Transaction } from 'prosemirror-state';
import { NodeType, NodeRange } from 'prosemirror-model';
import { findWrapping } from 'prosemirror-transform';

export type Dispatch = (tr: Transaction) => void;

export type ListContext =
    | { kind: 'same-type' | 'other-type'; listDepth: number }
    | { kind: 'no-list' | 'mixed'; listDepth: null };

const LIST_NODE_NAMES = new Set(['bullet_list', 'ordered_list']);

const innermostListDepth = (state: EditorState): number | null => {
    const { $from } = state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
        if (LIST_NODE_NAMES.has($from.node(depth).type.name)) {
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
            LIST_NODE_NAMES.has(node.type.name) ||
            node.type.name === 'list_item';
        if (isTopLevelBlock && !listable) {
            found = true;

            return false;
        }

        return !isTopLevelBlock || LIST_NODE_NAMES.has(node.type.name);
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
    const startIndex = $from.index(0);
    const endIndex = Math.min($to.index(0), state.doc.childCount - 1);
    for (let i = startIndex; i <= endIndex; i++) {
        const child = state.doc.child(i);
        if (LIST_NODE_NAMES.has(child.type.name)) {
            sawList = true;
        } else if (child.type.name === 'paragraph') {
            sawParagraph = true;
        }
    }

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
        dispatch(
            state.tr
                .setNodeMarkup(
                    pos,
                    targetType,
                    listAttrsFor(targetType, node.attrs)
                )
                .scrollIntoView()
        );
    }

    return true;
};

const listAttrsFor = (
    targetType: NodeType,
    attrs: Record<string, unknown>
): Record<string, unknown> => {
    if (targetType.name === 'ordered_list') {
        return { ...attrs, order: attrs.order ?? 1 };
    }

    return {};
};

const mapKeepBefore = (tr: Transaction, position: number): number =>
    // ProseMirror's Mapping.map takes (pos, assoc); the unicorn rule
    // misreads it as Array#map with a `this` argument.
    // eslint-disable-next-line unicorn/no-array-method-this-argument
    tr.mapping.map(position, -1);

const wrapRunInList = (
    tr: Transaction,
    targetType: NodeType,
    runStart: number,
    runEnd: number
): void => {
    const $start = tr.doc.resolve(tr.mapping.map(runStart) + 1);
    const $end = tr.doc.resolve(mapKeepBefore(tr, runEnd) - 1);
    const range = new NodeRange($start, $end, 0);
    const wrapping = findWrapping(range, targetType);
    if (wrapping) {
        tr.wrap(range, wrapping);
    }
};

const convertListsAndWrapRuns = (
    tr: Transaction,
    state: EditorState,
    targetType: NodeType,
    startIndex: number,
    endIndex: number
): void => {
    // Positions computed against the pre-transform doc are mapped through
    // tr.mapping when applied.
    const doc = state.doc;
    let runStart: number | null = null;
    let runEnd: number | null = null;
    let pos = 0;

    for (let i = 0; i < doc.childCount; i++) {
        const child = doc.child(i);
        const inRange = i >= startIndex && i <= endIndex;
        const isList = LIST_NODE_NAMES.has(child.type.name);

        if (inRange && child.type.name === 'paragraph') {
            runStart = runStart ?? pos;
            runEnd = pos + child.nodeSize;
        } else if (runStart !== null && runEnd !== null) {
            wrapRunInList(tr, targetType, runStart, runEnd);
            runStart = null;
            runEnd = null;
        }

        if (inRange && isList && child.type !== targetType) {
            tr.setNodeMarkup(
                tr.mapping.map(pos),
                targetType,
                listAttrsFor(targetType, child.attrs)
            );
        }

        pos += child.nodeSize;
    }

    if (runStart !== null && runEnd !== null) {
        wrapRunInList(tr, targetType, runStart, runEnd);
    }
};

const joinAdjacentLists = (
    tr: Transaction,
    targetType: NodeType,
    mappedFrom: number,
    mappedTo: number
): void => {
    // Scan the transformed doc's top-level boundaries back to front, so
    // earlier join positions stay valid as joins shrink the doc.
    const boundaries: number[] = [];
    let boundary = 0;
    for (let i = 0; i < tr.doc.childCount; i++) {
        boundary += tr.doc.child(i).nodeSize;
        boundaries.push(boundary);
    }

    for (const joinPos of boundaries.reverse()) {
        if (joinPos <= mappedFrom || joinPos > mappedTo + 1) {
            continue;
        }

        if (joinPos >= tr.doc.content.size) {
            continue;
        }

        const $boundary = tr.doc.resolve(joinPos);
        if (
            $boundary.nodeBefore?.type === targetType &&
            $boundary.nodeAfter?.type === targetType
        ) {
            tr.join(joinPos);
        }
    }
};

/**
 * Turns a mixed top-level selection (paragraphs and lists) into a single
 * list of the target type: paragraph runs are wrapped, lists are converted
 * in place, and adjacent same-type lists are joined. Nesting inside
 * converted lists is preserved.
 *
 * @param state - the current editor state
 * @param targetType - the list type to unify into
 * @param dispatch - the dispatch function; omit for a dry-run capability check
 * @returns true when the unification applies
 */
export const unifyToList = (
    state: EditorState,
    targetType: NodeType,
    dispatch?: Dispatch
): boolean => {
    const { $from, $to } = state.selection;
    if ($from.depth === 0 || $to.depth === 0) {
        return false;
    }

    if (dispatch === undefined) {
        return true;
    }

    const tr = state.tr;
    convertListsAndWrapRuns(
        tr,
        state,
        targetType,
        $from.index(0),
        $to.index(0)
    );
    joinAdjacentLists(
        tr,
        targetType,
        tr.mapping.map($from.before(1)),
        mapKeepBefore(tr, $to.after(1))
    );

    dispatch(tr.scrollIntoView());

    return true;
};
