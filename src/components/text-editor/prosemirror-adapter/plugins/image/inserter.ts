import { Plugin, PluginKey, Transaction, StateField } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createFileInfo } from '../../../../../util/files';
import { FileInfo } from '../../../../../global/shared-types/file.types';
import {
    ImageInserter,
    ImageInfo,
    ImageState,
} from '../../../text-editor.types';
import { Node, Slice, Fragment } from 'prosemirror-model';
import { imageCache } from './node';

export const pluginKey = new PluginKey('imageInserterPlugin');

type ImagePastedCallback = (data: ImageInserter) => CustomEvent<ImageInserter>;

type ImageRemovedCallback = (data: ImageInfo) => CustomEvent<ImageInfo>;

type PluginState = {
    insertedImages: Record<string, Node>;
};

export const createImageInserterPlugin = (
    imagePastedCallback: ImagePastedCallback,
    imageRemovedCallback: ImageRemovedCallback,
) => {
    return new Plugin({
        key: pluginKey,
        props: {
            handlePaste: (view, event, slice) => {
                return processPasteEvent(view, event, slice);
            },
            handleDOMEvents: {
                imagePasted: (_, event) => {
                    imagePastedCallback(event.detail);
                },
            },
        },
        state: {
            init: (): PluginState => {
                return { insertedImages: {} };
            },
            apply: (tr, pluginState): PluginState => {
                const newState = { ...pluginState };

                newState.insertedImages = getImagesFromTransaction(tr);
                findAndHandleRemovedImages(
                    imageRemovedCallback,
                    pluginState.insertedImages,
                    newState.insertedImages,
                );

                return newState;
            },
        } as StateField<PluginState>,
    });
};

const getImagesFromTransaction = (tr: Transaction): Record<string, Node> => {
    const images: Record<string, Node> = {};
    tr.doc.descendants((node) => {
        if (node.type.name === 'image') {
            images[node.attrs.fileInfoId] = node;
        }
    });

    return images;
};

const findAndHandleRemovedImages = (
    imageRemovedCallback: ImageRemovedCallback,
    previousImages: Record<string, Node>,
    newImages: Record<string, Node>,
) => {
    const removedKeys = Object.keys(previousImages).filter(
        (key) => !(key in newImages),
    );

    for (const removedKey of removedKeys) {
        const removedImage = previousImages[removedKey];
        const imageInfo: ImageInfo = {
            fileInfoId: removedImage.attrs.fileInfoId,
            src: removedImage.attrs.src,
            state: removedImage.attrs.state,
        };
        imageRemovedCallback(imageInfo);

        imageCache.delete(removedImage.attrs.fileInfoId);
    }
};

export const imageInserterFactory = (
    view: EditorView,
    base64Data: string,
    fileInfo: FileInfo,
): ImageInserter => {
    return {
        fileInfo: fileInfo,
        insertThumbnail: createThumbnailInserter(view, base64Data, fileInfo),
        insertImage: createImageInserter(view, fileInfo),
        insertFailedThumbnail: createFailedThumbnailInserter(view, fileInfo),
    };
};

const createThumbnailInserter =
    (view: EditorView, base64Data: string, fileInfo: FileInfo) => () => {
        const { state, dispatch } = view;
        const { schema } = state;

        const placeholderNode = schema.nodes.image.create({
            src: base64Data,
            alt: fileInfo.filename,
            fileInfoId: fileInfo.id,
            state: ImageState.LOADING,
        });

        const transaction = state.tr.replaceSelectionWith(placeholderNode);

        dispatch(transaction);
    };

const createImageInserter =
    (view: EditorView, fileInfo: FileInfo) => (src?: string) => {
        const { state, dispatch } = view;
        const { schema } = state;

        const tr = state.tr;
        state.doc.descendants((node, pos) => {
            if (node.attrs.fileInfoId === fileInfo.id) {
                const imageNode = schema.nodes.image.create({
                    src: src ? src : node.attrs.src,
                    alt: fileInfo.filename,
                    fileInfoId: fileInfo.id,
                    state: ImageState.SUCCESS,
                });

                tr.replaceWith(pos, pos + node.nodeSize, imageNode);

                return false;
            }
        });

        dispatch(tr);
    };

const createFailedThumbnailInserter =
    (view: EditorView, fileInfo: FileInfo) => () => {
        const { state, dispatch } = view;
        const { schema } = state;

        const tr = state.tr;
        state.doc.descendants((node, pos) => {
            if (node.attrs.fileInfoId === fileInfo.id) {
                const errorPlaceholderNode = schema.nodes.image.create({
                    src: node.attrs.src,
                    alt: fileInfo.filename,
                    fileInfoId: fileInfo.id,
                    state: ImageState.FAILED,
                });

                tr.replaceWith(pos, pos + node.nodeSize, errorPlaceholderNode);

                return false;
            }
        });

        dispatch(tr);
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

/**
 * Process a paste event and trigger an imagePasted event if an image file is pasted.
 * If an HTML image element is pasted, this image is filtered out from the slice content.
 *
 * @param view - The ProseMirror editor view.
 * @param event - The paste event.
 * @returns A boolean; True if an image file was pasted to prevent default paste behavior, otherwise false.
 */
const processPasteEvent = (
    view: EditorView,
    event: ClipboardEvent,
    slice: Slice,
): boolean => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
        return false;
    }

    const files = Array.from(clipboardData.files || []);
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                view.dom.dispatchEvent(
                    new CustomEvent('imagePasted', {
                        detail: imageInserterFactory(
                            view,
                            reader.result as string,
                            createFileInfo(file),
                        ),
                    }),
                );
            };

            reader.readAsDataURL(file);
        }
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

    return files.length > 0;
};
