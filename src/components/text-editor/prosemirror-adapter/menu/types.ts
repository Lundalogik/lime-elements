/**
 * The `EditorMenuType` type is used to specify the type of menu items that can be added to the editor toolbar.
 * Each one represents a different type to be used for creating the prosemirror commands relevant to the button.
 * The values correspond to the types that can be used with the `prosemirror-commands` library.
 * @beta
 */

export enum EditorMenuTypes {
    Strong = 'strong',
    Italic = 'em',
    Blockquote = 'blockquote',
    HeaderLevel1 = 'headerlevel1',
    HeaderLevel2 = 'headerlevel2',
    HeaderLevel3 = 'headerlevel3',
    Link = 'link',
    OrderedList = 'ordered_list',
    BulletList = 'bullet_list',
}

export const levelMapping = {
    one: 1,
    two: 2,
    three: 3,
};

export type ProseMirrorAdapterElementWithFocus =
    HTMLLimelProsemirrorAdapterElement & {
        setFocus: () => void;
    };
