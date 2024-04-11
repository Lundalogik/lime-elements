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
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup } from 'prosemirror-example-setup';
import { createPlaceholderPlugin as createPlaceholderPlugin } from './plugins/placeholder';

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
 * @exampleComponent limel-example-text-editor-composite
 * @beta
 * @private
 */
@Component({
    tag: 'limel-text-editor',
    shadow: true,
    styleUrl: 'text-editor.scss',
})
export class TextEditor {
    /**
     * The label of the editor
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * The placeholder text shown inside the input field,
     * when the field is empty.
     */
    @Prop({ reflect: true })
    public placeholder?: string;

    /**
     * Description of the text inside the editor
     */
    @Prop({ reflect: true })
    public value: { html: string };

    @Element()
    private host: HTMLLimelTextEditorElement;

    @State()
    private view: EditorView;

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<{ html: string }>;

    private placeholderKey: PluginKey;

    @Watch('placeholder')
    public watchPlaceholder() {
        this.view.dispatch(
            this.view.state.tr.setMeta(this.placeholderKey, this.placeholder),
        );
    }

    public connectedCallback() {
        this.placeholderKey = new PluginKey('placeholder');
    }

    public componentWillLoad() {}

    public render() {
        return [this.renderLabel(), <div id="editor" />];
    }

    private renderLabel() {
        if (!this.label) {
            return;
        }

        return <label>{this.label}</label>;
    }

    public componentDidLoad() {
        const mySchema = new Schema({
            nodes: schema.spec.nodes,
            marks: schema.spec.marks,
        });

        const plugins = this.getPlugins(mySchema);

        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: EditorState.create({
                    doc: DOMParser.fromSchema(mySchema).parse(
                        this.host.shadowRoot.querySelector('#editor'),
                    ),
                    plugins: plugins,
                }),
                dispatchTransaction: (transaction) => {
                    const newState = this.view.state.apply(transaction);
                    this.view.updateState(newState);

                    this.change.emit({
                        html: this.getHTML(),
                    });
                },
            },
        );

        if (this.value) {
            this.view.dom.innerHTML = this.value.html;
        }
    }

    private getHTML = (): string => {
        if (
            this.view.dom.textContent === '' ||
            (this.view.dom.textContent === this.placeholder &&
                this.view.dom.innerHTML !== `<p>${this.placeholder}</p>`) // TODO: this is a little too coupled to the placeholder plugin
        ) {
            return '';
        } else {
            return this.view.dom.innerHTML;
        }
    };

    private getPlugins = (mySchema: Schema): Plugin[] => {
        const placeholderPlugin = createPlaceholderPlugin(
            this.placeholder,
            this.placeholderKey,
        );

        return [...exampleSetup({ schema: mySchema }), placeholderPlugin];
    };
}
