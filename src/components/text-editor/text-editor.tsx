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
import { FormComponent } from '../form/form.types';
import { createPlaceholderPlugin as createPlaceholderPlugin } from './plugins/placeholder';
import { createReadOnlyPlugin } from './plugins/readonly';
import { createDisabledPlugin } from './plugins/disabled';

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
export class TextEditor implements FormComponent<{ html: string }> {
    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled?: boolean;

    /**
     * Set to `true` to make the component read-only.
     * Use `readonly` when the field is only there to present the data it holds,
     * and will not become possible for the current user to edit.
     * :::note
     * Consider that it might be better to use `limel-markdown`
     * instead of `limel-text-editor` when the goal is visualizing data.
     * :::
     */
    @Prop({ reflect: true })
    public readonly?: boolean;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText?: string;

    /**
     * The placeholder text shown inside the input field,
     * when the field is empty.
     */
    @Prop({ reflect: true })
    public placeholder?: string;

    /**
     * The label of the editor
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * Set to `true` to indicate that the current value of the editor is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid?: boolean;

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
    public change: EventEmitter<{ html: string }>;

    private disabledKey: PluginKey;
    private placeholderKey: PluginKey;
    private readonlyKey: PluginKey;

    @Watch('disabled')
    public watchDisabled() {
        this.view.dispatch(
            this.view.state.tr.setMeta(this.disabledKey, this.disabled),
        );
    }

    @Watch('placeholder')
    public watchPlaceholder() {
        this.view.dispatch(
            this.view.state.tr.setMeta(this.placeholderKey, this.placeholder),
        );
    }

    @Watch('readonly')
    public watchReadonly() {
        this.view.dispatch(
            this.view.state.tr.setMeta(this.readonlyKey, this.readonly),
        );
    }

    public connectedCallback() {
        this.disabledKey = new PluginKey('disabled');
        this.placeholderKey = new PluginKey('placeholder');
        this.readonlyKey = new PluginKey('readonly');
    }

    public componentWillLoad() {}

    public render() {
        return [<label>{this.label}</label>, <div id="editor" />];
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
        const disabledPlugin = createDisabledPlugin(
            this.disabled,
            this.disabledKey,
        );

        const placeholderPlugin = createPlaceholderPlugin(
            this.placeholder,
            this.placeholderKey,
        );

        const readOnlyPlugin = createReadOnlyPlugin(
            this.readonly,
            this.readonlyKey,
        );

        return [
            ...exampleSetup({ schema: mySchema }),
            disabledPlugin,
            placeholderPlugin,
            readOnlyPlugin,
        ];
    };
}
