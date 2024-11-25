import { ContentTypeConverter } from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import {
    MarkdownSerializer,
    MarkdownSerializerState,
    defaultMarkdownSerializer,
} from 'prosemirror-markdown';
import { markdownToHTML } from '../../markdown/markdown-parser';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';

type MarkdownSerializerFunction = (
    state: MarkdownSerializerState,
    node: ProseMirrorNode,
) => void;

const createMarkdownSerializerFunction = (
    config: CustomElementDefinition,
): MarkdownSerializerFunction => {
    return (state: MarkdownSerializerState, node: ProseMirrorNode) => {
        const tagOpen =
            `<${config.tagName}` +
            config.attributes
                .map((attr) => ` ${attr}="${node.attrs[attr]}"`)
                .join('') +
            '>';
        const tagClose = `</${config.tagName}>`;

        state.write(tagOpen);
        state.renderContent(node);
        state.write(tagClose);
    };
};

const buildMarkdownSerializer = (
    plugins: CustomElementDefinition[],
): MarkdownSerializer => {
    const customNodes = {};

    plugins.forEach((plugin) => {
        customNodes[plugin.tagName] = createMarkdownSerializerFunction(plugin);
    });

    const nodes = {
        ...defaultMarkdownSerializer.nodes,
        ...customNodes,
    };

    const marks = {
        ...defaultMarkdownSerializer.marks,
        strikethrough: {
            open: '~~',
            close: '~~',
            mixable: true,
            expelEnclosingWhitespace: true,
        },
    };

    return new MarkdownSerializer(nodes, marks);
};

/**
 * @private
 */
export class MarkdownConverter implements ContentTypeConverter {
    private markdownSerializer: MarkdownSerializer;
    private customNodes: CustomElementDefinition[];

    constructor(plugins: CustomElementDefinition[]) {
        this.markdownSerializer = buildMarkdownSerializer(plugins);
        this.customNodes = plugins;
    }
    public parseAsHTML = (text: string): Promise<string> => {
        return markdownToHTML(text, { whitelist: this.customNodes });
    };

    public serialize = (view: EditorView): string => {
        if (view.dom.textContent === '') {
            return '';
        } else {
            return this.markdownSerializer.serialize(view.state.doc);
        }
    };
}
