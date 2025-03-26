/* eslint-disable multiline-ternary */

import { toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { Schema, MarkType, NodeType, Attrs } from 'prosemirror-model';
import { wrapInList, sinkListItem } from 'prosemirror-schema-list';
import { Command, EditorState, TextSelection } from 'prosemirror-state';
import { EditorMenuTypes, EditorTextLink, LevelMapping } from './types';
import {
    setActiveMethodForMark,
    setActiveMethodForNode,
    setActiveMethodForWrap,
} from './menu-command-utils/active-state-utils';
import {
    isInListOfType,
    getOtherListType,
    removeListNodes,
    convertAllListNodes,
    toggleList,
    Dispatch,
} from './menu-command-utils/list-utils';
import { copyPasteLinkCommand } from './menu-command-utils/link-utils';
import { findAncestorDepthOfType } from './menu-command-utils/node-utils';

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
    allowed?: (state: EditorState) => boolean;
}

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
 * Handles list operations when there is no selection (cursor only).
 * If the cursor is within a list item, only that list item is affected.
 *
 * @param EditorState - state - The current editor state.
 * @param NodeType - type - The type of list to toggle.
 * @param Schema - schema - The ProseMirror schema.
 * @param Function - dispatch - The dispatch function.
 * @returns boolean - True if the command was executed.
 */
const handleListNoSelection = (state, type, schema, dispatch) => {
    const { $from } = state.selection;
    // Find the nearest list_item ancestor.
    const listItemDepth = findAncestorDepthOfType(
        $from,
        schema.nodes.list_item,
    );

    if (listItemDepth === null) {
        // Not inside a list item; fallback to toggling list on the current block.
        return toggleList(type)(state, dispatch);
    }

    // Get the content positions within the list item
    const listItemStart = $from.start(listItemDepth);
    const listItemEnd = $from.end(listItemDepth);

    // Set selection to the current list item.
    const tr = state.tr.setSelection(
        new TextSelection(
            state.doc.resolve(listItemStart),
            state.doc.resolve(listItemEnd),
        ),
    );
    const newState = state.apply(tr);

    return sinkListItem(schema.nodes.list_item)(newState, dispatch);
};

/**
 * Handles list operations when there is a selection.
 *
 * @param state - The current editor state.
 * @param type - The type of list to toggle.
 * @param schema - The ProseMirror schema.
 * @param otherType - The other type of list to convert to.
 * @param dispatch - The dispatch function.
 * @returns A command for handling list operations when there is a selection.
 */
const handleListWithSelection = (
    state: EditorState,
    type: NodeType,
    schema: Schema,
    otherType: NodeType,
    dispatch: Dispatch,
) => {
    const { $from, $to } = state.selection;
    const listItemType = schema.nodes.list_item;
    const ancestorDepth = findAncestorDepthOfType($from, listItemType);

    // If an ancestor of type list_item is found, attempt to sink that list_item.
    if (ancestorDepth !== null) {
        if (sinkListItem(listItemType)(state, dispatch)) {
            return true;
        }
    }

    if (isInListOfType(state, type)) {
        return removeListNodes(state, type, schema, dispatch);
    }

    if (otherType && isInListOfType(state, otherType)) {
        return convertAllListNodes(state, otherType, type, dispatch);
    }

    const modifiedTr = state.tr.setSelection(new TextSelection($from, $to));
    const updatedState = state.apply(modifiedTr);

    return wrapInList(type)(updatedState, dispatch);
};

/**
 * Creates a command for toggling list types.
 *
 * @param schema - The ProseMirror schema.
 * @param listTypeName - The name of the list type to toggle.
 * @returns A command for toggling list types.
 */
export const createListCommand = (
    schema: Schema,
    listTypeName: string,
): CommandWithActive => {
    const type = schema.nodes[listTypeName];
    if (!type) {
        throw new Error(`List type "${listTypeName}" not found in schema`);
    }

    const command = (state, dispatch) => {
        const { $from, $to } = state.selection;
        const noSelection = $from === $to;
        // Get the other list type for the current list type
        // This is used to convert all list items to the other list type
        // when toggling list types
        const otherType = getOtherListType(schema, listTypeName);

        return noSelection
            ? handleListNoSelection(state, type, schema, dispatch)
            : handleListWithSelection(state, type, schema, otherType, dispatch);
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

    command.allowed = (state) => {};

    return command;
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
