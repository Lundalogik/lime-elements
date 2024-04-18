import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
    Watch,
    h,
} from '@stencil/core';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
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
 * @exampleComponent limel-example-text-editor-basic
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

    @Prop()
    clearEditor: boolean;

    @Watch('clearEditor')
    clearnContentHandler(newValue: boolean, oldValue: boolean) {
        if (newValue === true && oldValue === false) {
            this.clearContent();
        }
    }

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<{ html: string }>;

    /**
     * Dispatched when the editor has been cleared
     */
    @Event()
    private contentCleared: EventEmitter<void>;

    public componentWillLoad() {}

    public render() {
        return <div id="editor" />;
    }

    public componentDidLoad() {
        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks,
        });

        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: EditorState.create({
                    doc: DOMParser.fromSchema(mySchema).parse(
                        this.host.shadowRoot.querySelector('#editor'),
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

    private clearContent() {
        const emptyParagraph =
            this.view.state.schema.nodes.paragraph.createChecked();
        const emptyDoc = this.view.state.schema.nodes.doc.createChecked(
            {},
            emptyParagraph,
        );
        const transaction = this.view.state.tr.replaceWith(
            0,
            this.view.state.doc.content.size,
            emptyDoc,
        );
        this.view.dispatch(transaction);
        this.contentCleared.emit();
    }
}
