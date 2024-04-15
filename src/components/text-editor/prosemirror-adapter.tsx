import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
    h,
} from '@stencil/core';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { MenuElement, MenuItem } from 'prosemirror-menu';
import { buildFullMenu } from './menu/full-menu';
import { getFilteredMenu } from './menu/menu-filter';

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

        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: EditorState.create({
                    doc: DOMParser.fromSchema(mySchema).parse(
                        this.host.shadowRoot.querySelector('#editor'),
                    ),
                    plugins: exampleSetup({
                        schema: mySchema,
                        menuContent: menu as MenuItem[][],
                    }),
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

    private getHTML = (): string => {
        if (this.view.dom.textContent === '') {
            return '';
        } else {
            return this.view.dom.innerHTML;
        }
    };
}
