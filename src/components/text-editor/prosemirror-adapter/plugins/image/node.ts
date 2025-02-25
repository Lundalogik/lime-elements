import { NodeSpec, Node, Attrs, DOMOutputSpec } from 'prosemirror-model';
import { ImageState } from '../../../text-editor.types';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Languages } from '../../../../date-picker/date.types';
import translate from 'src/global/translations';

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
    return (state: MarkdownSerializerState, node: Node) => {
        if (node.attrs.state === ImageState.FAILED) {
            const text = translate.get('editor-image-view.failed', language, {
                filename: node.attrs.alt || 'file',
            });
            state.write(`<span>${text}</span>`);

            return;
        } else if (node.attrs.state === ImageState.LOADING) {
            const text = translate.get('editor-image-view.loading', language, {
                filename: node.attrs.alt || 'file',
            });
            state.write(`<span>${text}</span>`);

            return;
        }

        let imageHTML = `<img src="${node.attrs.src}"`;

        if (node.attrs.alt) {
            imageHTML += ` alt="${node.attrs.alt}"`;
        }

        const style = [];

        if (node.attrs.width) {
            style.push(`width: ${node.attrs.width};`);
        }

        if (node.attrs.maxWidth) {
            style.push(`max-width: ${node.attrs.maxWidth};`);
        }

        if (style.length > 0) {
            imageHTML += ` style="${style.join(' ')}"`;
        }

        imageHTML += ' />';

        state.write(imageHTML);
    };
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
            state: { default: '' },
        },
        toDOM: (node): DOMOutputSpec => {
            if (node.attrs.state === ImageState.FAILED) {
                return createStatusSpan('failed', node, language);
            } else if (node.attrs.state === ImageState.LOADING) {
                return createStatusSpan('loading', node, language);
            }

            let img = imageCache.get(node.attrs.fileInfoId);
            if (img) {
                updateImageElement(img, node);
            } else {
                img = createImageElement(node);
                imageCache.set(node.attrs.fileInfoId, img);
            }

            return img;
        },
        parseDOM: [
            {
                tag: 'img',
                getAttrs: (dom: HTMLElement): Attrs => {
                    return {
                        src: dom.getAttribute('src') || '',
                        alt: dom.getAttribute('alt') || 'file',
                        width: dom.style.width || '',
                        maxWidth: '100%',
                        state: ImageState.SUCCESS,
                        fileInfoId: crypto.randomUUID(),
                    };
                },
            },
        ],
    };
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
