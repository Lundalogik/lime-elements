import { Command, EditorState, Transaction } from 'prosemirror-state';
import { isExternalLink } from '../menu-commands';

export const isValidUrl = (text: string): boolean => {
    try {
        new URL(text);
    } catch {
        return false;
    }

    return true;
};

export const copyPasteLinkCommand: Command = (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
) => {
    const { from, to } = state.selection;
    if (from === to) {
        return false;
    }

    const clipboardData = (window as any).clipboardData;
    if (!clipboardData) {
        return false;
    }

    const copyPastedText = clipboardData.getData('text');
    if (!isValidUrl(copyPastedText)) {
        return false;
    }

    const linkMark = state.schema.marks.link.create({
        href: copyPastedText,
        target: isExternalLink(copyPastedText) ? '_blank' : null,
    });

    const selectedText = state.doc.textBetween(from, to, ' ');
    const newLink = state.schema.text(selectedText, [linkMark]);
    dispatch(state.tr.replaceWith(from, to, newLink));
};
