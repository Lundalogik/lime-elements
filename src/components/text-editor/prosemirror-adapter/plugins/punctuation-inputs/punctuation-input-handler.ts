import { EditorView } from 'prosemirror-view';
import {
    PERIOD,
    COMMA,
    SEMICOLON,
    EXCLAMATION,
    QUESTION,
} from 'src/util/keycodes';

export const punctuationKeys = [PERIOD, COMMA, SEMICOLON, EXCLAMATION, QUESTION];

const shiftedPunctuationKeys = {
    '!': EXCLAMATION, // Shift + 1
    '?': QUESTION, // Shift + /
};

/**
 * This function handles the case where the user types any punctuation character.
 * If there is a blank space before the punctuation character, it will replace the space with the punctuation character.
 *
 * @param view - The ProseMirror view instance.
 * @param event - The event object associated with the key press.
 * @returns {boolean} - Returns true if the replacement was made, otherwise false.
 */
export const handlePunctuationInput = (
    view: EditorView,
    event: KeyboardEvent,
) => {
    if (!punctuationKeys.includes(event.key)) {
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

    let key = event.key;
    if (event.shiftKey && shiftedPunctuationKeys[event.key]) {
        key = shiftedPunctuationKeys[event.key];
    }

    if (prevChar === ' ') {
        tr.delete(prevPos, $from.pos);
        dispatch(tr);

        return true;
    }

    return false;
};
