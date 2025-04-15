import { Plugin, PluginKey, Transaction, StateField } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createFileInfo } from '../../../../../util/files';
import { FileInfo } from '../../../../../global/shared-types/file.types';
import {
    ImageInserter,
    ImageInfo,
    ImageState,
} from '../../../text-editor.types';
import { Node } from 'prosemirror-model';
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
            handlePaste: (view, event) => {
                return processPasteEvent(view, event);
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
        const fileInfoId = removedImage.attrs.fileInfoId;

        const imageInfo: ImageInfo = {
            fileInfoId: fileInfoId,
            src: removedImage.attrs.src,
            state: removedImage.attrs.state,
        };
        imageRemovedCallback(imageInfo);

        imageCache.delete(fileInfoId);
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

        // create a blob URL from the base64 data

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

    const htmlContent = clipboardData.getData('text/html');
    if (htmlContent) {
        const imagesSources = extractImagesFromHTML(htmlContent);
        if (imagesSources.length > 0) {
            for (const src of imagesSources) {
                processImageSource(view, src);
            }
        }
    }

    return false;
};

/**
 * Extract image sources from HTML content
 *
 * @param htmlContent - The HTML content to extract images from
 * @returns An array of image source URLs
 */
const extractImagesFromHTML = (htmlContent: string): string[] => {
    const sources: string[] = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const imgElements = tempDiv.querySelectorAll('img');
    imgElements.forEach((img) => {
        const src = img.getAttribute('src');
        if (src) {
            sources.push(src);
        }
    });

    return sources;
};

/**
 * Process an image source by detecting its type and handling it accordingly
 *
 * @param view - The ProseMirror editor view
 * @param src - The image source URL or data URL
 */
const processImageSource = (view: EditorView, src: string): void => {
    const sourceType = detectImageSourceType(src);

    switch (sourceType) {
        case 'data-url':
            processDataUrlImage(view, src);
            break;
        case 'external-url':
            processExternalUrlImage(view, src);
            break;
        case 'unknown':
        default:
            console.warn('Unknown image source type:', src);
            break;
    }
};

/**
 * Detect the type of image source
 *
 * @param src - The image source
 * @returns The detected source type
 */
const detectImageSourceType = (
    src: string,
): 'data-url' | 'external-url' | 'unknown' => {
    if (src.startsWith('data:image/')) {
        return 'data-url';
    } else if (/^https?:\/\//i.exec(src) || src.startsWith('//')) {
        return 'external-url';
    } else {
        return 'unknown';
    }
};

/**
 * Process a data URL image
 *
 * @param view - The editor view
 * @param dataUrl - The data URL of the image
 */
const processDataUrlImage = (view: EditorView, dataUrl: string): void => {
    // Extract mime type from data URL
    const mimeMatch = /^data:([^;]+);/.exec(dataUrl);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const extension = mimeType.split('/')[1] || 'png';

    // Create a blob from the data URL
    const regex = /^data:([^;]+);base64,(.+)$/;
    const matches = regex.exec(dataUrl);
    if (!matches) {
        console.error('Invalid data URL format');

        return;
    }

    const base64Data = matches[2];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    const fileName = `pasted-image-${Date.now()}.${extension}`;
    const file = new File([blob], fileName, { type: mimeType });

    const reader = new FileReader();
    reader.onloadend = () => {
        dispatchImagePastedEvent(view, reader.result as string, file);
    };

    reader.readAsDataURL(blob);
};

/**
 * Process an external URL image
 *
 * @param view - The editor view
 * @param url - The URL of the image
 */
const processExternalUrlImage = (view: EditorView, url: string): void => {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch image: ${response.statusText}`,
                );
            }

            return response.blob();
        })
        .then((blob) => {
            const fileType = blob.type || 'image/png';
            const extension = fileType.split('/')[1] || 'png';
            const fileName =
                url.split('/').pop() ||
                `external-image-${Date.now()}.${extension}`;
            const file = new File([blob], fileName, { type: fileType });

            const reader = new FileReader();
            reader.onloadend = () => {
                dispatchImagePastedEvent(view, reader.result as string, file);
            };

            reader.readAsDataURL(blob);
        })
        .catch((error) => {
            console.error('Error processing external image:', error);
        });
};

/**
 * Create and dispatch an imagePasted event
 *
 * @param view - The editor view
 * @param base64Data - The base64 data of the image
 * @param file - The file object
 */
const dispatchImagePastedEvent = (
    view: EditorView,
    base64Data: string,
    file: File,
): void => {
    view.dom.dispatchEvent(
        new CustomEvent('imagePasted', {
            detail: imageInserterFactory(
                view,
                base64Data,
                createFileInfo(file),
            ),
        }),
    );
};

/**
 * Convert a URL or data URL to a Blob
 *
 * @param url - The URL or data URL to convert
 * @returns A Promise that resolves to a Blob or null if conversion fails
 */
const urlToBlob = async (url: string): Promise<Blob | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }

        return await response.blob();
    } catch (error) {
        console.error('Error converting URL to blob:', error);

        return null;
    }
};

/**
 * Creates a smaller thumbnail from an image data URL
 * @param dataUrl - Original image data URL
 * @param maxWidth - Maximum width of thumbnail
 * @param maxHeight - Maximum height of thumbnail
 * @param quality - JPEG quality (0-1)
 * @returns Promise resolving to a smaller thumbnail data URL
 */
const createOptimizedThumbnail = (
    dataUrl: string,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.7,
): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            // Create canvas and draw resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG for better compression
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(thumbnailDataUrl);
        };

        // Handle potential loading errors
        img.onerror = () => {
            console.warn('Failed to create thumbnail, using original');
            resolve(dataUrl);
        };

        img.src = dataUrl;
    });
};
