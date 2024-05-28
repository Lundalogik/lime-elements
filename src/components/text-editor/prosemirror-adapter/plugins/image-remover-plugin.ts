import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Slice, Fragment, Node } from 'prosemirror-model';

export const pluginKey = new PluginKey('imageRemoverPlugin');

export const createImageRemoverPlugin = () => {
    return new Plugin({
        key: pluginKey,
        props: {
            handlePaste: (view, event, slice) => {
                return processPasteEvent(view, event, slice);
            },
        },
    });
};

/**
 * Check if a given ProseMirror node or fragment contains any image nodes.
 * @param node - The ProseMirror node or fragment to check.
 * @returns A boolean indicating whether the node contains any image nodes.
 */
const isImageNode = (node: Node | Fragment): boolean => {
    if (node instanceof Node) {
        if (node.type.name === 'image') {
            return true;
        }

        let found = false;
        node.content.forEach((child) => {
            if (isImageNode(child)) {
                found = true;
            }
        });

        return found;
    } else if (node instanceof Fragment) {
        let found = false;
        node.forEach((child) => {
            if (isImageNode(child)) {
                found = true;
            }
        });

        return found;
    }

    return false;
};

/**
 * Filter out image nodes from a ProseMirror fragment.
 * @param fragment - The ProseMirror fragment to filter.
 * @returns A new fragment with image nodes removed.
 */
const filterImageNodes = (fragment: Fragment): Fragment => {
    const filteredChildren: Node[] = [];

    fragment.forEach((child) => {
        if (!isImageNode(child)) {
            if (child.content.size > 0) {
                const filteredContent = filterImageNodes(child.content);
                const newNode = child.copy(filteredContent);
                filteredChildren.push(newNode);
            } else {
                filteredChildren.push(child);
            }
        }
    });

    return Fragment.fromArray(filteredChildren);
};

const processPasteEvent = (
    view: EditorView,
    event: ClipboardEvent,
    slice: Slice,
): boolean => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
        return false;
    }

    const filteredSlice = new Slice(
        filterImageNodes(slice.content),
        slice.openStart,
        slice.openEnd,
    );

    if (filteredSlice.content.childCount < slice.content.childCount) {
        const { state, dispatch } = view;
        const tr = state.tr.replaceSelection(filteredSlice);
        dispatch(tr);

        return true;
    }

    return false;
};
