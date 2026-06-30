import {
    ContentTypeConverter,
    buildContentWhitelist,
} from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { sanitizeHTML } from '../../markdown/markdown-parser';
import { CustomElementDefinition } from '../../../interface';
import { DOMSerializer } from 'prosemirror-model';
import { hasImageNode } from '../prosemirror-adapter/plugins/image/node';
import { hasCustomElementNode } from './has-custom-element-node';
import { InlineImages } from '../text-editor.types';

/**
 * @private
 */
export class HTMLConverter implements ContentTypeConverter {
    private customNodes: CustomElementDefinition[];
    private readonly inlineImages?: InlineImages;

    constructor(
        plugins: CustomElementDefinition[],
        inlineImages?: InlineImages
    ) {
        this.customNodes = plugins;
        this.inlineImages = inlineImages;
    }

    public parseAsHTML = (text: string): Promise<string> => {
        return sanitizeHTML(
            text,
            buildContentWhitelist(this.customNodes, this.inlineImages)
        );
    };

    public serialize = (view: EditorView): string => {
        if (
            view.state.doc.textContent.trim() === '' &&
            !hasImageNode(view.state.doc) &&
            !hasCustomElementNode(view.state.doc, this.customNodes)
        ) {
            return '';
        }

        const div = document.createElement('div');
        div.append(
            DOMSerializer.fromSchema(view.state.schema).serializeFragment(
                view.state.doc.content
            )
        );

        return div.innerHTML;
    };
}
