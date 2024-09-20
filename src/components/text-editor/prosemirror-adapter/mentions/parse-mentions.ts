import { Schema, Fragment, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

/**
 * Processes text nodes to find mentions and creates a transaction to replace text with mention nodes.
 * @param state - The current editor state.
 * @param schema - The ProseMirror schema used to create mention nodes.
 * @returns - A transaction if changes are made, or null if no changes are needed.
 */
export const createMentionParseTransaction = (
    state: EditorState,
    schema: Schema,
) => {
    const transaction = state.tr;
    const regex = /@([^:]+):(\w+):(\w+)/g;
    let madeChanges = false;

    state.doc.descendants((node, pos) => {
        if (!node.isText) {
            return;
        }

        const text = node.text;
        let lastMatchEnd = 0;
        const fragments = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [fullMatch, name, type, id] = match;
            const offset = match.index;

            // Add text before the match
            if (offset > lastMatchEnd) {
                fragments.push(node.cut(lastMatchEnd, offset));
            }

            // Create and add the mention node
            const mentionNode = schema.nodes.mention.create({
                name: name,
                type: type,
                id: id,
            });
            fragments.push(mentionNode);

            lastMatchEnd = offset + fullMatch.length;
        }

        // Add any remaining text after the last match
        if (lastMatchEnd < text.length) {
            fragments.push(node.cut(lastMatchEnd));
        }

        if (fragments.length) {
            const newFragments = Fragment.fromArray(fragments);
            transaction.replaceRange(
                pos,
                pos + node.nodeSize,
                new Slice(newFragments, 0, 0),
            );
            madeChanges = true;
        }
    });

    return madeChanges ? transaction : null;
};
