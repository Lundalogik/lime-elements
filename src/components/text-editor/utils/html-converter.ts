import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';

/**
 * @private
 */
export class HTMLConverter implements ContentTypeConverter {
    public parseAsHTML = (text: string): Promise<string> => {
        return new Promise((resolve) => {
            resolve(text);
        });
    };

    public serialize = (view: EditorView): string => {
        if (view.dom.textContent === '') {
            return '';
        } else {
            return view.dom.innerHTML;
        }
    };
}
