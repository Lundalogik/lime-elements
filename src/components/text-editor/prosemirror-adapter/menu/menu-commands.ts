/* eslint-disable no-console */
import { toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { Schema, MarkType, NodeType, Attrs, Fragment } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import {
    Command,
    EditorState,
    Transaction,
    TextSelection,
} from 'prosemirror-state';
import { EditorMenuTypes, EditorTextLink, LevelMapping } from './types';

type CommandFunction = (
    schema: Schema,
    mark: EditorMenuTypes,
    link?: EditorTextLink,
) => CommandWithActive;

interface CommandMapping {
    [key: string]: CommandFunction;
}

export interface CommandWithActive extends Command {
    active?: (state: EditorState) => boolean;
}

const setActiveMethodForMark = (
    command: CommandWithActive,
    markType: MarkType,
) => {
    command.active = (state) => {
        const { from, $from, to, empty } = state.selection;
        if (empty) {
            return !!markType.isInSet(state.storedMarks || $from.marks());
        } else {
            return state.doc.rangeHasMark(from, to, markType);
        }
    };
};

const setActiveMethodForNode = (
    command: CommandWithActive,
    nodeType: NodeType,
    level?: number,
) => {
    command.active = (state) => {
        const { $from } = state.selection;
        const node = $from.node($from.depth);

        if (node && node.type.name === nodeType.name) {
            if (nodeType.name === LevelMapping.Heading && level) {
                return node.attrs.level === level;
            }

            return true;
        }

        return false;
    };
};

const setActiveMethodForWrap = (
    command: CommandWithActive,
    nodeType: NodeType,
) => {
    command.active = (state) => {
        const { from, to } = state.selection;

        for (let pos = from; pos <= to; pos++) {
            const resolvedPos = state.doc.resolve(pos);
            for (let i = resolvedPos.depth; i > 0; i--) {
                const node = resolvedPos.node(i);
                if (node && node.type.name === nodeType.name) {
                    return true;
                }
            }
        }

        return false;
    };
};

const createInsertLinkCommand: CommandFunction = (
    schema: Schema,
    _: EditorMenuTypes,
    link?: EditorTextLink,
): CommandWithActive => {
    const command: Command = (state, dispatch) => {
        const { from, to } = state.selection;
        if (from === to) {
            // If no text is selected, insert new text with link
            const linkMark = schema.marks.link.create({
                href: link.href,
                title: link.href,
                target: isExternalLink(link.href) ? '_blank' : null,
            });
            const linkText = link.text || link.href;
            const newLink = schema.text(linkText, [linkMark]);
            dispatch(state.tr.insert(from, newLink));
        } else {
            // If text is selected, replace selected text with link text
            const linkMark = schema.marks.link.create({
                href: link.href,
                title: link.href,
                target: isExternalLink(link.href) ? '_blank' : null,
            });
            const selectedText = state.doc.textBetween(from, to, ' ');
            const newLink = schema.text(link.text || selectedText, [linkMark]);
            dispatch(state.tr.replaceWith(from, to, newLink));
        }

        return true;
    };

    setActiveMethodForMark(command, schema.marks.link);

    return command;
};

const createToggleMarkCommand = (
    schema: Schema,
    markName: string,
    link?: EditorTextLink,
): CommandWithActive => {
    const markType: MarkType | undefined = schema.marks[markName];
    if (!markType) {
        throw new Error(`Mark "${markName}" not found in schema`);
    }

    const attrs = getAttributes(markName, link);

    const command: CommandWithActive = toggleMark(markType, attrs);
    setActiveMethodForMark(command, markType);

    return command;
};

const getAttributes = (
    markName: string,
    link: EditorTextLink,
): Attrs | null => {
    if (markName === EditorMenuTypes.Link && link.href) {
        return {
            href: link.href,
            target: isExternalLink(link.href) ? '_blank' : null,
        };
    }

    return undefined;
};

export const isExternalLink = (url: string): boolean => {
    return !url.startsWith(window.location.origin);
};

/**
 * Toggles or wraps a node type based on the selection and parameters.
 * - Toggles to paragraph if the selection is of the specified type.
 * - Lifts content out if already wrapped in the specified type.
 * - Wraps or sets the selection to the specified type based on `shouldWrap`.
 * @param schema - ProseMirror schema.
 * @param type - Block type name to toggle.
 * @param attrs - Attributes for the block type.
 * @param shouldWrap - Wrap selection if true, otherwise directly set the block type for the selection.
 * @returns A command based on selection and action needed.
 */
const toggleNodeType = (
    schema: Schema,
    type: string,
    attrs: Attrs = {},
    shouldWrap: boolean = false,
): Command => {
    const nodeType = schema.nodes[type];
    const paragraphType = schema.nodes.paragraph;

    return (state, dispatch) => {
        const { $from, $to } = state.selection;

        const hasActiveWrap = $from.node($from.depth - 1).type === nodeType;

        if (
            state.selection instanceof TextSelection &&
            // Ensure selection is within the same parent block
            // We don't want toggling block types across multiple blocks
            $from.sameParent($from.doc.resolve($to.pos))
        ) {
            if ($from.parent.type === nodeType) {
                if (dispatch) {
                    dispatch(
                        state.tr.setBlockType(
                            $from.pos,
                            $to.pos,
                            paragraphType,
                        ),
                    );
                }

                return true;
            } else {
                if (hasActiveWrap) {
                    return lift(state, dispatch);
                }

                if (shouldWrap) {
                    return wrapIn(nodeType, attrs)(state, dispatch);
                } else {
                    return setBlockType(nodeType, attrs)(state, dispatch);
                }
            }
        }

        return false;
    };
};

export const isValidUrl = (text: string): boolean => {
    try {
        new URL(text);
    } catch {
        return false;
    }

    return true;
};

const createSetNodeTypeCommand = (
    schema: Schema,
    nodeType: string,
    level?: number,
): CommandWithActive => {
    const type: NodeType | undefined = schema.nodes[nodeType];
    if (!type) {
        throw new Error(`Node type "${nodeType}" not found in schema`);
    }

    let command: CommandWithActive;
    if (nodeType === LevelMapping.Heading && level) {
        command = toggleNodeType(schema, LevelMapping.Heading, {
            level: level,
        });
    } else if (nodeType === EditorMenuTypes.CodeBlock) {
        command = toggleNodeType(schema, EditorMenuTypes.CodeBlock);
    } else {
        command = setBlockType(type);
    }

    setActiveMethodForNode(command, type, level);

    return command;
};

const createWrapInCommand = (
    schema: Schema,
    nodeType: string,
): CommandWithActive => {
    const type: NodeType | undefined = schema.nodes[nodeType];
    if (!type) {
        throw new Error(`Node type "${nodeType}" not found in schema`);
    }

    let command: CommandWithActive;
    if (nodeType === EditorMenuTypes.Blockquote) {
        command = toggleNodeType(schema, EditorMenuTypes.Blockquote, {}, true);
    } else {
        command = wrapIn(type);
    }

    setActiveMethodForWrap(command, type);

    return command;
};

/**
 * Iterates through all list nodes (including nested ones) in the selection
 * that match the specified list type, and replaces each with a paragraph node.
 *
 * @param EditorState - The current editor state.
 * @param NodeType - The list node type to remove.
 * @param Schema- The editor schema.
 * @param Function - The dispatch function.
 * @returns boolean - True if any list nodes were removed.
 */
const removeListNodes = (state, targetType, schema, dispatch) => {
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
                    // Each child should be a list_item. If its first child is a paragraph, use that.
                    if (
                        child.childCount > 0 &&
                        child.firstChild.type === schema.nodes.paragraph
                    ) {
                        frag = frag.append(Fragment.from(child.firstChild));
                    } else {
                        // Otherwise, wrap the list_item content in a new paragraph.
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

                // Skip descending into this node's children.
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

const isInListOfType = (state: EditorState, listType: NodeType): boolean => {
    const { $from } = state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        if (node.type === listType) {
            return true;
        }
    }

    return false;
};

// Define allowed list types based on EditorMenuTypes
const LIST_TYPES = [
    EditorMenuTypes.BulletList,
    EditorMenuTypes.OrderedList,
] as const;

type ListType = (typeof LIST_TYPES)[number];

const getOtherListType = (schema: Schema, currentType: string): NodeType => {
    if (!LIST_TYPES.includes(currentType as ListType)) {
        console.error(`Invalid list type: ${currentType}`);
    }

    const otherType = LIST_TYPES.find((type) => type !== currentType);

    if (!otherType || !schema.nodes[otherType]) {
        console.error(`List type "${otherType}" not found in schema`);
    }

    return schema.nodes[otherType];
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

/**
 * Returns the converted attributes for a list node when converting from one type to another.
 *
 * @param NodeType - fromType - The current list type.
 * @param NodeType - toType - The target list type.
 * @param Object - attrs - The current attributes.
 * @returns Object - The updated attributes.
 */
const convertAttributes = (fromType, toType, attrs) => {
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

/**
 * Iterates through all list nodes (including nested ones) in the selection
 * and converts each node from one type to another.
 *
 * This helper also handles attribute conversion:
 * - When converting from an ordered list to a bullet list, attributes like "order" are removed.
 * - When converting from a bullet list to an ordered list, a default start (1) is set if not present.
 *
 * @param EditorState - state - The current editor state.
 * @param NodeType - fromType - The list node type to convert from.
 * @param NodeType - toType - The list node type to convert to.
 * @param Function - dispatch - The dispatch function.
 * @returns boolean - Whether any conversion was performed.
 */
const convertAllListNodes = (state, fromType, toType, dispatch) => {
    let converted = false;
    let tr = state.tr;

    state.doc.nodesBetween(
        state.selection.from,
        state.selection.to,
        (node, pos) => {
            if (node.type === fromType) {
                const newAttrs = convertAttributes(
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

/**
 * Adjusts the current selection to include only fully selected blocks.
 *
 * @param EditorState - state - The current editor state.
 * @returns Object - An object with properties "from" and "to" representing
 *   the new selection boundaries.
 */
const adjustSelectionToFullBlocks = (state) => {
    const { $from, $to } = state.selection;
    // If the selection start is at the beginning of its block, keep it.
    // Otherwise, move to the end of that block (i.e. skip the partial block).
    const from = $from.pos === $from.start() ? $from.pos : $from.end();
    // Similarly, if the selection end is at the end of its block, keep it.
    // Otherwise, use the start of that block.
    const to = $to.pos === $to.end() ? $to.pos : $to.start();

    return { from: from, to: to };
};

export const createListCommand = (schema, listTypeName) => {
    const type = schema.nodes[listTypeName];
    if (!type) {
        throw new Error(`List type "${listTypeName}" not found in schema`);
    }

    const command = (state, dispatch) => {
        // If selection is already in the target list type, remove the list.
        if (isInListOfType(state, type)) {
            return removeListNodes(state, type, schema, dispatch);
        }

        // If the selection is in another list type, convert it.
        const isOtherListType = getOtherListType(schema, listTypeName);
        if (isOtherListType && isInListOfType(state, isOtherListType)) {
            return convertAllListNodes(state, isOtherListType, type, dispatch);
        }

        // Adjust the selection to include only fully selected blocks.
        const { from, to } = adjustSelectionToFullBlocks(state);
        if (from >= to) {
            return false;
        }

        // Create a new transaction with the adjusted selection.
        const adjustedTr = state.tr.setSelection(
            new TextSelection(state.doc.resolve(from), state.doc.resolve(to)),
        );
        // Apply the transaction to get a new state.
        const newState = state.apply(adjustedTr);

        return wrapInList(type)(newState, dispatch);
    };

    command.active = (state) => {
        let isActive = false;
        state.doc.nodesBetween(
            state.selection.from,
            state.selection.to,
            (node) => {
                if (node.type === type) {
                    isActive = true;

                    return false;
                }

                return true;
            },
        );

        return isActive;
    };

    return command;
};

const copyPasteLinkCommand: Command = (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
) => {
    const { from, to } = state.selection;
    if (from === to) {
        return false;
    }

    const clipboardData = (window as any).clipboardData;
    if (!clipboardData) {
        return false;
    }

    const copyPastedText = clipboardData.getData('text');
    if (!isValidUrl(copyPastedText)) {
        return false;
    }

    const linkMark = state.schema.marks.link.create({
        href: copyPastedText,
        target: isExternalLink(copyPastedText) ? '_blank' : null,
    });

    const selectedText = state.doc.textBetween(from, to, ' ');
    const newLink = state.schema.text(selectedText, [linkMark]);
    dispatch(state.tr.replaceWith(from, to, newLink));
};

const commandMapping: CommandMapping = {
    strong: createToggleMarkCommand,
    em: createToggleMarkCommand,
    underline: createToggleMarkCommand,
    strikethrough: createToggleMarkCommand,
    code: createToggleMarkCommand,
    link: createInsertLinkCommand,
    headerlevel1: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.one,
        ),
    headerlevel2: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.two,
        ),
    headerlevel3: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.three,
        ),
    blockquote: (schema) =>
        createWrapInCommand(schema, EditorMenuTypes.Blockquote),
    /* eslint-disable camelcase */
    code_block: (schema) =>
        createSetNodeTypeCommand(schema, EditorMenuTypes.CodeBlock),
    ordered_list: (schema) =>
        createListCommand(schema, EditorMenuTypes.OrderedList),
    bullet_list: (schema) =>
        createListCommand(schema, EditorMenuTypes.BulletList),
    /* eslint-enable camelcase */
};

export class MenuCommandFactory {
    private schema: Schema;

    constructor(schema: Schema) {
        this.schema = schema;
    }

    public getCommand(mark: EditorMenuTypes, link?: EditorTextLink) {
        const commandFunc = commandMapping[mark];
        if (!commandFunc) {
            throw new Error(`The Mark "${mark}" is not supported`);
        }

        return commandFunc(this.schema, mark, link);
    }

    buildKeymap() {
        return {
            'Mod-B': this.getCommand(EditorMenuTypes.Bold),
            'Mod-I': this.getCommand(EditorMenuTypes.Italic),
            'Mod-Shift-1': this.getCommand(EditorMenuTypes.HeaderLevel1),
            'Mod-Shift-2': this.getCommand(EditorMenuTypes.HeaderLevel2),
            'Mod-Shift-3': this.getCommand(EditorMenuTypes.HeaderLevel3),
            'Mod-Shift-X': this.getCommand(EditorMenuTypes.Strikethrough),
            'Mod-`': this.getCommand(EditorMenuTypes.Code),
            'Mod-Shift-C': this.getCommand(EditorMenuTypes.CodeBlock),
            'Mod-v': copyPasteLinkCommand,
        };
    }
}
