import { Node, DOMParser, Fragment } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ContentTypeConverter } from '../../../utils/content-type-converter';

export const createHtmlInserter = (
    view: EditorView,
    contentConverter: ContentTypeConverter,
    startPos: number,
    dispatchTransaction: (
        view: EditorView,
        startPos: number,
        fragment: Fragment | Node
    ) => void
): ((input: string) => Promise<void>) => {
    const schema = view.state.schema;

    return async (input: string): Promise<void> => {
        const container = document.createElement('span');
        container.innerHTML = await contentConverter.parseAsHTML(input, schema);

        const fragment = DOMParser.fromSchema(schema).parse(container).content;

        dispatchTransaction(view, startPos, fragment);
    };
};
