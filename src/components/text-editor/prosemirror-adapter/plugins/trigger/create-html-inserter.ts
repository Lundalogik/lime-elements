import { Node, DOMParser, Fragment } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ContentTypeConverter } from '../../../utils/content-type-converter';
import { TriggerCharacter } from 'src/interface';
import { findTriggerPosition } from './factory';

export const createHtmlInserter = (
    view: EditorView,
    contentConverter: ContentTypeConverter,
    triggerCharacter: TriggerCharacter,
    dispatchTransaction: (
        view: EditorView,
        startPos: number,
        fragment: Fragment | Node,
    ) => void,
): ((input: string) => Promise<void>) => {
    const schema = view.state.schema;
    const state = view.state;

    const foundTrigger = findTriggerPosition(state, triggerCharacter);
    const position = foundTrigger?.position;

    return async (input: string): Promise<void> => {
        const container = document.createElement('span');
        container.innerHTML = await contentConverter.parseAsHTML(input, schema);

        const fragment = DOMParser.fromSchema(schema).parse(container).content;

        dispatchTransaction(view, position, fragment);
    };
};
