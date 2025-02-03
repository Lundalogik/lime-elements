/* eslint-disable no-console */
import { toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { Schema, MarkType, NodeType, Attrs, Node } from 'prosemirror-model';
import { liftListItem } from 'prosemirror-schema-list';
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

const toggleList = (listType) => {
    return (state, dispatch) => {
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

const convertListType = (
    state: EditorState,
    fromType: NodeType,
    toType: NodeType,
    dispatch?: (tr: Transaction) => void,
): boolean => {
    const { $from } = state.selection;
    let listFound = false;
    let pos: number;
    let node: Node;

    // Find the list node
    for (let depth = $from.depth; depth > 0; depth--) {
        node = $from.node(depth);
        if (node.type === fromType) {
            pos = $from.before(depth);
            listFound = true;
            break;
        }
    }

    if (!listFound || !dispatch) {
        return listFound;
    }

    // Create new list with same content but different type
    const newList = toType.create(node.attrs, node.content);

    // Create and dispatch the transaction
    const tr = state.tr.replaceWith(pos, pos + node.nodeSize, newList);

    dispatch(tr);

    return true;
};

// Define allowed list types based on EditorMenuTypes
const LIST_TYPES = [
    EditorMenuTypes.BulletList,
    EditorMenuTypes.OrderedList,
] as const;

type ListType = (typeof LIST_TYPES)[number];

const getOtherListType = (schema: Schema, currentType: string): NodeType => {
    // Validate current type is a valid list type
    if (!LIST_TYPES.includes(currentType as ListType)) {
        console.error(`Invalid list type: ${currentType}`);
    }

    // Find the other list type
    const otherType = LIST_TYPES.find((type) => type !== currentType);

    if (!otherType || !schema.nodes[otherType]) {
        console.error(`List type "${otherType}" not found in schema`);
    }

    return schema.nodes[otherType];
};

/**
 * Iterates through all list nodes (including nested ones) in the selection
 * and converts each node from one type to another.
 *
 * This helper also handles attribute conversion:
 * - When converting from an ordered list to a bullet list, attributes like `order` are removed.
 * - When converting from a bullet list to an ordered list, you can set a default start (e.g. 1).
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
                // Create new attributes by copying the current ones
                const newAttrs = { ...node.attrs };

                // Handle attribute differences:
                if (
                    fromType.name === 'ordered_list' &&
                    toType.name === 'bullet_list'
                ) {
                    // Bullet lists generally do not need an "order" attribute
                    delete newAttrs.order;
                } else if (
                    fromType.name === 'bullet_list' &&
                    toType.name === 'ordered_list'
                ) {
                    // For ordered lists, set a default start if not present
                    newAttrs.order = newAttrs.order || 1;
                }
                // You can add more attribute merging logic here if needed.

                // Replace the current list node with one of the target type
                const newNode = toType.create(
                    newAttrs,
                    node.content,
                    node.marks,
                );
                tr = tr.replaceWith(pos, pos + node.nodeSize, newNode);
                converted = true;

                // Skip the subtree to avoid reprocessing nested nodes already converted.
                return false;
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
 * Converts all list nodes in the selection from one list type to the other.
 *
 * Here we assume that the command is meant to toggle the type.
 * It checks which list type is present (if any) and then converts them.
 *
 * @param EditorState - state - The current editor state.
 * @param Function - dispatch - The dispatch function.
 * @returns boolean - Whether conversion occurred.
 */
const toggleListConversion = (state, dispatch) => {
    const { schema, selection } = state;
    const bulletType = schema.nodes.bullet_list;
    const orderedType = schema.nodes.ordered_list;
    let bulletCount = 0;
    let orderedCount = 0;

    state.doc.nodesBetween(selection.from, selection.to, (node) => {
        if (node.type === bulletType) {
            bulletCount++;
        }

        if (node.type === orderedType) {
            orderedCount++;
        }

        return true;
    });

    if (bulletCount > 0 && orderedCount === 0) {
        // Convert bullet lists to ordered lists
        return convertAllListNodes(state, bulletType, orderedType, dispatch);
    } else if (orderedCount > 0 && bulletCount === 0) {
        // Convert ordered lists to bullet lists
        return convertAllListNodes(state, orderedType, bulletType, dispatch);
    }

    // If mixed or if none are found, you might decide not to convert or handle it specially.
    return false;
};

export const createListCommand = (schema, listTypeName) => {
    const type = schema.nodes[listTypeName];
    if (!type) {
        throw new Error(`List type "${listTypeName}" not found in schema`);
    }

    const command = (state, dispatch) => {
        // First, try to detect and convert if the selection spans a different list type.
        // For example, if the selection is currently in an ordered list and the command is bullet list.
        const otherType = getOtherListType(schema, listTypeName);
        if (otherType && toggleListConversion(state, dispatch)) {
            return true;
        }

        // Otherwise, use your original toggleList implementation.
        return toggleList(type)(state, dispatch);
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
