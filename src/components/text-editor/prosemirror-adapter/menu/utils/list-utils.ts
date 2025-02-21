/* eslint-disable no-console */
import { EditorState, Transaction } from 'prosemirror-state';
import { NodeType, Fragment, Schema } from 'prosemirror-model';
import { EditorMenuTypes } from '../types';
import { findWrapping, liftTarget } from 'prosemirror-transform';

export const LIST_TYPES = [
    EditorMenuTypes.BulletList,
    EditorMenuTypes.OrderedList,
] as const;

export const isInListOfType = (
    state: EditorState,
    listType: NodeType,
): boolean => {
    const { $from } = state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        if (node.type === listType) {
            return true;
        }
    }

    return false;
};

/**
 * Get the other list type from the current list type.
 * @param schema - The schema to use.
 * @param currentType - The current list type.
 * @returns The other list type.
 */
export const getOtherListType = (
    schema: Schema,
    currentType: string,
): NodeType => {
    if (!LIST_TYPES.includes(currentType as any)) {
        console.error(`Invalid list type: ${currentType}`);
    }

    const otherType = LIST_TYPES.find((type) => type !== currentType);
    if (!otherType || !schema.nodes[otherType]) {
        console.error(`List type "${otherType}" not found in schema`);
    }

    return schema.nodes[otherType];
};

export type Dispatch = (tr: Transaction) => void;

export const removeListNodes = (
    state: EditorState,
    targetType: NodeType,
    schema: Schema,
    dispatch: Dispatch,
) => {
    let tr = state.tr;
    let changed = false;

    state.doc.nodesBetween(
        state.selection.from,
        state.selection.to,
        (node, pos) => {
            if (node.type === targetType) {
                const start = pos;
                const end = pos + node.nodeSize;

                let frag = Fragment.empty;
                node.forEach((child) => {
                    if (
                        child.childCount > 0 &&
                        child.firstChild.type === schema.nodes.paragraph
                    ) {
                        frag = frag.append(Fragment.from(child.firstChild));
                    } else {
                        const para = schema.nodes.paragraph.create(
                            null,
                            child.content,
                            child.marks,
                        );
                        frag = frag.append(Fragment.from(para));
                    }
                });

                tr = tr.replaceWith(start, end, frag);
                changed = true;

                return false;
            }

            return true;
        },
    );

    if (changed && dispatch) {
        dispatch(tr.scrollIntoView());
    }

    return changed;
};

const fromOrderedToBulletList = (fromType: NodeType, toType: NodeType) => {
    return (
        fromType.name === EditorMenuTypes.OrderedList &&
        toType.name === EditorMenuTypes.BulletList
    );
};

const fromBulletToOrderedList = (fromType: NodeType, toType: NodeType) => {
    return (
        fromType.name === EditorMenuTypes.BulletList &&
        toType.name === EditorMenuTypes.OrderedList
    );
};

const convertListAttributes = (
    fromType: NodeType,
    toType: NodeType,
    attrs: Record<string, any>,
) => {
    const newAttrs = { ...attrs };
    if (fromOrderedToBulletList(fromType, toType)) {
        // Bullet lists generally do not need an "order" attribute.
        delete newAttrs.order;
    } else if (fromBulletToOrderedList(fromType, toType)) {
        // For ordered lists, set a default start if not present.
        newAttrs.order = newAttrs.order || 1;
    }

    return newAttrs;
};

export const convertAllListNodes = (
    state: EditorState,
    fromType: NodeType,
    toType: NodeType,
    dispatch: Dispatch,
) => {
    let converted = false;
    let tr = state.tr;

    state.doc.nodesBetween(
        state.selection.from,
        state.selection.to,
        (node, pos) => {
            if (node.type === fromType) {
                const newAttrs = convertListAttributes(
                    fromType,
                    toType,
                    node.attrs,
                );
                const newNode = toType.create(
                    newAttrs,
                    node.content,
                    node.marks,
                );
                tr = tr.replaceWith(pos, pos + node.nodeSize, newNode);
                converted = true;

                return false; // Skip the subtree.
            }

            return true;
        },
    );

    if (converted && dispatch) {
        dispatch(tr.scrollIntoView());
    }

    return converted;
};

export const toggleList = (listType: NodeType) => {
    return (state: EditorState, dispatch: Dispatch) => {
        const { $from, $to } = state.selection;
        const range = $from.blockRange($to);

        if (!range) {
            return false;
        }

        const wrapping = range && findWrapping(range, listType);

        if (wrapping) {
            // Wrap the selection in a list
            if (dispatch) {
                dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
            }

            return true;
        } else {
            // Check if we are in a list item and lift out of the list
            const liftRange = range && liftTarget(range);
            if (liftRange !== null) {
                if (dispatch) {
                    dispatch(state.tr.lift(range, liftRange).scrollIntoView());
                }

                return true;
            }

            return false;
        }
    };
};

/**
 * Converts a single list node from one type to another.
 */
export const convertSingleListNode = (
    state: EditorState,
    fromType: NodeType,
    toType: NodeType,
    dispatch: Dispatch,
): boolean => {
    const { $from } = state.selection;
    const tr = state.tr;

    // Find the nearest parent list of fromType
    for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        if (node.type === fromType) {
            const pos = $from.before(depth);
            const newNode = toType.create(
                convertListAttributes(fromType, toType, node.attrs),
                node.content,
                node.marks,
            );
            if (dispatch) {
                dispatch(
                    tr
                        .replaceWith(pos, pos + node.nodeSize, newNode)
                        .scrollIntoView(),
                );
            }

            return true;
        }
    }

    return false;
};
