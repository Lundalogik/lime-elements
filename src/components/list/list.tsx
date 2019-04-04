import { MDCList, MDCListActionEvent } from '@lime-material-16px/list';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';
import { ListRenderer } from './list-renderer';
import { ListRendererConfig } from './list-renderer-config';

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
     * True if the items in the list should be selectable/clickable
     */
    @Prop()
    public selectable: boolean;

    /**
     * True if the list should display larger icons with a background
     */
    @Prop()
    public badgeIcons: boolean;

    /**
     * True if it should be possible to select multiple items
     */
    @Prop()
    public multiple: boolean;

    @Element()
    private element: HTMLElement;

    private mdcList: MDCList;
    private listRenderer = new ListRenderer();
    private config: ListRendererConfig;

    /**
     * Fired when a new value has been selected from the list. Only fired if selectable is set to true
     */
    @Event()
    private change: EventEmitter<ListItem | ListItem[]>;

    constructor() {
        this.handleAction = this.handleAction.bind(this);
    }

    public componentDidLoad() {
        this.mdcList = new MDCList(
            this.element.shadowRoot.querySelector('.mdc-list')
        );

        if (!this.selectable) {
            return;
        }

        this.mdcList.listen('MDCList:action', this.handleAction);
        this.mdcList.singleSelection = !this.multiple;
    }

    public componentDidUnload() {
        if (this.selectable) {
            this.mdcList.unlisten('MDCList:action', this.handleAction);
        }

        this.mdcList.destroy();
    }

    public render() {
        this.config = {
            selectable: this.selectable,
            badgeIcons: this.badgeIcons,
            multiple: this.multiple,
        };
        return this.listRenderer.render(this.items, this.config);
    }

    private handleAction(event: MDCListActionEvent) {
        if (!this.multiple) {
            this.handleSingleSelect(event.detail);
            return;
        }

        this.handleMultiSelect(event.detail);
    }

    private handleSingleSelect(index: number) {
        const listItems: ListItem[] = this.items.filter(item => {
            return !('separator' in item) && !item.disabled;
        }) as ListItem[];
        const selectedItem: ListItem = listItems.find((item: ListItem) => {
            return !!item.selected;
        });

        if (selectedItem) {
            this.change.emit({ ...selectedItem, selected: false });
        }

        if (listItems[index] !== selectedItem) {
            this.change.emit({ ...listItems[index], selected: true });
        }
    }

    private handleMultiSelect(index: number) {
        const listItems = this.items.filter(item => {
            return !('separator' in item) && !item.disabled;
        });
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
}
