import {
    ContentTypeConverter,
    buildContentWhitelist,
} from './content-type-converter';
import { EditorView } from 'prosemirror-view';
import { Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import {
    MarkdownSerializer,
    MarkdownSerializerState,
    defaultMarkdownSerializer,
} from 'prosemirror-markdown';
import { markdownToHTML } from '../../markdown/markdown-parser';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';
import {
    getImageNodeMarkdownSerializer,
    hasImageNode,
} from '../prosemirror-adapter/plugins/image/node';
import { hasCustomElementNode } from './has-custom-element-node';
import { escapeHtmlAttribute } from './escape-html-attribute';
import { Languages } from '../../date-picker/date.types';
import { InlineImages } from '../text-editor.types';

type MarkdownSerializerFunction = (
    state: MarkdownSerializerState,
    node: ProseMirrorNode
) => void;

const createMarkdownSerializerFunction = (
    config: CustomElementDefinition
): MarkdownSerializerFunction => {
    return (state: MarkdownSerializerState, node: ProseMirrorNode) => {
        const tagOpen =
            `<${config.tagName}` +
            config.attributes
                .map(
                    (attr) =>
                        ` ${attr}="${escapeHtmlAttribute(String(node.attrs[attr] ?? ''))}"`
                )
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
    language: Languages,
    inlineImages?: InlineImages
): MarkdownSerializer => {
    const customNodes = {};

    for (const plugin of plugins) {
        customNodes[plugin.tagName] = createMarkdownSerializerFunction(plugin);
    }

    const nodes = {
        ...defaultMarkdownSerializer.nodes,
        ...getImageNodeMarkdownSerializer(language, inlineImages),
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
        // Highlights have no standard markdown syntax, so they are emitted
        // as inline HTML, which round-trips through the markdown parser's
        // raw-HTML support.
        highlight: {
            open: (_state: MarkdownSerializerState, mark: Mark) => {
                const color = escapeHtmlAttribute(mark.attrs.color);

                return `<mark style="background-color: ${color}">`;
            },
            close: '</mark>',
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
    private readonly inlineImages?: InlineImages;

    constructor(
        plugins: CustomElementDefinition[],
        language: Languages,
        inlineImages?: InlineImages
    ) {
        this.markdownSerializer = buildMarkdownSerializer(
            plugins,
            language,
            inlineImages
        );
        this.customNodes = plugins;
        this.inlineImages = inlineImages;
    }
    public parseAsHTML = (text: string): Promise<string> => {
        return markdownToHTML(text, {
            whitelist: buildContentWhitelist(
                this.customNodes,
                this.inlineImages
            ),
        });
    };

    public serialize = (view: EditorView): string => {
        if (
            view.state.doc.textContent.trim() === '' &&
            !hasImageNode(view.state.doc) &&
            !hasCustomElementNode(view.state.doc, this.customNodes)
        ) {
            return '';
        }

        return this.markdownSerializer.serialize(view.state.doc);
    };
}
