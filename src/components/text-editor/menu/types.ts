/**
 * The `EditorButton` type is used to specify the type of buttons that can be used in the editor toolbar.
 * Each string represents a different button that can be added to the toolbar.
 *
 * The following buttons are available:
 * 'strong' - Button for making text bold.
 * 'emphasis' - Button for italicizing text.
 * 'code' - Button for marking inline code.
 * 'link' - Button for adding a hyperlink.
 * 'horizontal rule' - Button for inserting a horizontal rule.
 * 'paragraph'- Button for creating a new paragraph.
 * 'code block' - Button for creating a block of code.
 * 'heading 1 - Button for creating a level 1 heading.
 * 'heading 2 - Button for creating a level 2 heading.
 * 'heading 3 - Button for creating a level 3 heading.
 * 'heading 4 - Button for creating a level 4 heading.
 * 'heading 5 - Button for creating a level 5 heading.
 * 'heading 6 - Button for creating a level 6 heading.
 * 'undo' - Button for undoing the last action.
 * 'redo' - Button for redoing the last undone action.
 * 'block quote' - Button for creating a block quote.
 * 'join above' - Button for joining the current block with the one above it.
 * 'lift out' - Button for lifting the current block out of its parent block.
 */
export type EditorButton =
    | 'strong'
    | 'emphasis'
    | 'code'
    | 'link'
    | 'horizontal rule'
    | 'paragraph'
    | 'code block'
    | 'heading 1'
    | 'heading 2'
    | 'heading 3'
    | 'heading 4'
    | 'heading 5'
    | 'heading 6'
    | 'undo'
    | 'redo'
    | 'block quote'
    | 'join above'
    | 'lift out';
