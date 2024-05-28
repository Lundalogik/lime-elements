import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import {
    MarkdownSerializer,
    defaultMarkdownSerializer,
} from 'prosemirror-markdown';
import { markdownToHTML } from '../../markdown/markdown-parser';

const customMarkdownSerializer = new MarkdownSerializer(
    {
        ...defaultMarkdownSerializer.nodes,
    },
    {
        ...defaultMarkdownSerializer.marks,
        underline: {
            open: '<u>',
            close: '</u>',
            mixable: true,
            expelEnclosingWhitespace: true,
        },
        strikethrough: {
            open: '~~',
            close: '~~',
            mixable: true,
            expelEnclosingWhitespace: true,
        },
    },
);

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
            return customMarkdownSerializer.serialize(view.state.doc);
        }
    };
}
