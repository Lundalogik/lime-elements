import { EditorState, Transaction } from 'prosemirror-state';
import {
    Node,
    NodeRange,
    NodeType,
    ResolvedPos,
    Schema,
} from 'prosemirror-model';
import { canSplit, findWrapping } from 'prosemirror-transform';

type Dispatch = (tr: Transaction) => void;

export type ListContext =
    | { kind: 'same-type' | 'other-type'; listDepth: number }
    | { kind: 'no-list'; listDepth: null; singleBlock: boolean }
    | { kind: 'mixed'; listDepth: null };

const isListNode = (node: Node, schema: Schema): boolean =>
    node.type === schema.nodes.bullet_list ||
    node.type === schema.nodes.ordered_list;

const innermostListDepth = (state: EditorState): number | null => {
    const { $from } = state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
        if (isListNode($from.node(depth), state.schema)) {
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
    const { schema } = state;
    let found = false;
    state.doc.nodesBetween(from, to, (node, _pos, parent) => {
        if (found) {
            return false;
        }

        const isTopLevelBlock = parent?.type === schema.topNodeType;
        const listable =
            node.type === schema.nodes.paragraph ||
            node.type === schema.nodes.list_item ||
            isListNode(node, schema);
        if (isTopLevelBlock && !listable) {
            found = true;

            return false;
        }

        return !isTopLevelBlock || isListNode(node, schema);
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
        return listContextAt($from, fromDepth, listType);
    }

    if (fromDepth === null && sameTopLevelBlock) {
        return { kind: 'no-list', listDepth: null, singleBlock: true };
    }

    // The range spans multiple top-level blocks: uniform paragraphs mean a
    // plain wrap; lists that are all of the target type mean a toggle;
    // any other list in the mix means unification.
    const listTypes = new Set<NodeType>();
    let sawParagraph = false;
    const startIndex = $from.index(0);
    const endIndex = Math.min($to.index(0), state.doc.childCount - 1);
    for (let i = startIndex; i <= endIndex; i++) {
        const child = state.doc.child(i);
        if (isListNode(child, state.schema)) {
            listTypes.add(child.type);
        } else if (child.type === state.schema.nodes.paragraph) {
            sawParagraph = true;
        }
    }

    const uniformTargetLists =
        !sawParagraph && listTypes.size === 1 && listTypes.has(listType);
    if (uniformTargetLists && fromDepth !== null) {
        return listContextAt($from, fromDepth, listType);
    }

    if (listTypes.size > 0) {
        return { kind: 'mixed', listDepth: null };
    }

    return { kind: 'no-list', listDepth: null, singleBlock: false };
};

const listContextAt = (
    $from: ResolvedPos,
    listDepth: number,
    listType: NodeType
): ListContext => ({
    kind: $from.node(listDepth).type === listType ? 'same-type' : 'other-type',
    listDepth: listDepth,
});

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
                    listAttrsFor(targetType, node.attrs, state.schema)
                )
                .scrollIntoView()
        );
    }

    return true;
};

const listAttrsFor = (
    targetType: NodeType,
    attrs: Record<string, unknown>,
    schema: Schema
): Record<string, unknown> => {
    if (targetType === schema.nodes.ordered_list) {
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
    if (!wrapping) {
        return;
    }

    tr.wrap(range, wrapping);

    // tr.wrap puts the whole run inside a single list_item; splitting at
    // each block boundary gives one item per block, the same shape
    // wrapInList produces.
    const listIndex = wrapping.findIndex((entry) => entry.type === targetType);
    const splitDepth = wrapping.length - (listIndex + 1);
    let splitPos = range.start + wrapping.length;
    for (let i = range.startIndex; i < range.endIndex; i++) {
        if (i > range.startIndex && canSplit(tr.doc, splitPos, splitDepth)) {
            tr.split(splitPos, splitDepth);
            splitPos += 2 * splitDepth;
        }

        splitPos += range.parent.child(i).nodeSize;
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
        const isList = isListNode(child, state.schema);

        if (inRange && child.type === state.schema.nodes.paragraph) {
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
                listAttrsFor(targetType, child.attrs, state.schema)
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

        joinSameTypeBoundary(tr, targetType, joinPos);
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

/**
 * Wraps a dispatch so that after a list is wrapped around the selection,
 * adjacent top-level lists of the same type are joined with it.
 *
 * @param state - the editor state the wrap command runs on
 * @param targetType - the list type being wrapped
 * @param dispatch - the dispatch function; omitted for a dry-run capability check
 * @returns the wrapped dispatch, or undefined when no dispatch was given
 */
export const joinAdjacentListsOnDispatch = (
    state: EditorState,
    targetType: NodeType,
    dispatch?: Dispatch
): Dispatch | undefined => {
    if (!dispatch) {
        return undefined;
    }

    const { $from, $to } = state.selection;

    return (tr) => {
        // The new list's outer boundaries: the start maps before the
        // inserted wrapping, the end maps after it.
        const start = mapKeepBefore(tr, $from.before(1));
        const end = tr.mapping.map($to.after(1));
        // Back to front, so the earlier boundary stays valid after a join.
        joinSameTypeBoundary(tr, targetType, end);
        joinSameTypeBoundary(tr, targetType, start);

        dispatch(tr);
    };
};

const joinSameTypeBoundary = (
    tr: Transaction,
    targetType: NodeType,
    boundary: number
): void => {
    if (boundary <= 0 || boundary >= tr.doc.content.size) {
        return;
    }

    const $boundary = tr.doc.resolve(boundary);
    if (
        $boundary.nodeBefore?.type === targetType &&
        $boundary.nodeAfter?.type === targetType
    ) {
        tr.join(boundary);
    }
};
