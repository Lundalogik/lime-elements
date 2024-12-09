import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { markdownToHTML } from '../../markdown/markdown-parser';
import { CustomElementDefinition } from '../../../interface';

/**
 * @private
 */
export class HTMLConverter implements ContentTypeConverter {
    private customNodes: CustomElementDefinition[];

    constructor(plugins: CustomElementDefinition[]) {
        this.customNodes = plugins;
    }

    public parseAsHTML = (text: string): Promise<string> => {
        return markdownToHTML(text, { whitelist: this.customNodes });
    };

    public serialize = (view: EditorView): string => {
        if (view.dom.textContent === '') {
            return '';
        } else {
            return view.dom.innerHTML;
        }
    };
}
