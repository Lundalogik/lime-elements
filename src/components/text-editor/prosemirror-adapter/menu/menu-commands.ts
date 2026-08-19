import { toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { Schema, MarkType, NodeType, Attrs } from 'prosemirror-model';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';
import {
    AllSelection,
    Command,
    EditorState,
    TextSelection,
} from 'prosemirror-state';
import { EditorMenuTypes, EditorTextLink, LevelMapping } from './types';
import { getLinkAttributes } from '../plugins/link/utils';
import {
    setActiveMethodForMark,
    setActiveMethodForNode,
    setActiveMethodForWrap,
} from './menu-command-utils/active-state-utils';
import {
    resolveListContext,
    convertInnermostList,
    joinAdjacentListsOnDispatch,
    selectionHasNonListableBlock,
    unifyToList,
} from './menu-command-utils/list-utils';

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

        if (
            state.selection instanceof TextSelection &&
            // Ensure selection is within the same parent block
            // We don't want toggling block types across multiple blocks
            $from.sameParent($from.doc.resolve($to.pos))
        ) {
            // Resolved only under the TextSelection guard: an AllSelection
            // resolves at depth 0, where there is no parent node to read.
            const hasActiveWrap = $from.node($from.depth - 1).type === nodeType;
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

// Select-all produces an AllSelection, whose endpoints resolve at the
// document level where list commands cannot operate. Re-anchoring it as
// a TextSelection over the same content lets the list ladder (and the
// delegated prosemirror-schema-list commands) treat select-all like any
// other full-content selection.
const withTextSelection = (state: EditorState): EditorState => {
    if (!(state.selection instanceof AllSelection)) {
        return state;
    }

    const selection = TextSelection.between(
        state.doc.resolve(0),
        state.doc.resolve(state.doc.content.size)
    );

    // A plugin-free scratch state on the shared doc: only feed it
    // commands driven by doc and selection.
    return EditorState.create({
        doc: state.doc,
        selection: selection,
        storedMarks: state.storedMarks,
    });
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
    listTypeName: string
): CommandWithActive => {
    const type = schema.nodes[listTypeName];
    if (!type) {
        throw new Error(`List type "${listTypeName}" not found in schema`);
    }

    const itemType = schema.nodes.list_item;
    if (!itemType) {
        throw new Error('Node type "list_item" not found in schema');
    }

    // The keymap invokes the command directly, so the command body applies
    // the same applicability rules as `allowed` to keep keyboard and
    // toolbar behavior identical.
    const command: CommandWithActive = (state, dispatch) => {
        state = withTextSelection(state);
        if (!(state.selection instanceof TextSelection)) {
            return false;
        }

        const context = resolveListContext(state, type);

        if (context.kind === 'same-type') {
            return liftListItem(itemType)(state, dispatch);
        }

        if (context.kind === 'other-type') {
            return convertInnermostList(
                state,
                context.listDepth,
                type,
                dispatch
            );
        }

        if (context.kind === 'no-list') {
            // For a single block the schema decides, through the wrap
            // command itself; multi-block selections keep the stricter
            // gate so unify cannot half-apply.
            if (!context.singleBlock && selectionHasNonListableBlock(state)) {
                return false;
            }

            return wrapInList(type)(
                state,
                joinAdjacentListsOnDispatch(state, type, dispatch)
            );
        }

        if (selectionHasNonListableBlock(state)) {
            return false;
        }

        return unifyToList(state, type, dispatch);
    };

    command.allowed = (state) => {
        state = withTextSelection(state);
        if (!(state.selection instanceof TextSelection)) {
            return false;
        }

        const context = resolveListContext(state, type);

        // Inside a list, toggling or converting is always applicable, even
        // when a non-listable ancestor wraps the list.
        if (context.kind === 'same-type' || context.kind === 'other-type') {
            return true;
        }

        if (context.kind === 'no-list' && context.singleBlock) {
            return wrapInList(type)(state);
        }

        return !selectionHasNonListableBlock(state);
    };

    setActiveMethodForWrap(command, type);

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
    blockquote: (schema) =>
        createWrapInCommand(schema, EditorMenuTypes.Blockquote),

    code_block: (schema) =>
        createSetNodeTypeCommand(schema, EditorMenuTypes.CodeBlock),
    ordered_list: (schema) =>
        createListCommand(schema, EditorMenuTypes.OrderedList),
    bullet_list: (schema) =>
        createListCommand(schema, EditorMenuTypes.BulletList),
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
            'Mod-Shift-7': this.getCommand(EditorMenuTypes.OrderedList),
            'Mod-Shift-8': this.getCommand(EditorMenuTypes.BulletList),
            'Mod-Shift-X': this.getCommand(EditorMenuTypes.Strikethrough),
            'Mod-`': this.getCommand(EditorMenuTypes.Code),
            'Mod-Shift-C': this.getCommand(EditorMenuTypes.CodeBlock),
        };
    }
}
