import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import { markdownToHTML } from '../../markdown/markdown-parser';

/**
 * @private
 */
export class markdownConverter implements ContentTypeConverter {
    public parseAsHTML = (text: string): Promise<string> => {
        return markdownToHTML(text);
    };

    public serialize = (view: EditorView): string => {
        if (view.dom.textContent === '') {
            return '';
        } else {
            return defaultMarkdownSerializer.serialize(view.state.doc);
        }
    };
}
