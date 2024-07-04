/**
 * The `EditorMenuType` type is used to specify the type of menu items that can be added to the editor toolbar.
 * Each one represents a different type to be used for creating the prosemirror commands relevant to the button.
 * The values correspond to the types that can be used with the `prosemirror-commands` library.
 * @beta
 */

export const EditorMenuTypes = {
    Bold: 'strong',
    Italic: 'em',
    Blockquote: 'blockquote',
    HeaderLevel1: 'headerlevel1',
    HeaderLevel2: 'headerlevel2',
    HeaderLevel3: 'headerlevel3',
    Link: 'link',
    OrderedList: 'ordered_list',
    BulletList: 'bullet_list',
    Strikethrough: 'strikethrough',
    Code: 'code',
    CodeBlock: 'code_block',
};

export type EditorMenuTypes =
    (typeof EditorMenuTypes)[keyof typeof EditorMenuTypes];

export const editorMenuTypesArray: EditorMenuTypes[] = Object.values(
    EditorMenuTypes,
) as EditorMenuTypes[];

/**
 * `LevelMapping` is used to map string identifiers to numerical header levels.
 * It provides a way to represent different levels of headings in ProseMirror commands.
 *
 * The `Heading` identifier is not a valid level and is used to identify the node type.
 * The numerical values are used for creating ProseMirror commands to set the level of a heading node in the editor.
 * @beta
 */
export const LevelMapping = {
    Heading: 'heading',
    one: 1,
    two: 2,
    three: 3,
};

export type LevelMapping = (typeof LevelMapping)[keyof typeof LevelMapping];

export type ProseMirrorAdapterElementWithFocus =
    HTMLLimelProsemirrorAdapterElement & {
        setFocus: () => void;
    };

/**
 * The `EditorTextLink` type is used to represent a link in the editor.
 * @beta
 * @private
 */
export type EditorTextLink = {
    text?: string;
    href: string;
};

/**
 * The `MouseButtons` type is used to represent the different mouse buttons.
 * The values correspond to the button codes used in the `MouseEvent` interface.
 * @beta
 */
export const MouseButtons = {
    Left: 0,
    Middle: 1,
    Right: 2,
};

export type MouseButtons = (typeof MouseButtons)[keyof typeof MouseButtons];
