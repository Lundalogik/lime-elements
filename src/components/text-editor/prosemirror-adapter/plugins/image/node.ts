import { NodeSpec, Node, DOMOutputSpec } from 'prosemirror-model';
import { EditorImageState } from '../../../text-editor.types';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Languages } from '../../../../date-picker/date.types';
import translate from '../../../../../global/translations';

export const imageCache = new Map<string, HTMLImageElement>();

type MarkdownSerializerFunction = (
    state: MarkdownSerializerState,
    node: Node,
) => void;

export function getImageNode(language: Languages): Record<string, NodeSpec> {
    return { image: createImageNodeSpec(language) };
}

export function getImageNodeMarkdownSerializer(
    language: Languages,
): Record<string, MarkdownSerializerFunction> {
    return { image: createImageNodeMarkdownSerializer(language) };
}

/**
 * Recursively checks if a ProseMirror node or
 * any of its child nodes is an image node.
 */
export function hasImageNode(node: Node): boolean {
    if (node.type.name === 'image') {
        return true;
    }

    for (let i = 0; i < node.childCount; i++) {
        const childNode = node.child(i);
        if (hasImageNode(childNode)) {
            return true;
        }
    }

    return false;
}

function createImageNodeMarkdownSerializer(
    language: Languages,
): MarkdownSerializerFunction {
    return (markdownSerializerState: MarkdownSerializerState, node: Node) => {
        const { state, alt, src, width, maxWidth } = node.attrs;

        if (!isEditorImageState(state)) {
            return;
        }

        if (state === 'success') {
            const imageHTML = getImageHTML(src, alt, width, maxWidth);
            markdownSerializerState.write(imageHTML);

            return;
        }

        const statusHTML = getStatusHTML(state, alt, language);
        markdownSerializerState.write(statusHTML);
    };
}

function getStatusHTML(
    state: EditorImageState,
    alt: string,
    language: Languages,
): string {
    const key = state === 'failed' ? 'failed' : 'loading';
    const text = translate.get(`editor-image-view.${key}`, language, {
        filename: alt || 'file',
    });

    return `<span>${text}</span>`;
}

function getImageHTML(
    src: string,
    alt: string,
    width: string,
    maxWidth: string,
): string {
    const style = [];

    if (width) {
        style.push(`width: ${width};`);
    }

    if (maxWidth) {
        style.push(`max-width: ${maxWidth};`);
    }

    const styleAttribute =
        style.length > 0 ? ` style="${style.join(' ')}"` : '';

    return `<img src="${src}" alt="${alt}"${styleAttribute} />`;
}

export interface ImageNodeAttrs {
    src: string;
    alt: string;
    state: EditorImageState;
    fileInfoId: string | number;
    width?: string;
    maxWidth?: string;
}

function createImageNodeSpec(language: Languages): NodeSpec {
    return {
        group: 'inline',
        inline: true,
        attrs: {
            src: { default: '' },
            alt: { default: '' },
            fileInfoId: { default: '' },
            width: { default: '' },
            maxWidth: { default: '100%' },
            state: { default: 'success' },
        },
        toDOM: (node): DOMOutputSpec => {
            if (!isEditorImageState(node.attrs.state)) {
                return;
            }

            if (node.attrs.state === 'success') {
                return getOrCreateImageElement(node.attrs.fileInfoId, node);
            }

            return createStatusSpanForState(node.attrs.state, node, language);
        },
        parseDOM: [
            {
                tag: 'img',
                getAttrs: (dom: HTMLElement): ImageNodeAttrs => {
                    return {
                        src: dom.getAttribute('src') || '',
                        alt: dom.getAttribute('alt') || 'file',
                        width: dom.style.width || '',
                        maxWidth: '100%',
                        state: 'success',
                        fileInfoId: crypto.randomUUID(),
                    };
                },
            },
        ],
    };
}

function isEditorImageState(state: unknown): state is EditorImageState {
    return state === 'loading' || state === 'failed' || state === 'success';
}

function getOrCreateImageElement(
    fileInfoId: string,
    node: Node,
): HTMLImageElement {
    let img = imageCache.get(fileInfoId);

    if (img) {
        updateImageElement(img, node);
    } else {
        img = createImageElement(node);
        imageCache.set(fileInfoId, img);
    }

    return img;
}

function createStatusSpanForState(
    state: EditorImageState,
    node: Node,
    language: Languages,
): HTMLSpanElement {
    const statusKey = state === 'failed' ? 'failed' : 'loading';

    return createStatusSpan(statusKey, node, language);
}

function createStatusSpan(
    key: string,
    node: Node,
    language: Languages,
): HTMLSpanElement {
    const text = translate.get(`editor-image-view.${key}`, language, {
        filename: node.attrs.alt || 'file',
    });
    const span = document.createElement('span');
    span.textContent = text;

    return span;
}

function updateImageElement(
    img: HTMLImageElement,
    node: Node,
): HTMLImageElement {
    img.alt = node.attrs.alt;
    img.style.maxWidth = node.attrs.maxWidth;
    img.style.width = node.attrs.width;

    return img;
}

function createImageElement(node: Node): HTMLImageElement {
    const img = document.createElement('img');
    img.src = node.attrs.src;
    img.alt = node.attrs.alt;
    img.style.maxWidth = node.attrs.maxWidth;
    img.style.width = node.attrs.width;

    return img;
}
