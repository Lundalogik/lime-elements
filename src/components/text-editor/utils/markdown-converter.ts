import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import {
    MarkdownSerializer,
    MarkdownSerializerState,
    defaultMarkdownSerializer,
} from 'prosemirror-markdown';
import { markdownToHTML } from '../../markdown/markdown-parser';

const mentionSerializer = {
    mention: (state: MarkdownSerializerState, node: ProseMirrorNode) => {
        state.write(
            `<limebb-mention type="${node.attrs.type}" objectid="${node.attrs.objectid}" descriptive="${node.attrs.descriptive}"></limebb-mention>`,
        );
    },
};

const customMarkdownSerializer = new MarkdownSerializer(
    {
        ...defaultMarkdownSerializer.nodes,
        mention: mentionSerializer.mention,
    },
    {
        ...defaultMarkdownSerializer.marks,
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
export class MarkdownConverter implements ContentTypeConverter {
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
