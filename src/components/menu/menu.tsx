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
import { zipObject } from 'lodash-es';
import { LimelBreadcrumbsCustomEvent } from '@limetech/lime-elements';

import { BreadcrumbsItem } from '../breadcrumbs/breadcrumbs.types';
import { ListSeparator } from '../list/list-item.types';
import { OpenDirection, MenuItem, SurfaceWidth } from './menu.types';

import {
    ARROW_LEFT,
    ARROW_LEFT_KEY_CODE,
    ARROW_RIGHT,
    ARROW_RIGHT_KEY_CODE,
} from '../../util/keycodes';

interface MenuCrumbItem extends BreadcrumbsItem {
    menuItem: MenuItem;
}

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
     * @internal
     */
    @Prop({ mutable: true })
    public currentSubMenu: MenuItem;

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
     * Is emitted when a menu item with a sub-menu is selected.
     */
    @Event()
    public navigateMenu: EventEmitter<MenuItem>;

    @Element()
    private host: HTMLLimelMenuElement;

    @State()
    private menuBreadCrumb: MenuCrumbItem[] = [];

    private list: HTMLLimelMenuListElement;
    private portalId: string;
    private triggerElement: HTMLSlotElement;

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
                        {this.renderBreadcrumb()}
                        {this.renderMenuList()}
                    </limel-menu-surface>
                </limel-portal>
            </div>
        );
    }

    @Watch('items')
    protected itemsWatcher() {
        this.setFocus();
    }

    @Watch('open')
    protected openWatcher(newValue: boolean) {
        if (newValue) {
            this.setFocus();
        }
    }

    @Watch('currentSubMenu')
    protected currentSubMenuWatcher() {
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

        if (breadCrumbItems.length) {
            breadCrumbItems.push({
                text: '',
                icon: {
                    name: 'home',
                },
                type: 'icon-only',
            } as MenuCrumbItem);
        }

        this.menuBreadCrumb = breadCrumbItems.reverse();
    }

    private renderBreadcrumb = () => {
        if (!this.menuBreadCrumb?.length) {
            return;
        }

        return (
            <limel-breadcrumbs
                style={{
                    'border-bottom': 'solid 1px rgb(var(--contrast-500))',
                    'flex-shrink': '0',
                }}
                onSelect={this.handleBreadcrumbsSelect}
                items={this.menuBreadCrumb}
            />
        );
    };

    private handleBreadcrumbsSelect = (
        event: LimelBreadcrumbsCustomEvent<MenuCrumbItem>
    ) => {
        if (!event.detail.menuItem) {
            this.currentSubMenu = null;
            this.navigateMenu.emit(null);

            return;
        }

        this.handleSelect(event.detail.menuItem);
    };

    private renderMenuList = () => {
        const items = this.visibleItems;

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
                type="menu"
                badgeIcons={this.badgeIcons}
                onSelect={this.onSelect}
                ref={this.setListElement}
                onKeyDown={this.handleMenuKeyDown}
            />
        );
    };

    /**
     * Key handler for the menu list
     * Can go forward/back with righ/left arrow keys
     * @param {KeyboardEvent} event event
     * @returns {void}
     */
    private handleMenuKeyDown = (event: KeyboardEvent) => {
        const isLeft =
            event.key === ARROW_LEFT || event.keyCode === ARROW_LEFT_KEY_CODE;

        const isRight =
            event.key === ARROW_RIGHT || event.keyCode === ARROW_RIGHT_KEY_CODE;

        if (!isLeft && !isRight) {
            return;
        }

        if (!this.gridLayout) {
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
            this.navigateMenu.emit(null);

            return;
        }

        this.handleSelect(parent);
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
        this.currentSubMenu = null;
    };

    private onTriggerClick = (event: MouseEvent) => {
        event.stopPropagation();
        if (this.disabled) {
            return;
        }

        this.open = !this.open;
    };

    private handleSelect = (
        menuItem: MenuItem,
        selectOnEmptyChildren: boolean = true
    ) => {
        if (Array.isArray(menuItem?.items) && menuItem.items.length > 0) {
            this.currentSubMenu = menuItem;
            this.navigateMenu.emit(menuItem);

            return;
        }

        if (!selectOnEmptyChildren) {
            return;
        }

        this.select.emit(menuItem);
        this.open = false;
        this.currentSubMenu = null;
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
            const observer = new IntersectionObserver(() => {
                observer.unobserve(this.list);
                this.focusMenuItem();
            });
            observer.observe(this.list);
        }, 0);
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

    private get visibleItems(): Array<MenuItem | ListSeparator> {
        if (Array.isArray(this.currentSubMenu?.items)) {
            return this.currentSubMenu.items.map((item) => ({
                ...item,
                parentItem: this.currentSubMenu,
            }));
        }

        return this.items;
    }
}
