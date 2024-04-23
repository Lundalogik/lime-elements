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
import { Schema, DOMParser, Node } from 'prosemirror-model';
import {
    defaultMarkdownSerializer,
    defaultMarkdownParser,
} from 'prosemirror-markdown';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';
import { MenuCommandFactory } from './menu/menu-commands';
import { textEditorMenuItems } from './menu/menu-items';

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
     * The value of the editor, expected to be markdown
     */
    @Prop()
    public value: string;

    @Element()
    private host: HTMLLimelTextEditorElement;

    @State()
    private view: EditorView;

    @State()
    private actionBarItems: Array<ActionBarItem | ListSeparator> = [];

    private menuCommandFactory: MenuCommandFactory;

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<string>;

    public componentDidLoad() {
        // Stencil complains loudly about triggering rerenders in
        // componentDidLoad, but we have to, so we're using setTimeout to
        // suppress the warning. /Ads
        setTimeout(this.initializeEditor, 0);
    }

    public render() {
        return [
            <limel-action-bar
                accessibleLabel="Toolbar"
                actions={this.actionBarItems}
                onItemSelected={this.handleActionBarItem}
            />,
            <div id="editor" />,
        ];
    }

    private initializeEditor = () => {
        this.actionBarItems = textEditorMenuItems;

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
                    plugins: exampleSetup({
                        schema: mySchema,
                        menuBar: false,
                    }),
                }),
                dispatchTransaction: (transaction) => {
                    const newState = this.view.state.apply(transaction);
                    this.view.updateState(newState);

                    this.change.emit(this.getMarkdown());
                },
            },
        );

        this.menuCommandFactory = new MenuCommandFactory(mySchema);

        const doc: Node = defaultMarkdownParser.parse(this.value);
        if (this.value && doc) {
            this.setDocument(doc);
        }
    };

    private setDocument = (doc: Node) => {
        const newState = EditorState.create({
            doc: doc,
            schema: this.view.state.schema,
            plugins: this.view.state.plugins,
            storedMarks: this.view.state.storedMarks,
        });

        this.view.updateState(newState);
    };

    private getMarkdown = (): string => {
        if (this.view.dom.textContent === '') {
            return '';
        } else {
            return defaultMarkdownSerializer.serialize(this.view.state.doc);
        }
    };

    private handleActionBarItem = (event: CustomEvent<ActionBarItem>) => {
        event.preventDefault();

        const { text } = event.detail;
        const mark = text.replace(/\s/g, '').toLowerCase();
        try {
            const command = this.menuCommandFactory.createCommand(mark);
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

        this.view.focus();
    }
}
