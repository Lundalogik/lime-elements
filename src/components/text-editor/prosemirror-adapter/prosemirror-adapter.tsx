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
import { keymap } from 'prosemirror-keymap';
import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';
import { MenuCommandFactory } from './menu/menu-commands';
import { textEditorMenuItems } from './menu/menu-items';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { markdownConverter } from '../utils/markdown-converter';
import { HTMLConverter } from '../utils/html-converter';
import { EditorMenuTypes } from './menu/types';

/**
 * The ProseMirror adapter offers a rich text editing experience with markdown support.
 * [Read more...](https://prosemirror.net/)
 *
 * @exampleComponent limel-example-prosemirror-adapter-basic
 * @exampleComponent limel-example-prosemirror-adapter-with-custom-menu
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
     * The type of content that the editor should handle and emit, defaults to `markdown`
     *
     * Assumed to be set only once, so not reactive to changes
     */
    @Prop()
    public contentType: 'markdown' | 'html' = 'markdown';

    /**
     * The value of the editor, expected to be markdown
     */
    @Prop()
    public value: string;

    @Element()
    private host: HTMLLimelTextEditorElement;

    @State()
    private view: EditorView;

    @State()
    private actionBarItems: Array<
        ActionBarItem<EditorMenuTypes> | ListSeparator
    > = [];

    private menuCommandFactory: MenuCommandFactory;
    private editorKeyMap = {};

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<string>;

    @Watch('value')
    protected watchValue(newValue: string) {
        if (
            !this.view ||
            newValue === this.contentConverter.serialize(this.view, schema)
        ) {
            return;
        }

        this.updateView(newValue);
    }

    private contentConverter: ContentTypeConverter;

    public componentWillLoad() {
        if (this.contentType === 'markdown') {
            this.contentConverter = new markdownConverter();
        } else if (this.contentType === 'html') {
            this.contentConverter = new HTMLConverter();
        }
    }

    public componentDidLoad() {
        // Stencil complains loudly about triggering rerenders in
        // componentDidLoad, but we have to, so we're using setTimeout to
        // suppress the warning. /Ads
        setTimeout(this.initializeTextEditor, 0);
    }

    public render() {
        return [
            <div id="editor" />,
            <limel-action-bar
                accessibleLabel="Toolbar"
                actions={this.actionBarItems}
                onItemSelected={this.handleActionBarItem}
            />,
        ];
    }

    private initializeTextEditor = async () => {
        this.actionBarItems = textEditorMenuItems;

        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks,
        });

        // Parse initial content directly if 'value' is provided
        const initialContentElement = document.createElement('div');
        initialContentElement.innerHTML = '<p></p>';
        if (this.value) {
            initialContentElement.innerHTML =
                await this.contentConverter.parseAsHTML(this.value, schema);
        }

        const initialDoc = DOMParser.fromSchema(mySchema).parse(
            initialContentElement,
        );

        this.menuCommandFactory = new MenuCommandFactory(mySchema);

        this.editorKeyMap = this.menuCommandFactory.buildKeymap();

        const keymapPlugin = keymap(this.editorKeyMap);

        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: EditorState.create({
                    doc: initialDoc,
                    plugins: [
                        ...exampleSetup({
                            schema: mySchema,
                            menuBar: false,
                        }),
                        keymapPlugin,
                    ],
                }),
                dispatchTransaction: (transaction) => {
                    const newState = this.view.state.apply(transaction);
                    this.view.updateState(newState);

                    this.change.emit(
                        this.contentConverter.serialize(this.view, schema),
                    );
                },
            },
        );

        this.menuCommandFactory = new MenuCommandFactory(mySchema);

        if (this.value) {
            this.updateView(this.value);
        }
    };

    private async updateView(content: string) {
        const html = await this.contentConverter.parseAsHTML(content, schema);
        const prosemirrorDOMparser = DOMParser.fromSchema(
            this.view.state.schema,
        );
        const domParser = new window.DOMParser();
        const doc = domParser.parseFromString(html, 'text/html');
        const prosemirrorDoc = prosemirrorDOMparser.parse(doc.body);
        const tr = this.view.state.tr;
        tr.replaceWith(0, tr.doc.content.size, prosemirrorDoc.content);

        this.view.dispatch(tr);
    }

    private handleActionBarItem = (event: CustomEvent<ActionBarItem>) => {
        event.preventDefault();

        const { value } = event.detail;
        try {
            const command = this.menuCommandFactory.getCommand(value);
            this.executeCommand(command);
        } catch (error) {
            throw new Error(`Error executing command: ${error}`);
        }
    };

    private executeCommand(command) {
        const { state } = this.view;
        const selection = state.selection;

        let transaction = state.tr;

        if (!selection.empty) {
            transaction.setSelection(selection);
        }

        command(state, (tr) => {
            transaction = tr;
        });
        this.view.dispatch(transaction);

        this.setFocus();
    }

    public setFocus() {
        this.view?.focus();
    }
}
