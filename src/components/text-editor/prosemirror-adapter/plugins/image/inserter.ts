import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createFileInfo } from '../../../../../util/files';
import { FileInfo } from '../../../../../global/shared-types/file.types';
import { ImageInserter, EditorImageState } from '../../../text-editor.types';
import { Node, Slice, Fragment } from 'prosemirror-model';
import { ImageNodeAttrs } from './node';

export const pluginKey = new PluginKey('imageInserterPlugin');

type ImagePastedCallback = (data: ImageInserter) => CustomEvent<ImageInserter>;

export const createImageInserterPlugin = (
    imagePastedCallback: ImagePastedCallback,
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
    });
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

        const imageNodeAttrs = createImageNodeAttrs(
            base64Data,
            fileInfo,
            'loading',
        );
        const placeholderNode = schema.nodes.image.create(imageNodeAttrs);

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
                const imageNodeAttrs = createImageNodeAttrs(
                    src ? src : node.attrs.src,
                    fileInfo,
                    'success',
                );
                const imageNode = schema.nodes.image.create(imageNodeAttrs);

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
                const imageNodeAttrs = createImageNodeAttrs(
                    node.attrs.src,
                    fileInfo,
                    'failed',
                );
                const errorPlaceholderNode =
                    schema.nodes.image.create(imageNodeAttrs);

                tr.replaceWith(pos, pos + node.nodeSize, errorPlaceholderNode);

                return false;
            }
        });

        dispatch(tr);
    };

function createImageNodeAttrs(
    src: string,
    fileInfo: FileInfo,
    state: EditorImageState,
): ImageNodeAttrs {
    return {
        src: src,
        alt: fileInfo.filename,
        fileInfoId: fileInfo.id,
        state: state,
    };
}

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

    const isImageFilePasted = handlePastedImages(view, clipboardData);

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

    return isImageFilePasted;
};

/**
 * Processes any image files found in the clipboard data and dispatches an imagePasted event.
 *
 * @param view - The ProseMirror editor view
 * @param clipboardData - The clipboard data transfer object containing potential image files
 * @returns True if at least one valid image file was found and processed, false otherwise
 */
function handlePastedImages(
    view: EditorView,
    clipboardData: DataTransfer,
): boolean {
    let isImageFilePasted = false;
    const files = Array.from(clipboardData.files || []);

    for (const file of files) {
        if (isImageFile(file, clipboardData)) {
            isImageFilePasted = true;

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

    return isImageFilePasted;
}

/**
 * Determines if a file is an image that should be processed by the image handler.
 *
 * This function checks both the file's MIME type and the clipboard HTML content.
 * It filters out HTML content from Excel and HTML tables, as they are not relevant for image processing.
 *
 * @param file - The file object to check
 * @param clipboardData - The full clipboard data transfer object to examine for context
 * @returns True if the file is an image that should be processed, false otherwise
 */
function isImageFile(file: File, clipboardData: DataTransfer): boolean {
    if (!isContentTypeImage(file)) {
        return false;
    }

    const html = clipboardData?.getData('text/html')?.toLowerCase() ?? '';

    return !isHtmlFromExcel(html) && !isHtmlTable(html);
}

function isContentTypeImage(file: File): boolean {
    if (!file?.type) {
        return false;
    }

    return file.type.startsWith('image/');
}

function isHtmlFromExcel(html: string): boolean {
    if (!html) {
        return false;
    }

    return (
        html.includes('name=generator content="microsoft excel"') ||
        html.includes('xmlns:x="urn:schemas-microsoft-com:office:excel"')
    );
}

function isHtmlTable(html: string): boolean {
    if (!html) {
        return false;
    }

    return html.includes('<table');
}
