import {
    chainCommands,
    exitCode,
    joinDown,
    joinUp,
    lift,
    selectParentNode,
    setBlockType,
    toggleMark,
    wrapIn,
} from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Schema, MarkType, NodeType, Attrs } from 'prosemirror-model';
import {
    splitListItem,
    liftListItem,
    sinkListItem,
} from 'prosemirror-schema-list';
import { Command, EditorState, TextSelection } from 'prosemirror-state';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { EditorMenuTypes, EditorTextLink, LevelMapping } from './types';
import { getLinkAttributes } from '../plugins/link/utils';

type CommandFunction = (
    schema: Schema,
    mark: EditorMenuTypes,
    link?: EditorTextLink
) => CommandWithActive;

interface CommandMapping {
    [key: string]: CommandFunction;
}

export interface CommandWithActive extends Command {
    active?: (state: EditorState) => boolean;
    allowed?: (state: EditorState) => boolean;
}

const setActiveMethodForMark = (
    command: CommandWithActive,
    markType: MarkType
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
    level?: number
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
    nodeType: NodeType
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
    link?: EditorTextLink
): CommandWithActive => {
    const command: Command = (state, dispatch) => {
        const { from, to } = state.selection;
        const linkMark = schema.marks.link.create(
            getLinkAttributes(link.href, link.href)
        );

        if (from === to) {
            // If no text is selected, insert new text with link
            const linkText = link.text || link.href;
            const newLink = schema.text(linkText, [linkMark]);
            dispatch(state.tr.insert(from, newLink));
        } else {
            // If text is selected, replace selected text with link text
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
    link?: EditorTextLink
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
    link: EditorTextLink
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
    shouldWrap: boolean = false
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
                        state.tr.setBlockType($from.pos, $to.pos, paragraphType)
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
    level?: number
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
    nodeType: string
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

const createListCommand = (
    schema: Schema,
    listType: string
): CommandWithActive => {
    const type: NodeType | undefined = schema.nodes[listType];
    if (!type) {
        throw new Error(`List type "${listType}" not found in schema`);
    }

    const command: CommandWithActive = toggleList(type);
    setActiveMethodForWrap(command, type);

    return command;
};

const createSplitListItemCommand = (schema: Schema): CommandWithActive => {
    const type = schema.nodes.list_item;

    return splitListItem(type);
};

const createLiftListItemCommand = (schema: Schema): CommandWithActive => {
    const type = schema.nodes.list_item;

    return liftListItem(type);
};

const createSinkListItemCommand = (schema: Schema): CommandWithActive => {
    const type = schema.nodes.list_item;

    return sinkListItem(type);
};

const createHardBreakCommand = (schema: Schema): CommandWithActive => {
    const br = schema.nodes.hard_break;

    return chainCommands(exitCode, (state, dispatch) => {
        if (dispatch) {
            dispatch(
                state.tr.replaceSelectionWith(br.create()).scrollIntoView()
            );
        }

        return true;
    });
};

const createHorizontalRuleCommand = (schema: Schema): CommandWithActive => {
    const hr = schema.nodes.horizontal_rule;

    return (state, dispatch) => {
        if (dispatch) {
            dispatch(
                state.tr.replaceSelectionWith(hr.create()).scrollIntoView()
            );
        }

        return true;
    };
};

const createWrapInNodeCommand = (
    schema: Schema,
    nodeType: string
): CommandWithActive => {
    const type = schema.nodes[nodeType];

    return wrapIn(type);
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
            LevelMapping.one
        ),
    headerlevel2: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.two
        ),
    headerlevel3: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.three
        ),
    headerlevel4: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.four
        ),
    headerlevel5: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.five
        ),
    headerlevel6: (schema) =>
        createSetNodeTypeCommand(
            schema,
            LevelMapping.Heading,
            LevelMapping.six
        ),
    blockquote: (schema) =>
        createWrapInCommand(schema, EditorMenuTypes.Blockquote),
    code_block: (schema) =>
        createSetNodeTypeCommand(schema, EditorMenuTypes.CodeBlock),
    paragraph: (schema) =>
        createSetNodeTypeCommand(schema, EditorMenuTypes.Paragraph),
    ordered_list: (schema) =>
        createListCommand(schema, EditorMenuTypes.OrderedList),
    bullet_list: (schema) =>
        createListCommand(schema, EditorMenuTypes.BulletList),
    split_list_item: (schema) => createSplitListItemCommand(schema),
    lift_list_item: (schema) => createLiftListItemCommand(schema),
    sink_list_item: (schema) => createSinkListItemCommand(schema),
    hard_break: (schema) => createHardBreakCommand(schema),
    horizontal_rule: (schema) => createHorizontalRuleCommand(schema),
    wrap_bullet_list: (schema) =>
        createWrapInNodeCommand(schema, 'bullet_list'),
    wrap_ordered_list: (schema) =>
        createWrapInNodeCommand(schema, 'ordered_list'),
    wrap_blockquote: (schema) => createWrapInNodeCommand(schema, 'blockquote'),
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

    buildKeymap(): { [key: string]: Command } {
        return {
            // History
            'Mod-z': undo,
            'Shift-Mod-z': redo,
            Backspace: undoInputRule,

            // Navigation
            'Alt-ArrowUp': joinUp,
            'Alt-ArrowDown': joinDown,
            'Mod-BracketLeft': lift,
            Escape: selectParentNode,

            // Mark toggles
            'Mod-b': this.getCommand(EditorMenuTypes.Bold),
            'Mod-B': this.getCommand(EditorMenuTypes.Bold),
            'Mod-i': this.getCommand(EditorMenuTypes.Italic),
            'Mod-I': this.getCommand(EditorMenuTypes.Italic),
            'Mod-`': this.getCommand(EditorMenuTypes.Code),
            'Mod-Shift-x': this.getCommand(EditorMenuTypes.Strikethrough),
            'Mod-Shift-X': this.getCommand(EditorMenuTypes.Strikethrough),

            // Block types (Mod-Shift)
            'Mod-Shift-1': this.getCommand(EditorMenuTypes.HeaderLevel1),
            'Mod-Shift-2': this.getCommand(EditorMenuTypes.HeaderLevel2),
            'Mod-Shift-3': this.getCommand(EditorMenuTypes.HeaderLevel3),
            'Mod-Shift-c': this.getCommand(EditorMenuTypes.CodeBlock),
            'Mod-Shift-C': this.getCommand(EditorMenuTypes.CodeBlock),

            // Block types (Shift-Ctrl)
            'Shift-Ctrl-0': this.getCommand(EditorMenuTypes.Paragraph),
            'Shift-Ctrl-1': this.getCommand(EditorMenuTypes.HeaderLevel1),
            'Shift-Ctrl-2': this.getCommand(EditorMenuTypes.HeaderLevel2),
            'Shift-Ctrl-3': this.getCommand(EditorMenuTypes.HeaderLevel3),
            'Shift-Ctrl-4': this.getCommand(EditorMenuTypes.HeaderLevel4),
            'Shift-Ctrl-5': this.getCommand(EditorMenuTypes.HeaderLevel5),
            'Shift-Ctrl-6': this.getCommand(EditorMenuTypes.HeaderLevel6),
            'Shift-Ctrl-\\': this.getCommand(EditorMenuTypes.CodeBlock),

            // List operations
            Enter: this.getCommand(EditorMenuTypes.SplitListItem),
            'Mod-[': this.getCommand(EditorMenuTypes.LiftListItem),
            'Mod-]': this.getCommand(EditorMenuTypes.SinkListItem),
            'Shift-Ctrl-8': this.getCommand(EditorMenuTypes.WrapInBulletList),
            'Shift-Ctrl-9': this.getCommand(EditorMenuTypes.WrapInOrderedList),

            // Wrapping
            'Ctrl->': this.getCommand(EditorMenuTypes.WrapInBlockquote),

            // Insertions
            'Mod-Enter': this.getCommand(EditorMenuTypes.HardBreak),
            'Shift-Enter': this.getCommand(EditorMenuTypes.HardBreak),
            'Mod-_': this.getCommand(EditorMenuTypes.HorizontalRule),
        };
    }
}
