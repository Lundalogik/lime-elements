import { IconSize } from '../icon/icon.types';
import { ListItem, ListSeparator } from './list-item.types';
import { ListType } from './list.types';
import { MDCList, MDCListActionEvent } from '@material/list';
import { strings as listStrings } from '@material/list/constants';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    Watch,
} from '@stencil/core';
import { ListRenderer } from './list-renderer';
import { ListRendererConfig } from './list-renderer-config';

const { ACTION_EVENT } = listStrings;

/**
 * @exampleComponent limel-example-list
 * @exampleComponent limel-example-list-secondary
 * @exampleComponent limel-example-list-separator
 * @exampleComponent limel-example-list-selectable
 * @exampleComponent limel-example-list-icons
 * @exampleComponent limel-example-list-badge-icons
 * @exampleComponent limel-example-list-pictures
 * @exampleComponent limel-example-list-checkbox
 * @exampleComponent limel-example-list-checkbox-icons
 * @exampleComponent limel-example-list-radio-button
 * @exampleComponent limel-example-list-radio-button-icons
 * @exampleComponent limel-example-list-action
 * @exampleComponent limel-example-list-striped
 * @exampleComponent limel-example-list-badge-icons-with-multiple-lines
 * @exampleComponent limel-example-list-grid
 * @exampleComponent limel-example-list-primary-component
 */
@Component({
    tag: 'limel-list',
    shadow: { delegatesFocus: true },
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

    /**
     * By default, lists will display 3 lines of text, and then truncate the rest.
     * Consumers can increase or decrease this number by specifying
     * `maxLinesSecondaryText`. If consumer enters zero or negative
     * numbers we default to 1; and if they type decimals we round up.
     */

    @Prop() maxLinesSecondaryText: number = 3;

    @Element()
    private element: HTMLLimelListElement;

    private config: ListRendererConfig;
    private listRenderer = new ListRenderer();
    private mdcList: MDCList;
    private multiple: boolean;
    private selectable: boolean;

    /**
     * Fired when a new value has been selected from the list.
     * Only fired if `type` is set to `selectable`, `radio` or `checkbox`.
     */
    @Event()
    private change: EventEmitter<ListItem | ListItem[]>;

    /**
     * Fired when an action has been selected from the action menu of a list item
     */
    @Event()
    protected select: EventEmitter<ListItem | ListItem[]>;

    /**
     * Fires when a user interacts with an item in the list (e.g., click,
     * keyboard select).
     */
    @Event()
    interact: EventEmitter<ListItem>;

    public connectedCallback() {
        this.setup();
    }

    public disconnectedCallback() {
        this.teardown();
    }

    public componentDidLoad() {
        this.setup();
        this.triggerIconColorWarning();
    }

    public render() {
        this.config = {
            badgeIcons: this.badgeIcons,
            type: this.type,
            iconSize: this.iconSize,
        };
        let maxLinesSecondaryText = +this.maxLinesSecondaryText?.toFixed();
        if (this.maxLinesSecondaryText < 1) {
            maxLinesSecondaryText = 1;
        }

        const html = this.listRenderer.render(this.items, this.config);

        return (
            <Host
                style={{
                    '--maxLinesSecondaryText': `${maxLinesSecondaryText}`,
                }}
            >
                {html}
            </Host>
        );
    }

    @Watch('type')
    protected handleType() {
        this.setupListeners();
    }

    @Watch('items')
    protected itemsChanged() {
        if (!this.mdcList) {
            return;
        }

        setTimeout(() => {
            this.setup();

            const listItems = this.items.filter(this.isListItem);

            if (this.multiple) {
                this.mdcList.selectedIndex = listItems
                    .filter((item: ListItem) => item.selected)
                    .map((item: ListItem) => listItems.indexOf(item));
            } else {
                const selectedIndex = listItems.findIndex(
                    (item: ListItem) => item.selected
                );

                if (selectedIndex === -1) {
                    this.mdcList.initializeListType();
                } else {
                    this.mdcList.selectedIndex = selectedIndex;
                }
            }
        }, 0);
    }

    private setup = () => {
        this.setupList();

        this.setupListeners();
    };

    private setupList = () => {
        if (this.mdcList) {
            this.teardown();
            this.mdcList = null;
        }

        const element = this.element.shadowRoot.querySelector(
            '.mdc-deprecated-list'
        );
        if (!element) {
            return;
        }

        this.mdcList = new MDCList(element);
        this.mdcList.hasTypeahead = true;
    };

    private setupListeners = () => {
        if (!this.mdcList) {
            return;
        }

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
    };

    private teardown = () => {
        this.mdcList?.unlisten(ACTION_EVENT, this.handleAction);
        this.mdcList?.destroy();
    };

    private handleAction = (event: MDCListActionEvent) => {
        if (!this.multiple) {
            this.handleSingleSelect(event.detail.index);

            return;
        }

        this.handleMultiSelect(event.detail.index);
    };

    private handleSingleSelect = (index: number) => {
        const listItems = this.items.filter(this.isListItem) as ListItem[];
        if (listItems[index].disabled) {
            return;
        }

        const selectedItem: ListItem = listItems.find((item: ListItem) => {
            return !!item.selected;
        });

        let interactedItem: ListItem;

        if (selectedItem) {
            if (this.type !== 'radio') {
                this.mdcList.selectedIndex = -1;
            }

            interactedItem = { ...selectedItem, selected: false };
            this.change.emit(interactedItem);
        }

        if (listItems[index] !== selectedItem) {
            interactedItem = { ...listItems[index], selected: true };
            this.change.emit(interactedItem);
        }

        this.interact.emit(interactedItem);
    };

    private handleMultiSelect = (index: number) => {
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
        this.interact.emit({ ...selectedItems[index] });
    };

    private isListItem = (item: ListItem): boolean => {
        return !('separator' in item);
    };

    private triggerIconColorWarning() {
        if (this.items?.some((item) => 'iconColor' in item)) {
            console.warn(
                "The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`."
            );
        }
    }
}
