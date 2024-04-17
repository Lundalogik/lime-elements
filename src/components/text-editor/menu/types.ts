/**
 * The `EditorButton` type is used to specify the type of buttons that can be used in the editor toolbar.
 * Each string represents a different button that can be added to the toolbar.
 *
 * The following buttons are available:
 * 'strong' - Button for making text bold.
 * 'emphasis' - Button for italicizing text.
 * 'link' - Button for adding a hyperlink.
 * 'heading 1 - Button for creating a level 1 heading.
 * 'heading 2 - Button for creating a level 2 heading.
 * 'heading 3 - Button for creating a level 3 heading.
 * 'heading 4 - Button for creating a level 4 heading.
 * 'heading 5 - Button for creating a level 5 heading.
 * 'heading 6 - Button for creating a level 6 heading.
 * 'block quote' - Button for creating a block quote.
 *
 * @beta
 */
export type EditorButton =
    | 'strong'
    | 'emphasis'
    | 'link'
    | 'heading 1'
    | 'heading 2'
    | 'heading 3'
    | 'heading 4'
    | 'heading 5'
    | 'heading 6'
    | 'block quote'
    | 'bullet list'
    | 'ordered list'
    | EditorPluginButton;

/**
 * The `EditorPluginButton` type is used to specify the type of buttons that can be added to the editor toolbar.
 *
 * 'code' - Button for marking inline code.
 * 'horizontal rule' - Button for inserting a horizontal rule.
 * 'code block' - Button for creating a block of code.
 * 'paragraph'- Button for creating a new paragraph.
 * 'join above' - Button for joining the current block with the one above it.
 * 'lift out' - Button for lifting the current block out of its parent block.
 * 'undo' - Button for undoing the last action.
 * 'redo' - Button for redoing the last undone action.
 *
 * @beta
 */
export type EditorPluginButton =
    | 'code'
    | 'horizontal rule'
    | 'code block'
    | 'paragraph'
    | 'join above'
    | 'lift out'
    | 'undo'
    | 'redo';
