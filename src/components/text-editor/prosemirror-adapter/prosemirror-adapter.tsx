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
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import { ActionBarItem } from 'src/components/action-bar/action-bar.types';
import { ListItem, ListSeparator } from 'src/components/list/list-item.types';
import { MenuCommandFactory } from './menu/menu-commands';
import { menuTranslationIDs, getTextEditorMenuItems } from './menu/menu-items';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { markdownConverter } from '../utils/markdown-converter';
import { HTMLConverter } from '../utils/html-converter';
import {
    EditorMenuTypes,
    EditorTextLink,
    editorMenuTypesArray,
} from './menu/types';
import translate from 'src/global/translations';
import { createRandomString } from 'src/util/random-string';
import { isItem } from 'src/components/action-bar/isItem';
import { cloneDeep } from 'lodash-es';
import { Languages } from '../../date-picker/date.types';
import { strikethrough } from './menu/menu-schema-extender';
import {
    EditorLinkMenuEventDetail,
    createLinkPlugin,
} from './plugins/link-plugin';
import { createImageRemoverPlugin } from './plugins/image-remover-plugin';
import { createMenuStateTrackingPlugin } from './plugins/menu-state-tracking-plugin';
import { createActionBarInteractionPlugin } from './plugins/menu-action-interaction-plugin';

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

    private portalId: string;

    @State()
    private view: EditorView;

    @State()
    private pickerQuery: string;

    @State()
    private actionBarItems: Array<
        ActionBarItem<EditorMenuTypes> | ListSeparator
    > = [];

    @State()
    private link: EditorTextLink = { href: '' };

    /**
     * Open state of the dialog
     */
    @State()
    public isLinkMenuOpen: boolean = false;

    /**
     * Open state of the picker
     */
    @State()
    public isPickerOpen: boolean = false;

    @State()
    private pickerItems: ListItem[] = [];

    private selectedItem: ListItem<number>;

    private fakeMentionItems: Array<ListItem<number>> = [
        {
            text: 'Captain Kirk',
            value: 1,
            secondaryText: 'commander',
        },
        { text: 'Spock', value: 2, secondaryText: 'scienceOfficer' },
        { text: 'Scottie Mc Beamin', value: 3, secondaryText: 'beamManager' },
        { text: 'Data', value: 4, secondaryText: 'android' },
        { text: 'Worff', value: 5, secondaryText: 'security' },
        { text: 'Uhura', value: 6, secondaryText: 'communications' },
    ];

    private menuCommandFactory: MenuCommandFactory;
    private schema: Schema;
    private contentConverter: ContentTypeConverter;
    private actionBarElement: HTMLElement;

    /**
     *  Used to stop change event emitting as result of getting updated value from consumer
     */
    private suppressChangeEvent = false;

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<string>;

    constructor() {
        this.portalId = createRandomString();
    }

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
        this.pickerItems = this.fakeMentionItems;
    }

    public componentDidLoad() {
        // Stencil complains loudly about triggering rerenders in
        // componentDidLoad, but we have to, so we're using setTimeout to
        // suppress the warning. /Ads
        setTimeout(() => {
            this.initializeTextEditor();
        }, 0);
    }

    public connectedCallback() {
        if (this.view) {
            this.initializeTextEditor();
        }

        this.host.addEventListener(
            'open-editor-link-menu',
            this.handleOpenLinkMenu,
        );

        this.host.addEventListener('open-picker', this.handleOpenPicker);
        this.host.addEventListener('close-picker', this.handleClosePicker);
        this.host.addEventListener(
            'mention-picker-change',
            this.handleQueryChange,
        );
        this.host.addEventListener('mention-picker-saver', this.selectItem);
    }

    public disconnectedCallback() {
        this.host.removeEventListener(
            'open-editor-link-menu',
            this.handleOpenLinkMenu,
        );
        this.host.removeEventListener('open-picker', this.handleOpenPicker);
        this.host.removeEventListener('close-picker', this.handleClosePicker);
        this.host.removeEventListener(
            'mention-picker-change',
            this.handleQueryChange,
        );
        this.host.removeEventListener('mention-picker-saver', this.selectItem);
        this.view.destroy();
    }

    public render() {
        return [
            <div id="editor" />,
            <div class="toolbar">
                <limel-action-bar
                    ref={(el) => (this.actionBarElement = el)}
                    accessibleLabel="Toolbar"
                    actions={this.actionBarItems}
                    onItemSelected={this.handleActionBarItem}
                />
            </div>,
            this.renderLinkMenu(),
            this.renderPicker(),
        ];
    }

    renderLinkMenu() {
        if (!this.isLinkMenuOpen) {
            return;
        }

        return (
            <limel-portal
                containerId={this.portalId}
                visible={this.isLinkMenuOpen}
                openDirection="top"
                inheritParentWidth={true}
                anchor={this.actionBarElement}
            >
                <limel-text-editor-link-menu
                    link={this.link}
                    isOpen={this.isLinkMenuOpen}
                    onLinkChange={this.handleLinkChange}
                    onCancel={this.handleCancelLinkMenu}
                    onSave={this.handleSaveLinkMenu}
                />
            </limel-portal>
        );
    }

    renderPicker() {
        if (!this.isPickerOpen) {
            return;
        }

        return (
            <limel-portal
                containerId={this.portalId}
                visible={this.isPickerOpen}
                openDirection="top"
                inheritParentWidth={true}
                anchor={this.actionBarElement}
            >
                <limel-text-editor-picker items={this.pickerItems} />
            </limel-portal>
        );
    }

    private handleClosePicker = (event: CustomEvent<void>) => {
        event.stopPropagation();
        this.isPickerOpen = false;
    };

    private handleOpenPicker = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.isPickerOpen = true;
    };

    private handleQueryChange = (event: CustomEvent<string>) => {
        event.stopImmediatePropagation();
        this.pickerQuery = event.detail;
        this.search(this.pickerQuery).then((items) => {
            this.pickerItems = items;
        });
    };

    private search = (query: string): Promise<ListItem[]> => {
        return new Promise((resolve) => {
            if (query === '') {
                return resolve(this.fakeMentionItems);
            }

            const filteredItems = this.fakeMentionItems.filter((item) => {
                return item.text.toLowerCase().includes(query.toLowerCase());
            });

            return resolve(filteredItems);
        });
    };

    private selectItem = () => {
        this.selectedItem = this.pickerItems[0];
        const customEvent = new CustomEvent('item-selected', {
            detail: this.selectedItem,
            bubbles: true,
            composed: true,
        });
        this.view.dom.dispatchEvent(customEvent);
    };

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
                createLinkPlugin(this.handleNewLinkSelection),
                createImageRemoverPlugin(),
                createMenuStateTrackingPlugin(
                    editorMenuTypesArray,
                    this.menuCommandFactory,
                    this.updateActiveActionBarItems,
                ),
                createActionBarInteractionPlugin(this.menuCommandFactory),
            ],
        });
    }

    private updateActiveActionBarItems = (
        activeTypes: Record<EditorMenuTypes, boolean>,
    ) => {
        const newItems = getTextEditorMenuItems().map((item) => {
            if (isItem(item)) {
                return {
                    ...item,
                    selected: activeTypes[item.value],
                };
            }

            return item;
        });

        this.actionBarItems = newItems;
    };

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
        event.stopImmediatePropagation();
        const { value } = event.detail;

        if (value === EditorMenuTypes.Link) {
            this.isLinkMenuOpen = true;

            return;
        }

        const actionBarEvent = new CustomEvent('actionBarItemClick', {
            detail: event.detail,
        });
        this.view.dom.dispatchEvent(actionBarEvent);
    };

    private handleCancelLinkMenu = (event: CustomEvent<void>) => {
        event.preventDefault();
        event.stopPropagation();

        this.isLinkMenuOpen = false;
        this.link = { text: '', href: '' };
    };

    private handleSaveLinkMenu = () => {
        this.isLinkMenuOpen = false;

        const saveLinkEvent = new CustomEvent('saveLinkMenu', {
            detail: {
                type: EditorMenuTypes.Link,
                link: this.link,
            },
        });
        this.view.dom.dispatchEvent(saveLinkEvent);

        this.link = { href: '' };
    };

    private handleLinkChange = (event: CustomEvent<EditorTextLink>) => {
        this.link = event.detail;
    };

    public setFocus() {
        this.view?.focus();
    }

    private handleNewLinkSelection = (text: string, href: string) => {
        this.link.text = text;
        this.link.href = href;
    };

    private handleOpenLinkMenu = (
        event: CustomEvent<EditorLinkMenuEventDetail>,
    ) => {
        event.stopImmediatePropagation();
        const { href, text } = event.detail;
        this.link = { href: href, text: text };
        this.isLinkMenuOpen = true;
    };
}
