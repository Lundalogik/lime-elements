import {
    Component,
    Element,
    Event,
    EventEmitter,
    State,
    h,
} from '@stencil/core';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { defaultTextEditorMenu } from './constants';

/**
 * The `limel-text-editor` component wraps the toast-ui react editor. This editor
 * allows a rich text editing experience with markdown support.
 *
 * @exampleComponent limel-example-text-editor
 */
@Component({
    tag: 'limel-text-editor',
    shadow: true,
    styleUrl: 'text-editor.scss',
})
export class TextEditor {
    @Element()
    private host: HTMLLimelTextEditorElement;

    @State()
    private view: EditorView;

    @Event()
    private change: EventEmitter<{ html: string }>;

    public render() {
        return [
            this.renderMenu(),
            <div id="editor"></div>,
            <div id="content"></div>,
        ];
    }

    public renderMenu() {
        return (
            <limel-text-editor-menu
                menu={defaultTextEditorMenu}
                editorView={this.view}
            ></limel-text-editor-menu>
        );
    }

    public componentDidLoad() {
        // Mix the nodes from prosemirror-schema-list into the basic schema to
        // create a schema with list support.
        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks,
        });

        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: EditorState.create({
                    doc: DOMParser.fromSchema(mySchema).parse(
                        this.host.shadowRoot.querySelector('#content'),
                    ),
                    plugins: exampleSetup({ schema: mySchema }),
                }),
                dispatchTransaction: (transaction) => {
                    const newState = this.view.state.apply(transaction);
                    this.view.updateState(newState);

                    this.change.emit({ html: this.view.dom.innerHTML });
                },
            },
        );
    }
}
