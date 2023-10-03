import {
    Component,
    Event,
    EventEmitter,
    h,
    Prop,
    Element,
    Watch,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { zipObject } from 'lodash-es';
import { ListSeparator, MenuItem, OpenDirection } from '../../interface';

/**
 * @slot trigger - Element to use as a trigger for the menu.
 * @exampleComponent limel-example-menu-basic
 * @exampleComponent limel-example-menu-disabled
 * @exampleComponent limel-example-menu-open-direction
 * @exampleComponent limel-example-menu-separators
 * @exampleComponent limel-example-menu-icons
 * @exampleComponent limel-example-menu-badge-icons
 * @exampleComponent limel-example-menu-grid
 * @exampleComponent limel-example-menu-hotkeys
 * @exampleComponent limel-example-menu-secondary-text
 * @exampleComponent limel-example-menu-notification
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
     * Is emitted when the menu is cancelled.
     */
    @Event()
    private cancel: EventEmitter<void>;

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    private select: EventEmitter<MenuItem | MenuItem[]>;

    @Element()
    private host: HTMLLimelMenuElement;

    private list: HTMLLimelMenuListElement;

    private portalId: string;

    constructor() {
        this.portalId = createRandomString();
    }

    @Watch('open')
    protected openWatcher() {
        if (!this.open) {
            return;
        }

        const observer = new IntersectionObserver(() => {
            observer.unobserve(this.list);
            this.focusMenuItem();
        });
        observer.observe(this.list);
    }

    public render() {
        const cssProperties = this.getCssProperties();
        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index'
        );

        return (
            <div class="mdc-menu-surface--anchor" onClick={this.onTriggerClick}>
                <slot name="trigger" />
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
                        style={cssProperties}
                        class={{
                            'has-grid-layout': this.gridLayout,
                        }}
                    >
                        <limel-menu-list
                            class={{
                                'has-grid-layout has-interactive-items':
                                    this.gridLayout,
                            }}
                            items={this.items}
                            type="menu"
                            badgeIcons={this.badgeIcons}
                            onSelect={this.handleSelect}
                            ref={this.setListElement}
                        />
                    </limel-menu-surface>
                </limel-portal>
            </div>
        );
    }

    public componentDidRender() {
        const slotElement = this.host.shadowRoot.querySelector('slot');
        slotElement.assignedElements().forEach(this.setTriggerAttributes);
    }

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
    };

    private onTriggerClick = (event: MouseEvent) => {
        event.stopPropagation();
        if (this.disabled) {
            return;
        }

        this.open = !this.open;
    };

    private handleSelect = (event: CustomEvent<MenuItem>) => {
        event.stopPropagation();
        this.select.emit(event.detail);
        this.open = false;
    };

    private getCssProperties() {
        const propertyNames = [
            '--menu-surface-width',
            '--list-grid-item-max-width',
            '--list-grid-item-min-width',
            '--list-grid-gap',
            '--notification-badge-background-color',
            '--notification-badge-text-color',
        ];
        const style = getComputedStyle(this.host);
        const values = propertyNames.map((property) => {
            return style.getPropertyValue(property);
        });

        return zipObject(propertyNames, values);
    }

    private setListElement = (element: HTMLLimelMenuListElement) => {
        this.list = element;
    };

    private focusMenuItem = () => {
        const activeElement = this.list.shadowRoot.activeElement as HTMLElement;
        activeElement?.blur();

        const MenuItems = this.items.filter(this.isMenuItem);
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
}
