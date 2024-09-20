import { EditorView } from 'prosemirror-view';

/**
 * Handles the input of a full stop (period) in a ProseMirror editor. This function is designed to specifically
 * check if the previous node is a mention node. Expected behaviour while type when adding a mention is to add a
 * blank space when a user hits 'tab' for example. This function handles the case where the user types
 * a full stop after adding a mention, and automatically replaces the blank space with the full stop.
 *
 * @param view - The ProseMirror view instance.
 * @param event - The event object associated with the key press.
 * @returns {boolean} - Returns true if the replacement was made, otherwise false.
 */
export const handleFullStopInput = (view: EditorView, event: KeyboardEvent) => {
    if (event.key !== '.') {
        return false;
    }

    const { state, dispatch } = view;
    const { selection, tr } = state;
    const { $from } = selection;
    const characterCountBack = 2;

    if ($from.pos < characterCountBack) {
        return false;
    }

    const prevPos = $from.pos - 1;
    const prevChar = state.doc.textBetween(prevPos, $from.pos, 'text');

    if (prevChar !== ' ') {
        return false;
    }

    const textNodePos = prevPos - 1;
    const nodeBeforeSpace = $from.doc.nodeAt(textNodePos);

    if (!nodeBeforeSpace || nodeBeforeSpace.type.name !== 'mention') {
        return false;
    }

    const replacementTransaction = tr.replaceWith(
        textNodePos + 1,
        $from.pos,
        state.schema.text('.'),
    );
    dispatch(replacementTransaction);

    return true;
};
