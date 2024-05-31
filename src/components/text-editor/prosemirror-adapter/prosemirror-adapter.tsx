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
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListSeparator } from 'src/components/list/list-item.types';
import { CommandWithActive, MenuCommandFactory } from './menu/menu-commands';
import { menuTranslationIDs, getTextEditorMenuItems } from './menu/menu-items';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { markdownConverter } from '../utils/markdown-converter';
import { HTMLConverter } from '../utils/html-converter';
import { EditorMenuTypes } from './menu/types';
import translate from 'src/global/translations';
import { isItem } from 'src/components/action-bar/isItem';
import { cloneDeep } from 'lodash-es';
import { Languages } from '../../date-picker/date.types';
import { strikethrough } from './menu/menu-schema-extender';

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

    /**
     * Defines the language for translations.
     */
    @Prop({ reflect: true })
    public language: Languages;

    @Element()
    private host: HTMLLimelTextEditorElement;

    @State()
    private view: EditorView;

    @State()
    private actionBarItems: Array<
        ActionBarItem<EditorMenuTypes> | ListSeparator
    > = [];

    private menuCommandFactory: MenuCommandFactory;
    private schema: Schema;
    private contentConverter: ContentTypeConverter;
    private suppressChangeEvent = false;

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<string>;

    @Watch('value')
    protected watchValue(newValue: string) {
        if (
            !this.view ||
            newValue === this.contentConverter.serialize(this.view, this.schema)
        ) {
            return;
        }

        this.updateView(newValue);
    }

    public componentWillLoad() {
        this.getActionBarItems();
        this.setupContentConverter();
    }

    public componentDidLoad() {
        // Stencil complains loudly about triggering rerenders in
        // componentDidLoad, but we have to, so we're using setTimeout to
        // suppress the warning. /Ads
        setTimeout(() => {
            this.initializeTextEditor();
        }, 0);
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

    public disconnectedCallback() {
        this.view.destroy();
    }

    private setupContentConverter() {
        if (this.contentType === 'markdown') {
            this.contentConverter = new markdownConverter();
        } else if (this.contentType === 'html') {
            this.contentConverter = new HTMLConverter();
        } else {
            throw new Error(
                `Unsupported content type: ${this.contentType}. Only 'markdown' and 'html' are supported.`,
            );
        }
    }

    private getActionBarItems = () => {
        this.actionBarItems = getTextEditorMenuItems().map(
            this.getTranslatedItem,
        );
    };

    private getTranslatedItem = (item) => {
        const newItem = cloneDeep(item);

        if (isItem(item)) {
            const translationId = menuTranslationIDs[item.value];

            if (translationId) {
                newItem.text = translate.get(translationId, this.language);
            }
        }

        return newItem;
    };

    private async initializeTextEditor() {
        this.schema = this.initializeSchema();
        const initialDoc = await this.parseInitialContent();
        this.menuCommandFactory = new MenuCommandFactory(this.schema);
        this.view = new EditorView(
            this.host.shadowRoot.querySelector('#editor'),
            {
                state: this.createEditorState(initialDoc),
                dispatchTransaction: this.handleTransaction,
            },
        );
        if (this.value) {
            this.updateView(this.value);
        }
    }

    private initializeSchema() {
        return new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks.append({
                strikethrough: strikethrough,
            }),
        });
    }

    private async parseInitialContent() {
        const initialContentElement = document.createElement('div');

        if (this.value) {
            initialContentElement.innerHTML =
                await this.contentConverter.parseAsHTML(
                    this.value,
                    this.schema,
                );
        } else {
            initialContentElement.innerHTML = '<p></p>';
        }

        return DOMParser.fromSchema(this.schema).parse(initialContentElement);
    }

    private createEditorState(initialDoc) {
        return EditorState.create({
            doc: initialDoc,
            plugins: [
                ...exampleSetup({ schema: this.schema, menuBar: false }),
                keymap(this.menuCommandFactory.buildKeymap()),
                this.createMenuStateTrackingPlugin(this.actionBarItems),
            ],
        });
    }

    private async updateView(content: string) {
        this.suppressChangeEvent = true;
        const html = await this.contentConverter.parseAsHTML(
            content,
            this.schema,
        );
        const prosemirrorDOMparser = DOMParser.fromSchema(
            this.view.state.schema,
        );
        const domParser = new window.DOMParser();
        const doc = domParser.parseFromString(html, 'text/html');
        const prosemirrorDoc = prosemirrorDOMparser.parse(doc.body);
        const tr = this.view.state.tr;
        tr.replaceWith(0, tr.doc.content.size, prosemirrorDoc.content);
        this.view.dispatch(tr);
        this.suppressChangeEvent = false;
    }

    private handleTransaction = (transaction: Transaction) => {
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);

        if (this.suppressChangeEvent) {
            return;
        }

        if (transaction.getMeta('pointer')) {
            return;
        }

        this.change.emit(
            this.contentConverter.serialize(this.view, this.schema),
        );
    };

    private handleActionBarItem = (
        event: CustomEvent<ActionBarItem<EditorMenuTypes>>,
    ) => {
        event.preventDefault();
        const { value } = event.detail;

        try {
            const command = this.menuCommandFactory.getCommand(value);
            this.dispatchMenuCommand(command);
        } catch (error) {
            throw new Error(`Error executing command: ${error}`);
        }
    };

    private dispatchMenuCommand(command) {
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

    actionBarPluginKey = new PluginKey('actionBarPlugin');

    private updateActionBarItems = (
        actionBarItems: Array<ActionBarItem<EditorMenuTypes> | ListSeparator>,
        view: EditorView,
    ) => {
        const updatedItems = cloneDeep(actionBarItems);
        updatedItems.forEach((item) => {
            if (isItem(item)) {
                const command: CommandWithActive =
                    this.menuCommandFactory.getCommand(item.value);
                if (command && command.active) {
                    item.selected = command.active(view.state);
                } else {
                    item.selected = false;
                }
            }
        });
        this.actionBarItems = updatedItems;
    };

    private createMenuStateTrackingPlugin = (
        actionBarItems: Array<ActionBarItem<EditorMenuTypes> | ListSeparator>,
    ) => {
        return new Plugin({
            key: this.actionBarPluginKey,
            view: () => ({
                update: (view) => {
                    this.updateActionBarItems(actionBarItems, view);
                },
            }),
        });
    };
}
