import {
    Component,
    Element,
    Event,
    EventEmitter,
    Host,
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
import { ListSeparator } from 'src/components/list/list-item.types';
import { MenuCommandFactory } from './menu/menu-commands';
import { menuTranslationIDs, getTextEditorMenuItems } from './menu/menu-items';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { MarkdownConverter } from '../utils/markdown-converter';
import { HTMLConverter } from '../utils/html-converter';
import {
    EditorMenuTypes,
    EditorTextLink,
    editorMenuTypesArray,
} from './menu/types';
import translate from 'src/global/translations';
import { createRandomString } from 'src/util/random-string';
import { isItem } from 'src/components/action-bar/isItem';
import { cloneDeep, debounce } from 'lodash-es';
import { Languages } from '../../date-picker/date.types';
import { strikethrough } from './menu/menu-schema-extender';
import {
    EditorLinkMenuEventDetail,
    createLinkPlugin,
} from './plugins/link-plugin';
import { createImageInserterPlugin } from './plugins/image/inserter';
import { createImageViewPlugin } from './plugins/image/view';
import { createMenuStateTrackingPlugin } from './plugins/menu-state-tracking-plugin';
import { createActionBarInteractionPlugin } from './plugins/menu-action-interaction-plugin';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';
import { createNodeSpec } from '../utils/plugin-factory';
import { createTriggerPlugin } from './plugins/trigger/factory';
import {
    TriggerCharacter,
    ImageInserter,
    ImageInfo,
} from '../text-editor.types';
import { getTableNodes, getTableEditingPlugins } from './plugins/table-plugin';
import { getImageNode, imageCache } from './plugins/image/node';

const DEBOUNCE_TIMEOUT = 300;

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
    shadow: { delegatesFocus: true },
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

    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled?: boolean = false;

    /**
     * set to private to avoid usage while under development
     *
     * @private
     * @alpha
     */
    @Prop()
    customElements: CustomElementDefinition[] = [];

    /**
     * set to private to avoid usage while under development
     *
     * @private
     * @alpha
     */
    @Prop()
    triggerCharacters: TriggerCharacter[] = [];

    @Element()
    private host: HTMLLimelTextEditorElement;

    private portalId: string;

    @State()
    private view: EditorView;

    @State()
    private actionBarItems: Array<
        ActionBarItem<EditorMenuTypes> | ListSeparator
    > = [];

    @State()
    private link: EditorTextLink = { href: 'https://' };

    /**
     * Open state of the dialog
     */
    @State()
    public isLinkMenuOpen: boolean = false;

    private menuCommandFactory: MenuCommandFactory;
    private schema: Schema;
    private contentConverter: ContentTypeConverter;
    private actionBarElement: HTMLElement;
    private lastEmittedValue: string;
    private changeWaiting = false;

    /**
     *  Used to stop change event emitting as result of getting updated value from consumer
     */
    private suppressChangeEvent = false;

    /**
     * Dispatched when a change is made to the editor
     */
    @Event()
    private change: EventEmitter<string>;

    /**
     * Dispatched when a image is pasted into the editor
     *
     * @private
     * @alpha
     */
    @Event()
    private imagePasted: EventEmitter<ImageInserter>;

    /**
     * Dispatched when a image is removed from the editor
     *
     * @private
     * @alpha
     */
    @Event()
    private imageRemoved: EventEmitter<ImageInfo>;

    constructor() {
        this.portalId = createRandomString();
    }

    @Watch('value')
    protected watchValue(newValue: string) {
        if (!this.view) {
            return;
        }

        if (this.changeWaiting) {
            // A change is pending; do not update the editor's content
            return;
        }

        const currentContent = this.contentConverter.serialize(
            this.view,
            this.schema,
        );

        // If the new value is the same as the current content, do nothing
        if (newValue === currentContent) {
            return;
        }

        // Update the editor's content with the new value
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

    public connectedCallback() {
        if (this.view) {
            this.initializeTextEditor();
        }

        this.host.addEventListener(
            'open-editor-link-menu',
            this.handleOpenLinkMenu,
        );
    }

    public disconnectedCallback() {
        imageCache.clear();

        this.host.removeEventListener(
            'open-editor-link-menu',
            this.handleOpenLinkMenu,
        );
        this.view?.dom?.removeEventListener('blur', this.handleBlur);
        this.view?.destroy();
    }

    public render() {
        return (
            <Host onFocus={this.handleFocus}>
                <div id="editor" />
                <div class="toolbar">
                    <limel-action-bar
                        ref={(el) => (this.actionBarElement = el)}
                        accessibleLabel="Toolbar"
                        actions={this.actionBarItems}
                        onItemSelected={this.handleActionBarItem}
                    />
                </div>
                {this.renderLinkMenu()}
            </Host>
        );
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

    private setupContentConverter() {
        if (this.contentType === 'markdown') {
            this.contentConverter = new MarkdownConverter(
                this.customElements,
                this.language,
            );
        } else if (this.contentType === 'html') {
            this.contentConverter = new HTMLConverter(this.customElements);
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

        this.view.dom.addEventListener('blur', this.handleBlur);

        if (this.value) {
            this.updateView(this.value);
        }
    }

    private initializeSchema() {
        let nodes = schema.spec.nodes;

        this.customElements.forEach((customElement) => {
            const newNodeSpec = createNodeSpec(customElement);
            const nodeName = customElement.tagName;

            nodes = nodes.append({ [nodeName]: newNodeSpec });
        });
        nodes = addListNodes(nodes, 'paragraph block*', 'block');

        if (this.contentType === 'html') {
            nodes = nodes.append(getTableNodes());
        }

        nodes = nodes.append(getImageNode(this.language));

        return new Schema({
            nodes: nodes,
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
                createTriggerPlugin(
                    this.triggerCharacters,
                    this.contentConverter,
                ),
                createLinkPlugin(this.handleNewLinkSelection),
                createImageInserterPlugin(
                    this.imagePasted.emit,
                    this.imageRemoved.emit,
                ),
                createImageViewPlugin(this.language),
                createMenuStateTrackingPlugin(
                    editorMenuTypesArray,
                    this.menuCommandFactory,
                    this.updateActiveActionBarItems,
                ),
                createActionBarInteractionPlugin(this.menuCommandFactory),
                ...getTableEditingPlugins(this.contentType === 'html'),
            ],
        });
    }

    private updateActiveActionBarItems = (
        activeTypes: Record<EditorMenuTypes, boolean>,
        allowedTypes: Record<EditorMenuTypes, boolean>,
    ) => {
        const newItems = getTextEditorMenuItems().map((item) => {
            if (isItem(item)) {
                return {
                    ...item,
                    selected: activeTypes[item.value],
                    allowed: allowedTypes[item.value],
                };
            }

            return item;
        });

        this.actionBarItems = newItems.filter((item) =>
            isItem(item) ? item.allowed : true,
        );
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

        if (this.suppressChangeEvent || transaction.getMeta('pointer')) {
            return;
        }

        const content = this.contentConverter.serialize(this.view, this.schema);

        if (content === this.lastEmittedValue) {
            return;
        }

        this.lastEmittedValue = content;
        this.changeWaiting = true;
        this.changeEmitter(content);
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
        this.link = { text: '', href: 'https://' };
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

        this.link = { href: 'https://' };
    };

    private handleLinkChange = (event: CustomEvent<EditorTextLink>) => {
        this.link = event.detail;
    };

    private handleFocus = () => {
        if (!this.disabled) {
            this.view?.focus();
        }
    };

    private handleNewLinkSelection = (text: string, href: string) => {
        this.link.text = text;
        this.link.href = href || 'https://';
    };

    private handleOpenLinkMenu = (
        event: CustomEvent<EditorLinkMenuEventDetail>,
    ) => {
        event.stopImmediatePropagation();
        const { href, text } = event.detail;
        this.link = { href: href, text: text };
        this.isLinkMenuOpen = true;
    };

    private changeEmitter = debounce((value: string) => {
        this.change.emit(value);
        this.changeWaiting = false;
    }, DEBOUNCE_TIMEOUT);

    private handleBlur = () => {
        this.changeEmitter.flush();
    };
}
