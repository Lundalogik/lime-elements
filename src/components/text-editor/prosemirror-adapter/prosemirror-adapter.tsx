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
     * The value of the editor, expected to be serialised HTML
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

    public render() {
        return (
            <div>
                <limel-action-bar
                    accessibleLabel="Toolbar"
                    actions={this.actionBarItems}
                    layout="fullWidth"
                    onItemSelected={this.handleActionBarItem}
                />
                <div id="editor" />
            </div>
        );
    }

    public componentDidLoad() {
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

                    this.change.emit(this.getHTML());
                },
            },
        );

        this.menuCommandFactory = new MenuCommandFactory(mySchema);

        if (this.value) {
            this.view.dom.innerHTML = this.value;
        }
    }

    private getHTML = (): string => {
        if (this.view.dom.textContent === '') {
            return '';
        } else {
            return this.view.dom.innerHTML;
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
