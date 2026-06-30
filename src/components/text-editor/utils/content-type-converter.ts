import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';
import { InlineImages, isInlineImageTag } from '../text-editor.types';

/**
 * Abstract class implementing a generic parser/serialiser
 * for different editor content types
 *
 * Acts as a parser/serialiser between document encodings (e.g., markdown, HTML) and the ProseMirror document
 *
 * @private
 */
export interface ContentTypeConverter {
    parseAsHTML: (text: string, schema: Schema) => Promise<string>;
    serialize: (view: EditorView, schema: Schema) => string;
}

/**
 * Build the sanitization whitelist for editor content: the consumer's custom
 * elements, plus (when inline images are configured) the inline-image tag so it
 * survives parsing into an image node. Shared by all content converters.
 *
 * @param customNodes
 * @param inlineImages
 * @private
 */
export function buildContentWhitelist(
    customNodes: CustomElementDefinition[],
    inlineImages?: InlineImages
): CustomElementDefinition[] {
    if (!inlineImages || !isInlineImageTag(inlineImages)) {
        return customNodes;
    }

    return [
        ...customNodes,
        {
            tagName: inlineImages.tagName,
            attributes: ['image-id', 'width', 'height', 'alt'],
        },
    ];
}
