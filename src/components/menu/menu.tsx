import {
    Component,
    Event,
    EventEmitter,
    h,
    Prop,
    Element,
    Watch,
    State,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { zipObject, isFunction } from 'lodash-es';
import {
    LimelBreadcrumbsCustomEvent,
    LimelInputFieldCustomEvent,
} from '../../components';

import { BreadcrumbsItem } from '../breadcrumbs/breadcrumbs.types';
import { ListSeparator } from '../list/list-item.types';
import {
    OpenDirection,
    MenuItem,
    MenuLoader,
    SurfaceWidth,
    MenuSearcher,
} from './menu.types';

import {
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    ARROW_UP,
    TAB,
} from '../../util/keycodes';

interface MenuCrumbItem extends BreadcrumbsItem {
    menuItem?: MenuItem;
}

const DEFAULT_ROOT_BREADCRUMBS_ITEM: BreadcrumbsItem = {
    text: '',
    icon: {
        name: 'home',
    },
    type: 'icon-only',
};

/**
 * @slot trigger - Element to use as a trigger for the menu.
 * @exampleComponent limel-example-menu-basic
 * @exampleComponent limel-example-menu-disabled
 * @exampleComponent limel-example-menu-open-direction
 * @exampleComponent limel-example-menu-surface-width
 * @exampleComponent limel-example-menu-separators
 * @exampleComponent limel-example-menu-icons
 * @exampleComponent limel-example-menu-badge-icons
 * @exampleComponent limel-example-menu-grid
 * @exampleComponent limel-example-menu-hotkeys
 * @exampleComponent limel-example-menu-secondary-text
 * @exampleComponent limel-example-menu-notification
 * @exampleComponent limel-example-menu-sub-menus
 * @exampleComponent limel-example-menu-sub-menu-lazy-loading
 * @exampleComponent limel-example-menu-sub-menu-lazy-loading-infinite
 * @exampleComponent limel-example-menu-searchable
 * @exampleComponent limel-example-menu-composite
 */
@Component({
    tag: 'limel-menu',
    shadow: true,
    styleUrl: 'menu.scss',
})
export class Menu {
    /**
     * A list of items and separators to show in the menu.
     */
    @Prop()
    public items: Array<MenuItem | ListSeparator> = [];

    /**
     * Sets the disabled state of the menu.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Decides the menu's location in relation to its trigger
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection = 'bottom-start';

    /**
     * Decides the width of menu's dropdown
     */
    @Prop({ reflect: true })
    public surfaceWidth: SurfaceWidth = 'inherit-from-items';

    /**
     * Sets the open state of the menu.
     */
    @Prop({ mutable: true, reflect: true })
    public open = false;

    /**
     * Defines whether the menu should show badges.
     */
    @Prop({ reflect: true })
    public badgeIcons = false;

    /**
     * Renders list items in a grid layout, rather than a vertical list
     */
    @Prop({ reflect: true })
    public gridLayout = false;

    /**
     * :::warning Internal Use Only
     * This property is for internal use only. We need it for now, but want to
     * find a better implementation of the functionality it currently enables.
     * If and when we do so, this property will be removed without prior
     * notice. If you use it, your code _will_ break in the future.
     * :::
     *
     * @internal
     */
    @Prop({ reflect: true })
    public loading = false;

    /**
     * :::warning Internal Use Only
     * This property is for internal use only. We need it for now, but want to
     * find a better implementation of the functionality it currently enables.
     * If and when we do so, this property will be removed without prior
     * notice. If you use it, your code _will_ break in the future.
     * :::
     *
     * @internal
     */
    @Prop({ mutable: true })
    public currentSubMenu: MenuItem;

    /**
     * A root breadcrumb item to show above the menu items.
     * Clicking it navigates back from a sub-menu to the root menu.
     */
    @Prop()
    public rootItem: BreadcrumbsItem = DEFAULT_ROOT_BREADCRUMBS_ITEM;

    /**
     * Is emitted when the menu is cancelled.
     */
    @Event()
    public cancel: EventEmitter<void>;

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    public select: EventEmitter<MenuItem>;

    /**
     * A search function that takes a search-string as an argument,
     * and returns a promise that will eventually be resolved with
     * an array of `MenuItem`:s.
     *
     * See the docs for the type `MenuSearcher` for type information on
     * the searcher function itself.
     */
    @Prop()
    public searcher: MenuSearcher;

    /**
     * Message to display when search returns 0 results.
     */
    @Prop()
    public emptyResultMessage?: string;

    /**
     * Is emitted when a menu item with a sub-menu is selected.
     */
    @Event()
    public navigateMenu: EventEmitter<MenuItem | null>;

    @Element()
    private host: HTMLLimelMenuElement;

    @State()
    private loadingSubItems: boolean;

    @State()
    private searchValue: string;

    @State()
    private searchResults: Array<MenuItem | ListSeparator> | null;

    private list: HTMLLimelMenuListElement;
    private searchInput: HTMLLimelInputFieldElement;
    private portalId: string;
    private triggerElement: HTMLSlotElement;
    private selectedMenuItem?: MenuItem;

    constructor() {
        this.portalId = createRandomString();
    }

    public componentDidRender() {
        const slotElement = this.host.shadowRoot.querySelector('slot');
        slotElement.assignedElements().forEach(this.setTriggerAttributes);
    }

    public render() {
        const cssProperties = this.getCssProperties();

        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index',
        );

        const menuSurfaceWidth = this.getMenuSurfaceWidth(
            cssProperties['--menu-surface-width'],
        );

        return (
            <div class="mdc-menu-surface--anchor" onClick={this.onTriggerClick}>
                <slot ref={this.setTriggerRef} name="trigger" />
                {this.renderNotificationBadge()}
                <limel-portal
                    visible={this.open}
                    containerId={this.portalId}
                    openDirection={this.openDirection}
                    position="absolute"
                    containerStyle={{ 'z-index': dropdownZIndex }}
                >
                    <limel-menu-surface
                        open={this.open}
                        onDismiss={this.onClose}
                        style={{
                            ...cssProperties,
                            '--menu-surface-width': menuSurfaceWidth,
                            '--limel-menu-surface-display': 'flex',
                            '--limel-menu-surface-flex-direction': 'column',
                        }}
                        class={{
                            'has-grid-layout': this.gridLayout,
                        }}
                    >
                        {this.renderSearchField()}
                        {this.renderBreadcrumb()}
                        {this.renderLoader()}
                        {this.renderEmptyMessage()}
                        {this.renderMenuList()}
                    </limel-menu-surface>
                </limel-portal>
            </div>
        );
    }

    @Watch('items')
    protected itemsWatcher() {
        this.clearSearch();
        this.setFocus();
    }

    @Watch('open')
    protected openWatcher(newValue: boolean) {
        const opened = newValue;
        if (opened) {
            this.setFocus();
        } else {
            this.clearSearch();
        }
    }

    private getBreadcrumbsItems() {
        const breadCrumbItems: MenuCrumbItem[] = [];
        let currentItem = this.currentSubMenu;
        while (currentItem) {
            breadCrumbItems.push({
                text: currentItem.text,
                icon: currentItem.icon,
                menuItem: currentItem,
            });
            currentItem = currentItem.parentItem;
        }

        if (
            breadCrumbItems.length ||
            this.rootItem !== DEFAULT_ROOT_BREADCRUMBS_ITEM
        ) {
            breadCrumbItems.push(this.rootItem);
        }

        return breadCrumbItems.reverse();
    }

    private renderLoader = () => {
        if (!this.loadingSubItems && !this.loading) {
            return;
        }

        const cssProperties = this.getCssProperties();

        return (
            <div
                style={{
                    width: cssProperties['--menu-surface-width'],
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '0.5rem 0',
                }}
            >
                <limel-spinner size="mini" limeBranded={false} />
            </div>
        );
    };

    private renderBreadcrumb = () => {
        const breadcrumbsItems = this.getBreadcrumbsItems();
        if (!breadcrumbsItems.length) {
            return;
        }

        return (
            <limel-breadcrumbs
                style={{
                    'border-bottom': 'solid 1px rgb(var(--contrast-500))',
                    'flex-shrink': '0',
                }}
                onSelect={this.handleBreadcrumbsSelect}
                items={breadcrumbsItems}
            />
        );
    };

    private handleBreadcrumbsSelect = (
        event: LimelBreadcrumbsCustomEvent<MenuCrumbItem>,
    ) => {
        if (!event.detail.menuItem) {
            this.currentSubMenu = null;
            this.clearSearch();
            this.navigateMenu.emit(null);

            this.setFocus();

            return;
        }

        this.handleSelect(event.detail.menuItem);
    };

    private renderSearchField = () => {
        if (!this.searcher) {
            return;
        }

        return (
            <limel-input-field
                tabindex="0"
                ref={this.setSearchElement}
                type="search"
                leadingIcon="search"
                style={{
                    padding: '0.25rem',
                    'box-sizing': 'border-box',
                }}
                value={this.searchValue}
                onChange={this.handleTextInput}
                onKeyDown={this.handleInputKeyDown}
            />
        );
    };

    private renderEmptyMessage = () => {
        if (
            this.loading ||
            this.loadingSubItems ||
            !this.emptyResultMessage ||
            !Array.isArray(this.searchResults) ||
            this.searchResults?.length
        ) {
            return null;
        }

        return (
            <p
                style={{
                    padding: '0 1rem',
                    'text-align': 'center',
                }}
            >
                {this.emptyResultMessage}
            </p>
        );
    };

    private renderMenuList = () => {
        let items = this.visibleItems;

        if (this.loadingSubItems || this.loading) {
            items = [];
        }

        return (
            <limel-menu-list
                style={{
                    'overflow-y': 'auto',
                    'flex-grow': '1',
                }}
                class={{
                    'has-grid-layout has-interactive-items': this.gridLayout,
                }}
                items={items}
                badgeIcons={this.badgeIcons}
                onSelect={this.onSelect}
                ref={this.setListElement}
                onKeyDown={this.handleMenuKeyDown}
            />
        );
    };

    private handleTextInput = async (
        event: LimelInputFieldCustomEvent<string>,
    ) => {
        event.stopPropagation();

        const query = event.detail;
        this.searchValue = query;
        if (query === '') {
            this.searchResults = null;
            this.loadingSubItems = false;

            return;
        }

        this.loadingSubItems = true;

        const result = await this.searcher(query);

        if (this.searchValue !== query) {
            return;
        }

        this.searchResults = result;
        this.loadingSubItems = false;
    };

    // Key handler for the input search field
    // Will change focus to the first/last item in the dropdown
    // list to enable selection with the keyboard
    private handleInputKeyDown = (event: KeyboardEvent) => {
        const isForwardTab =
            event.key === TAB &&
            !event.altKey &&
            !event.metaKey &&
            !event.shiftKey;
        const isUp = event.key === ARROW_UP;
        const isDown = event.key === ARROW_DOWN;

        if (!isForwardTab && !isUp && !isDown) {
            return;
        }

        if (!this.list) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        if (isForwardTab || isDown) {
            const listItems =
                this.list.shadowRoot.querySelectorAll<HTMLElement>(
                    '.mdc-deprecated-list-item',
                );
            const listElement = listItems[0];
            listElement?.focus();

            return;
        }

        if (isUp) {
            const listItems =
                this.list.shadowRoot.querySelectorAll<HTMLElement>(
                    '.mdc-deprecated-list-item',
                );
            const listElement = listItems[listItems.length - 1];
            listElement?.focus();
        }
    };

    // Key handler for the menu list
    // Will change focus to the search field if using shift+tab
    // And can go forward/back with righ/left arrow keys
    private handleMenuKeyDown = (event: KeyboardEvent) => {
        const isBackwardTab =
            event.key === TAB &&
            !event.altKey &&
            !event.metaKey &&
            event.shiftKey;

        const isLeft = event.key === ARROW_LEFT;

        const isRight = event.key === ARROW_RIGHT;

        if (!isBackwardTab && !isLeft && !isRight) {
            return;
        }

        if (isBackwardTab) {
            event.stopPropagation();
            event.preventDefault();
            this.searchInput?.focus();
        } else if (!this.gridLayout) {
            const currentItem = this.getCurrentItem();

            event.stopPropagation();
            event.preventDefault();
            if (isRight) {
                this.goForward(currentItem);
            } else if (isLeft) {
                this.goBack();
            }
        }
    };

    private clearSearch = () => {
        this.searchValue = '';
        this.searchResults = null;
        this.loadingSubItems = false;
    };

    private getCurrentItem = (): MenuItem => {
        const activeItem = this.list?.shadowRoot?.querySelector(
            '[role="menuitem"][tabindex="0"]',
        );
        const attrIndex = activeItem?.attributes?.getNamedItem('data-index');
        const dataIndex = parseInt(attrIndex?.value || '0', 10);

        return this.visibleItems[dataIndex] as MenuItem;
    };

    private goForward = (currentItem: MenuItem) => {
        this.handleSelect(currentItem, false);
    };

    private goBack = () => {
        if (!this.currentSubMenu) {
            // Already in the root of the menu
            return;
        }

        const parent = this.currentSubMenu.parentItem;
        if (!parent) {
            // If only one step down, go to the root of the menu.
            // No need to load a sub-menu.
            this.currentSubMenu = null;
            this.clearSearch();
            this.navigateMenu.emit(null);

            this.setFocus();

            return;
        }

        this.handleSelect(parent);
    };

    private setTriggerAttributes = (element: HTMLElement) => {
        const attributes = {
            'aria-haspopup': true,
            'aria-expanded': this.open,
            'aria-controls': this.portalId,
            disabled: this.disabled,
            role: 'button',
        };

        for (const [key, value] of Object.entries(attributes)) {
            if (!value) {
                element.removeAttribute(key);
            } else {
                element.setAttribute(key, String(value));
            }
        }
    };

    private onClose = () => {
        this.cancel.emit();
        this.open = false;
        this.currentSubMenu = null;
    };

    private onTriggerClick = (event: MouseEvent) => {
        event.stopPropagation();
        if (this.disabled) {
            return;
        }

        this.open = !this.open;
    };

    private handleSelect = async (
        menuItem: MenuItem,
        selectOnEmptyChildren: boolean = true,
    ) => {
        if (Array.isArray(menuItem?.items) && menuItem.items.length > 0) {
            this.selectedMenuItem = menuItem;
            this.clearSearch();
            this.currentSubMenu = menuItem;
            this.navigateMenu.emit(menuItem);

            this.setFocus();

            return;
        } else if (isFunction(menuItem?.items)) {
            const menuLoader = menuItem.items as MenuLoader;
            this.selectedMenuItem = menuItem;
            this.loadingSubItems = true;
            const subItems = await menuLoader(menuItem);

            if (this.selectedMenuItem !== menuItem) {
                return;
            }

            menuItem.items = subItems;
            this.loadingSubItems = false;

            if (subItems?.length) {
                this.currentSubMenu = menuItem;
                this.clearSearch();
                this.navigateMenu.emit(menuItem);

                this.setFocus();

                return;
            }
        }

        if (!selectOnEmptyChildren) {
            return;
        }

        this.selectedMenuItem = menuItem;
        this.loadingSubItems = false;

        this.select.emit(menuItem);
        this.open = false;
        this.currentSubMenu = null;
        this.setFocus();
    };

    private onSelect = (event: CustomEvent<MenuItem>) => {
        event.stopPropagation();
        this.handleSelect(event.detail);
    };

    private getCssProperties() {
        const propertyNames = [
            '--menu-surface-width',
            '--list-grid-item-max-width',
            '--list-grid-item-min-width',
            '--list-grid-gap',
            '--notification-badge-background-color',
            '--notification-badge-text-color',
        ] as const;
        const style = getComputedStyle(this.host);
        const values = propertyNames.map((property) => {
            return style.getPropertyValue(property);
        });

        type PropName = (typeof propertyNames)[number];

        return zipObject(propertyNames, values) as Record<PropName, string>;
    }

    private setListElement = (element: HTMLLimelMenuListElement) => {
        this.list = element;
    };

    private setFocus = () => {
        setTimeout(() => {
            if (this.searchInput && this.searcher) {
                const observer = new IntersectionObserver(() => {
                    observer.unobserve(this.searchInput);
                    if (this.searchInput === window.document.activeElement) {
                        return;
                    }

                    this.searchInput.focus();
                });
                observer.observe(this.searchInput);
            } else if (this.list) {
                const observer = new IntersectionObserver(() => {
                    observer.unobserve(this.list);
                    this.focusMenuItem();
                });
                observer.observe(this.list);
            }
        }, 0);
    };

    private setSearchElement = (element: HTMLLimelInputFieldElement) => {
        this.searchInput = element;
    };

    private focusMenuItem = () => {
        if (!this.list) {
            return;
        }

        const activeElement = this.list.shadowRoot.activeElement as HTMLElement;
        activeElement?.blur();

        const menuItems = this.visibleItems.filter(this.isMenuItem);
        const selectedIndex = Math.max(
            menuItems.findIndex((item) => item.selected),
            0,
        );
        const menuElements: HTMLElement[] = Array.from(
            this.list.shadowRoot.querySelectorAll('[role="menuitem"]'),
        );
        menuElements[selectedIndex]?.focus();
    };

    private isMenuItem(item: MenuItem | ListSeparator): item is MenuItem {
        return !('separator' in item);
    }

    private renderNotificationBadge = () => {
        if (this.items.some(this.hasNotificationBadge)) {
            return <limel-badge />;
        }
    };

    private hasNotificationBadge = (item: MenuItem | ListSeparator) =>
        this.isMenuItem(item) && item.badge !== undefined;

    private setTriggerRef = (elm?: HTMLSlotElement) => {
        this.triggerElement = elm;
    };

    private getMenuSurfaceWidth(customWidth: string): string {
        if (customWidth) {
            return customWidth;
        }

        if (this.surfaceWidth === 'inherit-from-trigger') {
            const assignedTriggers = this.triggerElement?.assignedElements();

            if (
                !assignedTriggers?.length ||
                !assignedTriggers[0]?.clientWidth
            ) {
                return '';
            }

            return `${assignedTriggers[0].clientWidth}px`;
        } else if (this.surfaceWidth === 'inherit-from-menu') {
            if (!this.host?.clientWidth) {
                return '';
            }

            return `${this.host?.clientWidth}px`;
        }

        return '';
    }

    private get visibleItems(): Array<MenuItem | ListSeparator> {
        if (Array.isArray(this.searchResults) && this.searchValue) {
            return this.searchResults;
        } else if (Array.isArray(this.currentSubMenu?.items)) {
            return this.currentSubMenu.items.map((item) => ({
                ...item,
                parentItem: this.currentSubMenu,
            }));
        }

        return this.items;
    }
}
