import {
    IconSize,
    MenuItem,
    ListSeparator,
    MenuListType,
} from '@limetech/lime-elements';
import { MDCList, MDCListActionEvent } from '@material/list';
import { MDCMenu, MDCMenuItemEvent } from '@material/menu';
import { MDCRipple } from '@material/ripple';
import { strings as listStrings } from '@material/list/constants';
import { strings as menuStrings } from '@material/menu/constants';
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
import { MenuListRenderer } from './menu-list-renderer';
import { MenuListRendererConfig } from './menu-list-renderer-config';

const { ACTION_EVENT } = listStrings;
const { SELECTED_EVENT } = menuStrings;

/**
 * @private
 */
@Component({
    tag: 'limel-menu-list',
    shadow: true,
    styleUrl: 'menu-list.scss',
})
export class MenuList {
    /**
     * List of items to display
     */
    @Prop()
    public items: Array<MenuItem | ListSeparator>;

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
     * `menu`: menu list with single selection.
     */
    @Prop()
    public type: MenuListType;

    /**
     * By default, lists will display 3 lines of text, and then truncate the rest.
     * Consumers can increase or decrease this number by specifying
     * `maxLinesSecondaryText`. If consumer enters zero or negative
     * numbers we default to 1; and if they type decimals we round up.
     */
    // eslint-disable-next-line no-magic-numbers
    @Prop() maxLinesSecondaryText: number = 3;

    @Element()
    private element: HTMLLimelMenuListElement;

    private config: MenuListRendererConfig;
    private MenuListRenderer = new MenuListRenderer();
    private mdcList: MDCList;
    private mdcMenu: MDCMenu;
    private multiple: boolean;
    private selectable: boolean;

    /**
     * Fired when a new value has been selected from the list. Only fired if selectable is set to true
     */
    @Event()
    private change: EventEmitter<MenuItem | MenuItem[]>;

    /**
     * Fired when an action has been selected from the action menu of a list item
     */
    @Event()
    protected select: EventEmitter<MenuItem | MenuItem[]>;

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
        let maxLinesSecondaryText = +this.maxLinesSecondaryText?.toFixed();
        if (this.maxLinesSecondaryText < 1) {
            maxLinesSecondaryText = 1;
        }

        const html = this.MenuListRenderer.render(this.items, this.config);

        if (this.type === 'menu') {
            return <div class="mdc-menu mdc-menu-surface">{html}</div>;
        }

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

        const MenuItems = this.items.filter(this.isMenuItem);

        if (!this.multiple) {
            this.mdcList.selectedIndex = MenuItems.findIndex(
                (item: MenuItem) => item.selected
            );

            return;
        }

        this.mdcList.selectedIndex = MenuItems.filter(
            (item: MenuItem) => item.selected
        ).map((item: MenuItem) => MenuItems.indexOf(item));
    }

    private setup = () => {
        if (this.type === 'menu') {
            this.setupMenu();
        } else {
            this.setupList();
        }

        this.setupListeners();
    };

    private setupList = () => {
        const element = this.element.shadowRoot.querySelector(
            '.mdc-deprecated-list'
        );
        if (!element) {
            return;
        }

        this.mdcList = new MDCList(element);
        this.mdcList.listElements.forEach((item) => new MDCRipple(item));
    };

    private setupMenu = () => {
        const element = this.element.shadowRoot.querySelector('.mdc-menu');
        if (!element) {
            return;
        }

        this.mdcMenu = new MDCMenu(element);
        this.mdcMenu.hasTypeahead = true;
        this.mdcMenu.wrapFocus = true;
        this.mdcMenu.items.forEach((item) => new MDCRipple(item));
    };

    private setupListeners = () => {
        if (this.type === 'menu') {
            this.setupMenuListeners();
        } else {
            this.setupListListeners();
        }
    };

    private setupListListeners = () => {
        if (!this.mdcList) {
            return;
        }

        this.mdcList.unlisten(ACTION_EVENT, this.handleAction);

        this.selectable = ['selectable', 'radio', 'checkbox', 'menu'].includes(
            this.type
        );
        this.multiple = this.type === 'checkbox';

        if (!this.selectable) {
            return;
        }

        this.mdcList.listen(ACTION_EVENT, this.handleAction);
        this.mdcList.singleSelection = !this.multiple;
    };

    private setupMenuListeners = () => {
        if (!this.mdcMenu) {
            return;
        }

        this.mdcMenu.unlisten(SELECTED_EVENT, this.handleMenuSelect);
        this.selectable = true;
        this.mdcMenu.listen(SELECTED_EVENT, this.handleMenuSelect);
    };

    private teardown = () => {
        this.mdcList?.unlisten(ACTION_EVENT, this.handleAction);
        this.mdcList?.destroy();

        this.mdcMenu?.unlisten(SELECTED_EVENT, this.handleMenuSelect);
        this.mdcMenu?.destroy();
    };

    private handleAction = (event: MDCListActionEvent) => {
        if (!this.multiple) {
            this.handleSingleSelect(event.detail.index);

            return;
        }

        this.handleMultiSelect(event.detail.index);
    };

    private handleMenuSelect = (event: MDCMenuItemEvent) => {
        this.handleSingleSelect(event.detail.index);
    };

    private handleSingleSelect = (index: number) => {
        const MenuItems = this.items.filter(this.isMenuItem) as MenuItem[];
        if (MenuItems[index].disabled) {
            return;
        }

        const selectedItem: MenuItem = MenuItems.find((item: MenuItem) => {
            return !!item.selected;
        });

        if (selectedItem) {
            this.change.emit({ ...selectedItem, selected: false });
        }

        if (MenuItems[index] !== selectedItem) {
            if (this.type === 'menu') {
                this.change.emit({ ...MenuItems[index], selected: false });

                return;
            }

            this.change.emit({ ...MenuItems[index], selected: true });
        }
    };

    private handleMultiSelect = (index: number) => {
        const MenuItems = this.items.filter(this.isMenuItem) as MenuItem[];
        if (MenuItems[index].disabled) {
            return;
        }

        const selectedItems: MenuItem[] = MenuItems.filter(
            (item: MenuItem, listIndex: number) => {
                if (listIndex === index) {
                    // This is the item that was selected or deselected,
                    // so we negate its previous selection status.
                    return !item.selected;
                }

                // This is an item that didn't change, so we keep its selection status.
                return item.selected;
            }
        ).map((item: MenuItem) => {
            return { ...item, selected: true };
        });

        this.change.emit(selectedItems);
    };

    private isMenuItem = (item: MenuItem): boolean => {
        return !('separator' in item);
    };
}
