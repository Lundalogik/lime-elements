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
import { exampleSetup } from 'prosemirror-example-setup';

/**
 * This editor offers a rich text editing experience with markdown support,
 * in the sense that you can easily type markdown syntax and see the rendered
 * result as rich text in real-time. For instance, you can type `# Hello, world!`
 * and see it directly turning to a heading 1 (an `<h1>` HTML element).
 *
 * Naturally, you can use standard keyboard hotkeys such as <kbd>Ctrl</kbd> + <kbd>B</kbd>
 * to toggle bold text, <kbd>Ctrl</kbd> + <kbd>I</kbd> to toggle italic text, and so on.
 *
 * @exampleComponent limel-example-text-editor
 * @beta
 * @private
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

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<{ html: string }>;

    public componentWillLoad() {}

    public render() {
        return [<div id="editor" />, <div id="content" />];
    }

    public componentDidLoad() {
        const mySchema = new Schema({
            nodes: schema.spec.nodes,
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
