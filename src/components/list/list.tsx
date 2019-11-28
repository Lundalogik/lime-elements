import {
    IconSize,
    ListItem,
    ListSeparator,
    ListType,
} from '@limetech/lime-elements';
import { MDCList, MDCListActionEvent } from '@limetech/mdc-list';
import { strings } from '@limetech/mdc-list/constants';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';
import { ListRenderer } from './list-renderer';
import { ListRendererConfig } from './list-renderer-config';

const { ACTION_EVENT } = strings;

@Component({
    tag: 'limel-list',
    shadow: true,
    styleUrl: 'list.scss',
})
export class List {
    /**
     * List of items to display
     */
    @Prop()
    public items: Array<ListItem | ListSeparator>;

    /**
     * Set to `true` if the list should display larger icons with a background
     */
    @Prop()
    public badgeIcons: boolean;

    /**
     * Size of the icons in the list
     */
    @Prop()
    public iconSize: IconSize = 'small';

    /**
     * The type of the list, omit to get a regular list. Available types are:
     * `selectable`: regular list with single selection.
     * `radio`: radio button list with single selection.
     * `checkbox`: checkbox list with multiple selection.
     */
    @Prop()
    public type: ListType;

    @Element()
    private element: HTMLElement;

    private config: ListRendererConfig;
    private listRenderer = new ListRenderer();
    private mdcList: MDCList;
    private multiple: boolean;
    private selectable: boolean;

    /**
     * Fired when a new value has been selected from the list. Only fired if selectable is set to true
     */
    @Event()
    private change: EventEmitter<ListItem | ListItem[]>;

    constructor() {
        this.handleAction = this.handleAction.bind(this);
    }

    public connectedCallback() {
        this.setup();
    }

    public disconnectedCallback() {
        this.teardown();
    }

    public componentDidLoad() {
        this.setup();
    }

    public render() {
        this.config = {
            badgeIcons: this.badgeIcons,
            type: this.type,
            iconSize: this.iconSize,
        };
        return this.listRenderer.render(this.items, this.config);
    }

    @Watch('type')
    protected handleType() {
        this.setupListeners();
    }

    private setup() {
        const element = this.element.shadowRoot.querySelector('.mdc-list');
        if (!element) {
            return;
        }

        this.mdcList = new MDCList(element);

        this.setupListeners();
    }

    private setupListeners() {
        this.mdcList.unlisten(ACTION_EVENT, this.handleAction);

        this.selectable = ['selectable', 'radio', 'checkbox'].includes(
            this.type
        );
        this.multiple = this.type === 'checkbox';

        if (!this.selectable) {
            return;
        }

        this.mdcList.listen(ACTION_EVENT, this.handleAction);
        this.mdcList.singleSelection = !this.multiple;
    }

    private teardown() {
        if (this.selectable) {
            this.mdcList.unlisten(ACTION_EVENT, this.handleAction);
        }

        this.mdcList.destroy();
    }

    private handleAction(event: MDCListActionEvent) {
        if (!this.multiple) {
            this.handleSingleSelect(event.detail.index);
            return;
        }

        this.handleMultiSelect(event.detail.index);
    }

    private handleSingleSelect(index: number) {
        const listItems = this.items.filter(this.isListItem) as ListItem[];
        if (listItems[index].disabled) {
            return;
        }

        const selectedItem: ListItem = listItems.find((item: ListItem) => {
            return !!item.selected;
        });

        if (selectedItem) {
            if (this.type === 'radio' && listItems[index] === selectedItem) {
                return;
            }
            this.change.emit({ ...selectedItem, selected: false });
        }

        if (listItems[index] !== selectedItem) {
            this.change.emit({ ...listItems[index], selected: true });
        }
    }

    private handleMultiSelect(index: number) {
        const listItems = this.items.filter(this.isListItem) as ListItem[];
        if (listItems[index].disabled) {
            return;
        }

        const selectedItems: ListItem[] = listItems
            .filter((item: ListItem, listIndex: number) => {
                if (listIndex === index) {
                    // This is the item that was selected or deselected,
                    // so we negate its previous selection status.
                    return !item.selected;
                }

                // This is an item that didn't change, so we keep its selection status.
                return item.selected;
            })
            .map((item: ListItem) => {
                return { ...item, selected: true };
            });

        this.change.emit(selectedItems);
    }

    private isListItem(item: ListItem): boolean {
        return !('separator' in item);
    }
}
