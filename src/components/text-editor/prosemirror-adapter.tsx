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
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { MenuElement, MenuItem } from 'prosemirror-menu';
import { buildFullMenu } from './menu/full-menu';
import { getFilteredMenu } from './menu/menu-filter';
import { createPlaceholderPlugin } from './plugins/placeholder';

/**
 * The ProseMirror adapter offers a rich text editing experience with markdown support,
 * in the sense that you can easily type markdown syntax and see the rendered
 * result as rich text in real-time. For instance, you can type `# Hello, world!`
 * and see it directly turning to a heading 1 (an `<h1>` HTML element).
 *
 * Naturally, you can use standard keyboard hotkeys such as <kbd>Ctrl</kbd> + <kbd>B</kbd>
 * to toggle bold text, <kbd>Ctrl</kbd> + <kbd>I</kbd> to toggle italic text, and so on.
 *
 * @exampleComponent limel-example-prosemirror-adapter-basic
 * @exampleComponent limel-example-prosemirror-adapter-composite
 * @beta
 * @private
 */
@Component({
    tag: 'limel-prosemirror-adapter',
    shadow: true,
    styleUrl: 'prosemirror-adapter.scss',
})
export class ProsemirrorAdapter {
    /**
     * The placeholder text shown inside the input field,
     * when the field is empty.
     */
    @Prop({ reflect: true })
    public placeholder?: string;

    /**
     * The value of the editor
     */
    @Prop()
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
        return <div id="editor" />;
    }

    public componentDidLoad() {
        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks,
        });

        const menu: MenuElement[][] = buildFullMenu(mySchema)
            .map((items) => getFilteredMenu(items, undefined))
            .filter((items) => items.length);

        const plugins = this.getPlugins(mySchema, menu);

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

                    this.change.emit({ html: this.getHTML() });
                },
            },
        );

        if (this.value) {
            this.view.dom.innerHTML = this.value.html;
        }
    }

    private getPlugins = (
        mySchema: Schema,
        menu: MenuElement[][],
    ): Plugin[] => {
        const placeholderPlugin = createPlaceholderPlugin(
            this.placeholder,
            this.placeholderKey,
        );

        return [
            ...exampleSetup({
                schema: mySchema,
                menuContent: menu as MenuItem[][],
            }),
            placeholderPlugin,
        ];
    };

    private getHTML = (): string => {
        if (
            this.view.dom.textContent === '' ||
            (this.view.dom.textContent === this.placeholder &&
                this.view.dom.innerHTML !== `<p>${this.placeholder}</p>`) // TODO: this is a little too coupled to the placeholder plugin)
        ) {
            return '';
        } else {
            return this.view.dom.innerHTML;
        }
    };
}
