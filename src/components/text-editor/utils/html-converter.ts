import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { sanitizeHTML } from '../../markdown/markdown-parser';
import { CustomElementDefinition } from '../../../interface';
import { DOMSerializer } from 'prosemirror-model';
import { hasImageNode } from '../prosemirror-adapter/plugins/image/node';

/**
 * @private
 */
export class HTMLConverter implements ContentTypeConverter {
    private customNodes: CustomElementDefinition[];

    constructor(plugins: CustomElementDefinition[]) {
        this.customNodes = plugins;
    }

    public parseAsHTML = (text: string): Promise<string> => {
        return sanitizeHTML(text, this.customNodes);
    };

    public serialize = (view: EditorView): string => {
        if (
            view.dom.textContent.trim() === '' &&
            !hasImageNode(view.state.doc)
        ) {
            return '';
        }

        const div = document.createElement('div');
        div.appendChild(
            DOMSerializer.fromSchema(view.state.schema).serializeFragment(
                view.state.doc.content,
            ),
        );

        return div.innerHTML;
    };
}
