/* eslint-disable sonarjs/no-duplicate-string */
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
} from '@limetech/lime-elements';

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
    ARROW_DOWN_KEY_CODE,
    ARROW_LEFT,
    ARROW_LEFT_KEY_CODE,
    ARROW_RIGHT,
    ARROW_RIGHT_KEY_CODE,
    ARROW_UP,
    ARROW_UP_KEY_CODE,
    TAB,
    TAB_KEY_CODE,
} from '../../util/keycodes';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

interface MenuCrumbItem extends BreadcrumbsItem {
    menuItem: MenuItem;
}

const SEARCH_DEBOUNCE = 500;

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
 * @exampleComponent limel-example-menu-searchable
 * @exampleComponent limel-example-menu-subitems
 * @exampleComponent limel-example-menu-custom-navigation
 * @exampleComponent limel-example-menu-subitems-lazy-loading
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
     * Making it possible for a consumer to tell the component that it's waiting for something.
     * For example loading items/root items.
     */
    @Prop()
    public loading = false;

    /**
     * Making it possible for the consumer so explicitly tell the component
     * what has been selected in the menu.
     */
    @Prop({ mutable: true })
    public selectedMenuItem: MenuItem;

    /**
     * Is emitted when the menu is cancelled.
     */
    @Event()
    private cancel: EventEmitter<void>;

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
     * See the docs for the type {@link MenuSearcher} for type information on
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
     * Is emitted when a menu item with sub items is selected.
     */
    @Event()
    public navigateMenu: EventEmitter<MenuItem>;

    @Element()
    private host: HTMLLimelMenuElement;

    /**
     * True while sub items are loading.
     */
    @State()
    private loadingSubItems: boolean;

    /**
     * The current items in the menu list
     */
    @State()
    private currentItems: Array<MenuItem | ListSeparator> = null;

    /**
     * Contains the search string
     */
    @State()
    private searchValue: string;

    private list: HTMLLimelMenuListElement;
    private searchInput: HTMLLimelInputFieldElement;

    private portalId: string;
    private triggerElement: HTMLSlotElement;
    private debouncedSearch: MenuSearcher;

    private get visibleItems(): Array<MenuItem | ListSeparator> {
        if (Array.isArray(this.currentItems)) {
            return this.currentItems;
        }

        return this.items;
    }

    constructor() {
        this.createDebouncedSearcher = this.createDebouncedSearcher.bind(this);
        this.portalId = createRandomString();
    }

    @Watch('items')
    protected itemsWatcher() {
        this.searchValue = '';
        this.currentItems = null;

        this.setFocus();
    }

    @Watch('currentItems')
    protected currentItemsWatcher() {
        if (!this.searchValue) {
            this.setFocus();
        }
    }

    @Watch('open')
    protected openWatcher() {
        if (!this.open) {
            this.searchValue = '';
            this.currentItems = null;

            return;
        }

        this.setFocus();
    }

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

    @Watch('searcher')
    protected createDebouncedSearcher(newValue: MenuSearcher) {
        if (typeof newValue !== 'function') {
            return;
        }

        this.debouncedSearch = AwesomeDebouncePromise(
            newValue,
            SEARCH_DEBOUNCE
        );
    }

    public componentDidLoad() {
        this.createDebouncedSearcher(this.searcher);
    }

    public render() {
        const cssProperties = this.getCssProperties();

        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index'
        );

        const menuSurfaceWidth = this.getMenuSurfaceWidth(
            cssProperties['--menu-surface-width']
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
                            '--mdc-menu-min-width': menuSurfaceWidth,
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

    public componentDidRender() {
        const slotElement = this.host.shadowRoot.querySelector('slot');
        slotElement.assignedElements().forEach(this.setTriggerAttributes);
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
        if (!this.selectedMenuItem || this.searchValue) {
            return;
        }

        const breadCrumbItems: MenuCrumbItem[] = [];
        let currentItem = this.selectedMenuItem;
        while (currentItem) {
            breadCrumbItems.unshift({
                text: currentItem.text,
                icon: {
                    name: currentItem.icon,
                    color: currentItem.iconColor,
                },
                menuItem: currentItem,
            });
            currentItem = currentItem.parentItem;
        }

        if (!breadCrumbItems.length) {
            return;
        }

        return (
            <limel-breadcrumbs
                style={{
                    'border-bottom': 'solid 1px rgb(var(--contrast-500))',
                    'flex-shrink': '0',
                }}
                onSelect={(
                    event: LimelBreadcrumbsCustomEvent<MenuCrumbItem>
                ) => {
                    if (!event.detail.menuItem) {
                        this.currentItems = null;
                        this.selectedMenuItem = null;
                        this.navigateMenu.emit(null);

                        return;
                    }

                    this.handleSelect(event.detail.menuItem);
                }}
                items={[
                    {
                        text: '',
                        icon: {
                            name: 'home',
                        },
                        type: 'icon-only',
                    },
                    ...breadCrumbItems,
                ]}
            />
        );
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
                onChange={this.handlerTextInput}
                onKeyDown={this.handleInputKeyDown}
            />
        );
    };

    private renderEmptyMessage = () => {
        if (
            this.loading ||
            this.loadingSubItems ||
            !this.emptyResultMessage ||
            !Array.isArray(this.currentItems) ||
            this.currentItems?.length
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
                tabindex="1"
                style={{
                    'overflow-y': 'auto',
                    'flex-grow': '1',
                }}
                class={{
                    'has-grid-layout has-interactive-items': this.gridLayout,
                }}
                items={items}
                type="menu"
                badgeIcons={this.badgeIcons}
                onSelect={this.onSelect}
                ref={this.setListElement}
                onKeyDown={this.handleMenuKeyDown}
            />
        );
    };

    /**
     * Input handler for the input field
     * @param {InputEvent} event event
     * @returns {void}
     */
    private handlerTextInput = async (
        event: LimelInputFieldCustomEvent<string>
    ) => {
        event.stopPropagation();

        const query = event.detail;
        this.searchValue = query;
        if (query === '') {
            this.currentItems = null;

            return;
        }

        this.loadingSubItems = true;

        const result = await this.debouncedSearch(query);

        this.currentItems = result;
        this.loadingSubItems = false;
    };

    /**
     * Key handler for the input search field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     * @param {KeyboardEvent} event event
     * @returns {void}
     */
    private handleInputKeyDown = (event: KeyboardEvent) => {
        const isForwardTab =
            (event.key === TAB || event.keyCode === TAB_KEY_CODE) &&
            !event.altKey &&
            !event.metaKey &&
            !event.shiftKey;
        const isUp =
            event.key === ARROW_UP || event.keyCode === ARROW_UP_KEY_CODE;
        const isDown =
            event.key === ARROW_DOWN || event.keyCode === ARROW_DOWN_KEY_CODE;

        if (!isForwardTab && !isUp && !isDown) {
            return;
        }

        if (!this.list) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        if (isForwardTab || isDown) {
            const listElement: HTMLElement = this.list.shadowRoot.querySelector(
                '.mdc-deprecated-list-item:first-child'
            );
            listElement.focus();

            return;
        }

        if (isUp) {
            const listElement: HTMLElement = this.list.shadowRoot.querySelector(
                '.mdc-deprecated-list-item:last-child'
            );
            listElement.focus();
        }
    };

    /**
     * Key handler for the menu list
     * Will change focus to the search field if using shift+tab
     * And can go forward/back with righ/left arrow keys
     * @param {KeyboardEvent} event event
     * @returns {void}
     */
    private handleMenuKeyDown = (event: KeyboardEvent) => {
        const isBackwardTab =
            (event.key === TAB || event.keyCode === TAB_KEY_CODE) &&
            !event.altKey &&
            !event.metaKey &&
            event.shiftKey;

        const isLeft =
            event.key === ARROW_LEFT || event.keyCode === ARROW_LEFT_KEY_CODE;

        const isRight =
            event.key === ARROW_RIGHT || event.keyCode === ARROW_RIGHT_KEY_CODE;

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
                this.goBack(currentItem);
            }
        }
    };

    private getCurrentItem = (): MenuItem => {
        const activeItem = this.list?.shadowRoot?.querySelector(
            '[role="menuitem"][tabindex="0"]'
        );
        const attrIndex = activeItem?.attributes?.getNamedItem('data-index');
        const dataIndex = parseInt(attrIndex?.value || '0', 10);

        return this.visibleItems[dataIndex] as MenuItem;
    };

    private goForward = (currentItem: MenuItem) => {
        this.handleSelect(currentItem, false);
    };

    private goBack = (currentItem: MenuItem) => {
        const parentItem = currentItem?.parentItem;
        if (!parentItem) {
            // Already in the root of the menu
            return;
        }

        const grandParent = parentItem.parentItem;
        if (!grandParent) {
            // Is only one step down, go to the root of the menu.
            // No need to load sub items.
            this.selectedMenuItem = null;
            this.currentItems = null;
            this.navigateMenu.emit(null);

            return;
        }

        this.handleSelect(grandParent);
    };

    private setTriggerAttributes = (element: HTMLElement) => {
        const attributes = {
            'aria-haspopup': true,
            'aria-expanded': this.open,
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
        this.selectedMenuItem = null;
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
        selectOnEmptyChildren: boolean = true
    ) => {
        if (Array.isArray(menuItem?.items) && menuItem.items.length > 0) {
            this.selectedMenuItem = menuItem;
            this.navigateMenu.emit(menuItem);
            this.currentItems = menuItem.items.map((item) => ({
                ...item,
                parentItem: menuItem,
            }));

            return;
        } else if (isFunction(menuItem?.items)) {
            const menuLoader = menuItem.items as MenuLoader;
            this.loadingSubItems = true;
            const subItems = await menuLoader(menuItem);
            this.loadingSubItems = false;

            if (subItems?.length) {
                this.selectedMenuItem = menuItem;
                this.navigateMenu.emit(menuItem);
                this.currentItems = subItems.map((item) => ({
                    ...item,
                    parentItem: menuItem,
                }));

                return;
            }
        }

        if (!selectOnEmptyChildren) {
            return;
        }

        this.searchValue = '';
        this.currentItems = null;
        this.select.emit(menuItem);
        this.open = false;
        this.selectedMenuItem = null;
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

    private setSearchElement = (element: HTMLLimelInputFieldElement) => {
        this.searchInput = element;
    };

    private focusMenuItem = () => {
        if (!this.list) {
            return;
        }

        const activeElement = this.list.shadowRoot.activeElement as HTMLElement;
        activeElement?.blur();

        const MenuItems = this.visibleItems.filter(this.isMenuItem);
        const selectedIndex = Math.max(
            MenuItems.findIndex((item) => item.selected),
            0
        );
        const menuElements: HTMLElement[] = Array.from(
            this.list.shadowRoot.querySelectorAll('[role="menuitem"]')
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
}
