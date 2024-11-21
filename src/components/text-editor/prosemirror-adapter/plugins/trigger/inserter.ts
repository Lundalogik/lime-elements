import { Node, NodeType, Schema, Fragment } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
    TextEditor,
    TextEditorNode,
} from 'src/components/text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../utils/content-type-converter';
import { createHtmlInserter } from './create-html-inserter';

export const inserterFactory = (
    view: EditorView,
    contentConverter: ContentTypeConverter,
): TextEditor => {
    const startPos = getTriggerStartPosition(view);

    return {
        insert: createNodeAndTextInserter(view, startPos),
        insertHtml: createHtmlInserter(
            view,
            contentConverter,
            startPos,
            dispatchTransaction,
        ),
        stopTrigger: () => stopTriggerTransaction(view),
    };
};

const createNodeAndTextInserter =
    (view: EditorView, startPos: number) =>
    (input: TextEditorNode | string): void => {
        const schema = view.state.schema;
        let node: Node;

        try {
            node = createNode(input, schema);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);

            return;
        }

        const spaceNode = schema.text(' ');

        const fragment = schema.nodes.doc.create(null, [node, spaceNode]);

        dispatchTransaction(view, startPos, fragment);
    };

const stopTriggerTransaction = (view: EditorView): void => {
    const { state, dispatch } = view;

    const transaction = state.tr;
    transaction.setMeta('stopTrigger', true);

    dispatch(transaction);
};

const dispatchTransaction = (
    view: EditorView,
    startPos: number,
    fragment: Fragment | Node,
): void => {
    const state = view.state;
    const dispatch = view.dispatch;
    const fromPos = state.selection.$from.pos;

    const transaction = state.tr.replaceWith(startPos, fromPos, fragment);
    transaction.setMeta('stopTrigger', true);
    dispatch(transaction);
};

const createNode = (input: TextEditorNode | string, schema: Schema): Node => {
    if (typeof input === 'string') {
        return schema.text(input);
    }

    const node = input.node;

    if (typeof node === 'string') {
        return schema.text(node);
    }

    const customNode = getCustomNode(node.tagName, schema);

    const childNodes: Node[] = (input.children ?? [])
        .map((child) => createNode(child, schema))
        .filter(Boolean);

    return customNode.create(node.attributes, childNodes);
};

const getCustomNode = (name: string, schema: Schema): NodeType => {
    const customNode = Object.values(schema.nodes).find(
        (prosemirrorNode) => prosemirrorNode.name === name,
    );

    if (!customNode) {
        throw new Error(
            `A custom element hasn't been registered for node ${name}`,
        );
    }

    return customNode;
};

const getTriggerStartPosition = (view: EditorView): number => {
    return view.state?.selection?.$from?.pos;
};
