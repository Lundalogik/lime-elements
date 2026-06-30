import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createFileInfo } from '../../../../../util/files';
import { FileInfo } from '../../../../../global/shared-types/file.types';
import {
    ImageInserter,
    EditorImageState,
    InlineImages,
    isInlineImageTag,
} from '../../../text-editor.types';
import { Node, Slice, Fragment } from 'prosemirror-model';
import { ImageNodeAttrs } from './node';

export const pluginKey = new PluginKey('imageInserterPlugin');

type ImagePastedCallback = (data: ImageInserter) => CustomEvent<ImageInserter>;

export const createImageInserterPlugin = (
    imagePastedCallback: ImagePastedCallback,
    inlineImages?: InlineImages
) => {
    return new Plugin({
        key: pluginKey,
        props: {
            handlePaste: (view, event, slice) => {
                return processPasteEvent(view, event, slice, inlineImages);
            },
            handleDOMEvents: {
                imagePasted: (_, event) => {
                    imagePastedCallback(event.detail);
                },
            },
        },
    });
};

/**
 * Runs the inline-image upload lifecycle: show a thumbnail, run the upload,
 * then replace it with the resizable image (carrying the file id) or a failed
 * state.
 * @param view
 * @param file
 * @param base64Data
 * @param fileInfo
 * @param inlineImages
 */
const runInlineImageUpload = async (
    view: EditorView,
    file: File,
    base64Data: string,
    fileInfo: FileInfo,
    inlineImages: InlineImages
): Promise<void> => {
    const upload = inlineImages.upload;
    if (!upload) {
        return;
    }

    const inserter = imageInserterFactory(view, base64Data, fileInfo);
    inserter.insertThumbnail();

    try {
        const uploadResult = await upload(file);
        replaceThumbnailWithInlineImage(
            view,
            fileInfo,
            uploadResult,
            inlineImages
        );
    } catch (error) {
        console.error('Inline image upload failed', error);
        inserter.insertFailedThumbnail();
    }
};

const replaceThumbnailWithInlineImage = (
    view: EditorView,
    fileInfo: FileInfo,
    uploadResult: string,
    inlineImages: InlineImages
): void => {
    const { state, dispatch } = view;
    const { schema } = state;

    // Tag shape: the upload result is a stored id resolved to a src and
    // persisted as the id microformat. Src shape: the result is the src itself.
    const tag = isInlineImageTag(inlineImages) ? inlineImages : undefined;

    const tr = state.tr;
    state.doc.descendants((node, pos) => {
        if (node.attrs.fileInfoId === fileInfo.id) {
            const imageNode = schema.nodes.image.create({
                src: tag ? tag.getUrl(uploadResult) : uploadResult,
                alt: fileInfo.filename ?? 'file',
                imageId: tag ? uploadResult : '',
                fileInfoId: fileInfo.id,
                state: 'success',
                maxWidth: '100%',
            });
            tr.replaceWith(pos, pos + node.nodeSize, imageNode);

            return false;
        }
    });

    dispatch(tr);
};

export const imageInserterFactory = (
    view: EditorView,
    base64Data: string,
    fileInfo: FileInfo
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
            'loading'
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
                    src ?? node.attrs.src,
                    fileInfo,
                    'success'
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
                    'failed'
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
    state: EditorImageState
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
        // eslint-disable-next-line unicorn/no-array-for-each
        node.content.forEach((child) => {
            if (isImageNode(child)) {
                found = true;
            }
        });

        return found;
    } else if (node instanceof Fragment) {
        let found = false;
        // eslint-disable-next-line unicorn/no-array-for-each
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

    // eslint-disable-next-line unicorn/no-array-for-each
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
 * @param slice
 * @param inlineImages
 * @returns A boolean; True if an image file was pasted to prevent default paste behavior, otherwise false.
 */
const processPasteEvent = (
    view: EditorView,
    event: ClipboardEvent,
    slice: Slice,
    inlineImages?: InlineImages
): boolean => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
        return false;
    }

    const isImageFilePasted = handlePastedImages(
        view,
        clipboardData,
        inlineImages
    );

    const filteredSlice = new Slice(
        filterImageNodes(slice.content),
        slice.openStart,
        slice.openEnd
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
 * @param inlineImages
 * @returns True if at least one valid image file was found and processed, false otherwise
 */
function handlePastedImages(
    view: EditorView,
    clipboardData: DataTransfer,
    inlineImages?: InlineImages
): boolean {
    let isImageFilePasted = false;
    const files = [...(clipboardData.files || [])];

    for (const file of files) {
        if (isImageFile(file, clipboardData)) {
            isImageFilePasted = true;

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result as string;
                const fileInfo = createFileInfo(file);

                if (inlineImages) {
                    // Once inline images are configured they own the paste
                    // lifecycle; never fall back to the legacy imagePasted
                    // event. Without an upload handler the paste is a no-op.
                    if (inlineImages.upload) {
                        runInlineImageUpload(
                            view,
                            file,
                            base64Data,
                            fileInfo,
                            inlineImages
                        );
                    }

                    return;
                }

                view.dom.dispatchEvent(
                    new CustomEvent('imagePasted', {
                        detail: imageInserterFactory(
                            view,
                            base64Data,
                            fileInfo
                        ),
                    })
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
