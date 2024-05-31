import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';
import { Schema, MarkType, NodeType, Attrs } from 'prosemirror-model';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { Command, EditorState, TextSelection } from 'prosemirror-state';
import { EditorMenuTypes, LevelMapping } from './types';

type CommandFunction = (
    schema: Schema,
    mark: EditorMenuTypes,
    url?: string,
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

const createToggleMarkCommand = (
    schema: Schema,
    markName: string,
    url?: string,
): CommandWithActive => {
    const markType: MarkType | undefined = schema.marks[markName];
    if (!markType) {
        throw new Error(`Mark "${markName}" not found in schema`);
    }

    const attrs = getAttributes(markName, url);

    const command: CommandWithActive = toggleMark(markType, attrs);
    setActiveMethodForMark(command, markType);

    return command;
};

const getAttributes = (markName: string, url: string): Attrs | null => {
    if (markName === EditorMenuTypes.Link && url) {
        return {
            href: url,
            target: isExternalLink(url) ? '_blank' : null,
        };
    }

    return undefined;
};

const isExternalLink = (url: string): boolean => {
    return !url.startsWith(window.location.origin);
};

const toggleBlockType = (schema, type, attrs = {}, wrap = false) => {
    const blockType = schema.nodes[type];
    const paragraphType = schema.nodes.paragraph;

    return (state, dispatch) => {
        const { $from, to } = state.selection;
        if (
            state.selection instanceof TextSelection &&
            $from.sameParent($from.doc.resolve(to))
        ) {
            if ($from.parent.type === blockType) {
                if (dispatch) {
                    dispatch(
                        state.tr.setBlockType($from.pos, to, paragraphType),
                    );
                }

                return true;
            } else {
                if (wrap) {
                    return wrapIn(blockType, attrs)(state, dispatch);
                } else {
                    return setBlockType(blockType, attrs)(state, dispatch);
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
        command = toggleBlockType(schema, LevelMapping.Heading, {
            level: level,
        });
    } else if (nodeType === EditorMenuTypes.CodeBlock) {
        command = toggleBlockType(schema, EditorMenuTypes.CodeBlock);
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
        command = toggleBlockType(schema, EditorMenuTypes.Blockquote, {}, true);
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
    listType: string,
): CommandWithActive => {
    const type: NodeType | undefined = schema.nodes[listType];
    if (!type) {
        throw new Error(`List type "${listType}" not found in schema`);
    }

    const command: CommandWithActive = toggleList(type);
    setActiveMethodForWrap(command, type);

    return command;
};

const commandMapping: CommandMapping = {
    strong: createToggleMarkCommand,
    em: createToggleMarkCommand,
    underline: createToggleMarkCommand,
    strikethrough: createToggleMarkCommand,
    code: createToggleMarkCommand,
    link: createToggleMarkCommand,
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

    public getCommand(mark: EditorMenuTypes, url?: string) {
        const commandFunc = commandMapping[mark];
        if (!commandFunc) {
            throw new Error(`The Mark "${mark}" is not supported`);
        }

        return commandFunc(this.schema, mark, url);
    }

    buildKeymap() {
        return {
            'Mod-B': this.getCommand(EditorMenuTypes.Bold),
            'Mod-I': this.getCommand(EditorMenuTypes.Italic),
            'Mod-Shift-1': this.getCommand(EditorMenuTypes.HeaderLevel1),
            'Mod-Shift-2': this.getCommand(EditorMenuTypes.HeaderLevel2),
            'Mod-Shift-3': this.getCommand(EditorMenuTypes.HeaderLevel3),
            'Mod-U': this.getCommand(EditorMenuTypes.Underline),
            'Mod-Shift-X': this.getCommand(EditorMenuTypes.Strikethrough),
            'Mod-`': this.getCommand(EditorMenuTypes.Code),
            'Mod-Shift-C': this.getCommand(EditorMenuTypes.CodeBlock),
        };
    }
}
