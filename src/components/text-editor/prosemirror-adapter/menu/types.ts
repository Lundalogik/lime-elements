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
    Heading: 'heading',
    HeaderLevel1: 'headerlevel1',
    HeaderLevel2: 'headerlevel2',
    HeaderLevel3: 'headerlevel3',
    Link: 'link',
    OrderedList: 'ordered_list',
    BulletList: 'bullet_list',
};

export type EditorMenuTypes =
    (typeof EditorMenuTypes)[keyof typeof EditorMenuTypes];

/**
 * `LevelMapping` is used to map string identifiers to numerical header levels.
 * Each one represents a different level to be used for creating the prosemirror commands
 * to set the level of a heading node in the editor.
 * @beta
 */

export const LevelMapping = {
    one: 1,
    two: 2,
    three: 3,
};

export type LevelMapping = (typeof LevelMapping)[keyof typeof LevelMapping];

export type ProseMirrorAdapterElementWithFocus =
    HTMLLimelProsemirrorAdapterElement & {
        setFocus: () => void;
    };
