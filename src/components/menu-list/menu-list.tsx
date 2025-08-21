import { IconSize } from '../icon/icon.types';
import { ListSeparator } from '../list/list-item.types';
import { MenuItem } from '../menu/menu.types';
import { MDCMenu, MDCMenuItemEvent } from '@material/menu';
import { MDCRipple } from '@material/ripple';
import { strings as menuStrings } from '@material/menu/constants';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    Watch,
} from '@stencil/core';
import { MenuListRenderer } from './menu-list-renderer';
import { MenuListRendererConfig } from './menu-list-renderer-config';

const { SELECTED_EVENT } = menuStrings;

/**
 * @private
 */
@Component({
    tag: 'limel-menu-list',
    shadow: { delegatesFocus: true },
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
     * By default, lists will display 3 lines of text, and then truncate the rest.
     * Consumers can increase or decrease this number by specifying
     * `maxLinesSecondaryText`. If consumer enters zero or negative
     * numbers we default to 1; and if they type decimals we round up.
     */

    @Prop() maxLinesSecondaryText: number = 3;

    @Element()
    private element: HTMLLimelMenuListElement;

    private config: MenuListRendererConfig;
    private MenuListRenderer = new MenuListRenderer();
    private mdcMenu: MDCMenu;

    /**
     * Fired when a new value has been selected from the list.
     */
    @Event()
    private select: EventEmitter<MenuItem>;

    /**
     * Fires when a user interacts with an item in the list (e.g., click,
     * keyboard select).
     */
    @Event()
    interact: EventEmitter<MenuItem>;

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
            iconSize: this.iconSize,
        };

        const html = this.MenuListRenderer.render(this.items, this.config);

        return <div class="mdc-menu mdc-menu-surface">{html}</div>;
    }

    @Watch('items')
    protected itemsChanged() {
        setTimeout(() => {
            this.setup();
        }, 0);
    }

    private setup = () => {
        this.setupMenu();
        this.setupListeners();
    };

    private setupMenu = () => {
        if (this.mdcMenu) {
            this.teardown();
            this.mdcMenu = null;
        }

        const element = this.element.shadowRoot.querySelector('.mdc-menu');
        if (!element) {
            return;
        }

        this.mdcMenu = new MDCMenu(element);
        this.mdcMenu.hasTypeahead = true;
        this.mdcMenu.wrapFocus = true;
        // eslint-disable-next-line sonarjs/constructor-for-side-effects
        for (const item of this.mdcMenu.items) new MDCRipple(item);
    };

    private setupListeners = () => {
        if (!this.mdcMenu) {
            return;
        }

        this.mdcMenu.unlisten(SELECTED_EVENT, this.handleMenuSelect);
        this.mdcMenu.listen(SELECTED_EVENT, this.handleMenuSelect);
    };

    private teardown = () => {
        this.mdcMenu?.unlisten(SELECTED_EVENT, this.handleMenuSelect);
        this.mdcMenu?.destroy();
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

        let interactedItem: MenuItem;
        if (selectedItem) {
            interactedItem = { ...selectedItem, selected: false };
            this.select.emit(interactedItem);
        }

        if (MenuItems[index] !== selectedItem) {
            interactedItem = { ...MenuItems[index], selected: false };
            this.select.emit(interactedItem);
        }

        this.interact.emit(interactedItem);
    };

    private isMenuItem = (item: MenuItem): boolean => {
        return !('separator' in item);
    };

    private triggerIconColorWarning() {
        if (this.items?.some((item) => 'iconColor' in item)) {
            console.warn(
                "The `iconColor` prop is deprecated, has no visual effect anymore, and will soon be removed! Use the new `Icon` interface, and instead of `iconColor: 'color-name'` write `icon: { name: 'icon-name', color: 'color-name' }`."
            );
        }
    }
}
