import { CustomElement } from '../../global/shared-types/custom-element.types';
import { FileInfo } from '../../global/shared-types/file.types';

/**
 * Represents a trigger character and its position in the text.
 *
 * @alpha
 */
export type Trigger = {
    character: TriggerCharacter;
    position: number;
};

/**
 * A character that triggers a specific action in the text editor.
 *
 * @alpha
 */
export type TriggerCharacter =
    | '@'
    | '#'
    | '$'
    | '!'
    | '?'
    | '&'
    | '*'
    | '%'
    | '+'
    | '-'
    | '='
    | '/'
    | '\\'
    | '^'
    | '~'
    | '`'
    | ':'
    | ';'
    | '|'
    | '.'
    | ','
    | '<'
    | '>'
    | '['
    | ']'
    | '{'
    | '}'
    | '('
    | ')'
    | "'";

/**
 * @alpha
 */
export type TextEditorNode = {
    /**
     * The top node
     */
    node: CustomElement | string;

    /**
     * One more more children under the top node
     */
    children?: Array<TextEditorNode | string>;
};

/**
 * @alpha
 */
export interface ImageInserter {
    fileInfo: FileInfo;

    /**
     * Method to insert a thumbnail at the cursor position.
     */
    insertThumbnail: () => void;

    /**
     * Method to insert the image at the thumbnail position.
     * Thumbnail must be inserted before calling this method.
     *
     * @param src - The src url of the uploaded image.
     * If not provided, the image will be inserted with base64 data.
     *
     */
    insertImage: (src?: string) => void;

    /**
     * Method to insert a failed thumbnail at the thumbnail position.
     * Thumbnail must be inserted before calling this method.
     */
    insertFailedThumbnail: () => void;
}

/**
 * Configures inline image support in the editor. The editor owns the paste
 * lifecycle (thumbnail → upload → resizable image or failed state). Choose how
 * images are persisted with one of two shapes: `InlineImageTag` (a custom
 * id-carrying element) or `InlineImageSrc` (a plain `<img>`).
 *
 * @alpha
 */
export type InlineImages = InlineImageTag | InlineImageSrc;

/**
 * Persists images as `<tagName image-id="…">`, carrying only an id; the editor
 * resolves it to a displayable src via `getUrl`. Portable — no URL is baked
 * into the stored content.
 *
 * @alpha
 */
export interface InlineImageTag {
    /** Custom element the image is persisted as, e.g. `my-image`. Not `img`. */
    tagName: string;

    /** Resolves a stored id to a displayable src URL. */
    getUrl: (id: string) => string;

    /**
     * Uploads a pasted image, resolving to the stored id. Omit to render and
     * round-trip existing images without allowing new pastes.
     */
    upload?: (file: File) => Promise<string>;
}

/**
 * Persists images as a plain `<img src="…">`.
 *
 * @alpha
 */
export interface InlineImageSrc {
    /** Uploads a pasted image, resolving to its src — a URL or a data URI. */
    upload: (file: File) => Promise<string>;
}

/**
 * Narrows `InlineImages` to its tag shape, exposing `tagName`/`getUrl`.
 *
 * @param config - the inline-images configuration to test
 * @returns whether images are persisted as a custom id-carrying element
 * @alpha
 */
export function isInlineImageTag(
    config: InlineImages
): config is InlineImageTag {
    return 'tagName' in config;
}

/**
 * @alpha
 */
export type EditorImageState = 'loading' | 'failed' | 'success';

/**
 * @alpha
 */
export interface EditorImage {
    /**
     * Unique ID of the image file.
     */
    fileInfoId: string;
    /**
     * The source of the image.
     * Can either be a URL pointing to the image or a base64 encoded string.
     */
    src: string;
    /**
     * The current state of the image.
     */
    state: EditorImageState;
}

/**
 * @alpha
 */
export interface EditorLink {
    /**
     * The URL of the link.
     */
    href: string;

    /**
     * The text associated with the link.
     */
    text: string;
}

/**
 * @alpha
 */
export interface TextEditor {
    /**
     * Method to insert either text or a node at the cursor position
     */
    insert: (input: TextEditorNode | string) => void;

    /**
     * Method to insert an HTML string at the cursor position
     */
    insertHtml: (input: string) => Promise<void>;

    stopTrigger: () => void;
}

/**
 * @alpha
 */
export interface TriggerEventDetail {
    /**
     * The trigger that triggered this event
     *
     */
    trigger: TriggerCharacter;

    /**
     * The text editor
     */
    textEditor: TextEditor;

    /**
     * Current value of the trigger
     */
    value: string;
}

/**
 *
 * @alpha
 *
 * Interface representing metadata extracted from the editor document
 */
export interface EditorMetadata {
    /**
     * Collection of image elements found in the document
     */
    images: EditorImage[];

    /**
     * Collection of link elements found in the document
     */
    links: EditorLink[];
}
