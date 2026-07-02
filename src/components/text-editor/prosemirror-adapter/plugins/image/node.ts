import { NodeSpec, Node, DOMOutputSpec, TagParseRule } from 'prosemirror-model';
import {
    EditorImageState,
    InlineImages,
    isInlineImageTag,
} from '../../../text-editor.types';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Languages } from '../../../../date-picker/date.types';
import translate from '../../../../../global/translations';

export const imageCache = new Map<string, HTMLImageElement>();

type MarkdownSerializerFunction = (
    state: MarkdownSerializerState,
    node: Node
) => void;

const IMAGE_ID_ATTRIBUTE = 'image-id';

export interface ImageNodeAttrs {
    src: string;
    alt: string;
    state: EditorImageState;
    /**
     * Transient, per-session key used to correlate an async upload with its
     * thumbnail node and to key the image cache. Not persisted; regenerated
     * when content is parsed.
     */
    fileInfoId: string | number;
    /**
     * Opaque id of the stored image, set when inline images are configured and
     * persisted on the tag.
     */
    imageId?: string;
    height?: string;
    width?: string;
    minHeight?: string;
    minWidth?: string;
    maxWidth?: string;
}

/**
 * Builds the `image` NodeSpec, wired for inline-image parsing/serialization
 * when `inlineImages` is configured.
 * @param language
 * @param inlineImages
 */
export function getImageNode(
    language: Languages,
    inlineImages?: InlineImages
): Record<string, NodeSpec> {
    return { image: createImageNodeSpec(language, inlineImages) };
}

/**
 * Builds the markdown serializer for the `image` node, emitting the inline-image
 * tag when `inlineImages` is configured and a `<img>` otherwise.
 * @param language
 * @param inlineImages
 */
export function getImageNodeMarkdownSerializer(
    language: Languages,
    inlineImages?: InlineImages
): Record<string, MarkdownSerializerFunction> {
    return { image: createImageNodeMarkdownSerializer(language, inlineImages) };
}

/**
 * Applies the node's stored dimensions to a rendered `<img>` element.
 * @param img
 * @param node
 */
export function applyImageStyles(img: HTMLImageElement, node: Node) {
    img.style.height = node.attrs.height;
    img.style.width = node.attrs.width;
    img.style.minHeight = node.attrs.minHeight;
    img.style.minWidth = node.attrs.minWidth;
    img.style.maxWidth = node.attrs.maxWidth;
}

/**
 * Recursively checks if a ProseMirror node or any of its descendants is an
 * image node.
 * @param node
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
    inlineImages?: InlineImages
): MarkdownSerializerFunction {
    return (markdownSerializerState: MarkdownSerializerState, node: Node) => {
        const state = node.attrs.state;
        if (!isEditorImageState(state)) {
            return;
        }

        if (state === 'success') {
            const attrs = node.attrs as ImageNodeAttrs;
            const tag =
                inlineImages && isInlineImageTag(inlineImages)
                    ? inlineImages
                    : undefined;
            const imageHTML =
                tag && attrs.imageId
                    ? getInlineImageHTML(attrs, tag.tagName)
                    : getImageHTML(attrs);
            markdownSerializerState.write(imageHTML);

            return;
        }

        const statusHTML = getStatusHTML(state, node.attrs.alt, language);
        markdownSerializerState.write(statusHTML);
    };
}

function escapeAttributeValue(value: string): string {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

function getInlineImageHTML(attrs: ImageNodeAttrs, tag: string): string {
    const attributes = [
        `${IMAGE_ID_ATTRIBUTE}="${escapeAttributeValue(attrs.imageId ?? '')}"`,
        attrs.width ? `width="${escapeAttributeValue(attrs.width)}"` : '',
        attrs.height ? `height="${escapeAttributeValue(attrs.height)}"` : '',
        attrs.alt ? `alt="${escapeAttributeValue(attrs.alt)}"` : '',
    ].filter(Boolean);

    return `<${tag} ${attributes.join(' ')}></${tag}>`;
}

function buildInlineImageDOMAttrs(
    attrs: ImageNodeAttrs
): Record<string, string> {
    const result: Record<string, string> = {
        [IMAGE_ID_ATTRIBUTE]: attrs.imageId ?? '',
    };
    if (attrs.alt) {
        result.alt = attrs.alt;
    }
    if (attrs.width) {
        result.width = attrs.width;
    }
    if (attrs.height) {
        result.height = attrs.height;
    }

    return result;
}

function getStatusHTML(
    state: EditorImageState,
    alt: string,
    language: Languages
): string {
    const key = state === 'failed' ? 'failed' : 'loading';
    const text = translate.get(`editor-image-view.${key}`, language, {
        filename: alt || 'file',
    });

    return `<span>${text}</span>`;
}

function getImageHTML(attrs: ImageNodeAttrs): string {
    const dimensions: Array<[string, string | undefined]> = [
        ['height', attrs.height],
        ['width', attrs.width],
        ['min-height', attrs.minHeight],
        ['min-width', attrs.minWidth],
        ['max-width', attrs.maxWidth],
    ];

    const style = dimensions
        .filter(([, value]) => value)
        .map(([property, value]) => `${property}: ${value};`)
        .join('');

    const styleAttribute = style
        ? ` style="${escapeAttributeValue(style)}"`
        : '';

    return `<img src="${escapeAttributeValue(attrs.src)}" alt="${escapeAttributeValue(attrs.alt)}"${styleAttribute} />`;
}

function createImageNodeSpec(
    language: Languages,
    inlineImages?: InlineImages
): NodeSpec {
    return {
        group: 'inline',
        inline: true,
        attrs: {
            src: { default: '' },
            alt: { default: '' },
            fileInfoId: { default: '' },
            imageId: { default: '' },
            height: { default: '' },
            width: { default: '' },
            minHeight: { default: '' },
            minWidth: { default: '' },
            maxWidth: { default: '100%' },
            state: { default: 'success' },
        },
        toDOM: createImageToDOM(language, inlineImages),
        parseDOM: createImageParseDOM(inlineImages),
    };
}

function createImageToDOM(
    language: Languages,
    inlineImages?: InlineImages
): (node: Node) => DOMOutputSpec {
    return (node: Node): DOMOutputSpec => {
        if (!isEditorImageState(node.attrs.state)) {
            return;
        }

        if (node.attrs.state !== 'success') {
            return createStatusSpanForState(node.attrs.state, node, language);
        }

        // Emit the inline-image tag for HTML serialization and clipboard;
        // on-screen rendering comes from the NodeView, not this.
        const tag =
            inlineImages && isInlineImageTag(inlineImages)
                ? inlineImages
                : undefined;
        if (tag && node.attrs.imageId) {
            return [
                tag.tagName,
                buildInlineImageDOMAttrs(node.attrs as ImageNodeAttrs),
            ];
        }

        return getOrCreateImageElement(node.attrs.fileInfoId, node);
    };
}

function createImageParseDOM(inlineImages?: InlineImages): TagParseRule[] {
    const rules: TagParseRule[] = [];

    const tag =
        inlineImages && isInlineImageTag(inlineImages)
            ? inlineImages
            : undefined;
    if (tag) {
        rules.push({
            tag: tag.tagName,
            getAttrs: (dom: HTMLElement): ImageNodeAttrs | false => {
                const imageId = dom.getAttribute(IMAGE_ID_ATTRIBUTE);

                // Skip malformed tags without an id; parsing them would
                // produce a broken image from an empty getUrl('').
                if (!imageId) {
                    return false;
                }

                return {
                    src: tag.getUrl(imageId),
                    // Preserve an absent alt as empty so an id-only tag
                    // serializes back to the same markup instead of gaining
                    // a synthetic alt, keeping the round-trip stable.
                    alt: dom.getAttribute('alt') || '',
                    imageId: imageId,
                    width: dom.getAttribute('width') || '',
                    height: dom.getAttribute('height') || '',
                    maxWidth: '100%',
                    state: 'success',
                    fileInfoId: crypto.randomUUID(),
                };
            },
        });
    }

    rules.push({
        tag: 'img',
        getAttrs: (dom: HTMLElement): ImageNodeAttrs => {
            return {
                src: dom.getAttribute('src') || '',
                alt: dom.getAttribute('alt') || 'file',
                width: dom.style.width || '',
                height: dom.style.height || '',
                maxWidth: '100%',
                state: 'success',
                fileInfoId: crypto.randomUUID(),
            };
        },
    });

    return rules;
}

function isEditorImageState(state: unknown): state is EditorImageState {
    return state === 'loading' || state === 'failed' || state === 'success';
}

function getOrCreateImageElement(
    fileInfoId: string,
    node: Node
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
    language: Languages
): HTMLSpanElement {
    const statusKey = state === 'failed' ? 'failed' : 'loading';

    return createStatusSpan(statusKey, node, language);
}

function createStatusSpan(
    key: string,
    node: Node,
    language: Languages
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
    node: Node
): HTMLImageElement {
    img.alt = node.attrs.alt;
    applyImageStyles(img, node);

    return img;
}

function createImageElement(node: Node): HTMLImageElement {
    const img = document.createElement('img');
    img.src = node.attrs.src;
    img.alt = node.attrs.alt;
    applyImageStyles(img, node);

    return img;
}
