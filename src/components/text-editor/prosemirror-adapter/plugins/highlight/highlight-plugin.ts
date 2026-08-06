import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { MarkType } from 'prosemirror-model';

export const highlightPluginKey = new PluginKey('highlightPlugin');

export type UpdateHighlightCallback = (color: string | null) => void;

/**
 * Gets the color of the highlight mark at the current selection.
 *
 * For a caret, the stored marks (or the marks at the caret) are checked; for
 * a range, the first highlighted text node within the range wins.
 *
 * @param state - the editor state to inspect
 * @returns the highlight color, or `null` when the selection carries no
 * highlight mark
 */
export const getSelectionHighlightColor = (
    state: EditorState
): string | null => {
    const markType: MarkType | undefined = state.schema.marks.highlight;
    if (!markType) {
        return null;
    }

    const { empty, from, to, $from } = state.selection;
    if (empty) {
        const mark = markType.isInSet(state.storedMarks || $from.marks());

        return mark ? mark.attrs.color : null;
    }

    let color: string | null = null;
    state.doc.nodesBetween(from, to, (node) => {
        if (color !== null) {
            return false;
        }

        const mark = markType.isInSet(node.marks);
        if (mark) {
            color = mark.attrs.color;
        }
    });

    return color;
};

/**
 * Creates the highlight plugin.
 *
 * Reports the highlight color at the current selection after every editor
 * update, so that the highlight color menu can be pre-filled with the color
 * the caret or selection is on.
 *
 * @param updateHighlightCallback - called with the selection's highlight
 * color, or `null` when the selection carries no highlight mark
 * @returns the configured plugin
 */
export const createHighlightPlugin = (
    updateHighlightCallback?: UpdateHighlightCallback
) => {
    return new Plugin({
        key: highlightPluginKey,
        view: () => ({
            update: (view) => {
                updateHighlightCallback?.(
                    getSelectionHighlightColor(view.state)
                );
            },
        }),
    });
};
