import { MenuListItem, ListSeparator } from '@limetech/lime-elements';
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
import { MenuItem, OpenDirection } from './menu.types';

/**
 * @slot trigger - Element to use as a trigger for the menu.
 * @exampleComponent limel-example-menu-basic
 * @exampleComponent limel-example-menu-disabled
 * @exampleComponent limel-example-menu-open-left
 * @exampleComponent limel-example-menu-icons
 * @exampleComponent limel-example-menu-badge-icons
 * @exampleComponent limel-example-menu-grid
 * @exampleComponent limel-example-menu-composite
 * @exampleComponent limel-example-menu-hotkeys
 */
@Component({
    tag: 'limel-menu',
    shadow: true,
    styleUrl: 'menu.scss',
})
export class Menu {
    /**
     * Is displayed on the default trigger button.
     *
     * @deprecated Use with default trigger has been deprecated.
     * Please supply your own trigger element.
     */
    @Prop({ reflect: true })
    public label = '';

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
     * Decides if the menu should open right or left.
     */
    @Prop({ reflect: true })
    public openDirection: OpenDirection = 'right';

    /**
     * Sets the open state of the menu.
     */
    @Prop({ mutable: true, reflect: true }) // eslint-disable-line @stencil/strict-mutable
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
     * Defines whether the menu should have a fixed position on the screen.
     *
     * @deprecated Fixed position was used to get around a bug in the placement
     * of the menu. This bug has since been fixed, which makes this attribute
     * obsolete.
     */
    @Prop()
    public fixed = false;

    /**
     * Is emitted when the menu is cancelled.
     */
    @Event()
    private cancel: EventEmitter<void>;

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    private select: EventEmitter<MenuListItem | MenuListItem[]>;

    @Element()
    private host: HTMLLimelMenuElement;

    private list: HTMLLimelMenuListElement;

    private portalId: string;

    constructor() {
        this.portalId = createRandomString();
    }

    public componentDidLoad() {
        if (!this.host.querySelector('[slot="trigger"]')) {
            // eslint-disable-next-line no-console
            console.warn(
                'Using limel-menu with the default trigger is deprecated. Please provide your own trigger element.'
            );
        }
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
        const portalClasses = {
            'limel-portal--fixed': this.fixed,
        };
        const portalPosition = this.getPortalPosition();

        return (
            <div class="mdc-menu-surface--anchor" onClick={this.onTriggerClick}>
                <slot name="trigger">{this.renderTrigger()}</slot>
                <limel-portal
                    class={portalClasses}
                    style={portalPosition}
                    visible={this.open}
                    containerId={this.portalId}
                    openDirection={this.openDirection}
                    position={this.fixed ? 'fixed' : 'absolute'}
                    containerStyle={{ 'z-index': dropdownZIndex }}
                >
                    <limel-menu-surface
                        open={this.open}
                        onDismiss={this.onClose}
                        style={cssProperties}
                    >
                        <limel-menu-list
                            class={{
                                'has-grid-layout has-interactive-items':
                                    this.gridLayout,
                            }}
                            items={this.items}
                            type="menu"
                            badgeIcons={this.badgeIcons}
                            onChange={this.onListChange}
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

    private renderTrigger() {
        return (
            <button
                class={`
                    menu__trigger
                    ${this.disabled ? '' : 'menu__trigger-enabled'}
                `}
                disabled={this.disabled}
            >
                <span>{this.label}</span>
            </button>
        );
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

    private onListChange = (event) => {
        this.items = this.items.map((item: MenuListItem) => {
            if (item === event.detail) {
                return event.detail;
            }

            return item;
        });
        this.select.emit(event.detail);
        this.open = false;
    };

    private getPortalPosition() {
        if (!this.fixed) {
            return {};
        }

        const rect = this.host.getBoundingClientRect();
        const portalPosition = {
            top: `${rect.y + rect.height}px`,
            left: `${rect.x}px`,
        };

        if (this.openDirection === 'left') {
            portalPosition.left = `${rect.x + rect.width}px`;
        }

        return portalPosition;
    }

    private getCssProperties() {
        const propertyNames = [
            '--menu-surface-width',
            '--list-grid-item-max-width',
            '--list-grid-item-min-width',
            '--list-grid-gap',
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

        const MenuListItems = this.items.filter(this.isMenuListItem);
        const selectedIndex = Math.max(
            MenuListItems.findIndex((item) => item.selected),
            0
        );
        const menuElements: HTMLElement[] = Array.from(
            this.list.shadowRoot.querySelectorAll('[role="menuitem"]')
        );
        menuElements[selectedIndex]?.focus();
    };

    private isMenuListItem(
        item: MenuListItem | ListSeparator
    ): item is MenuListItem {
        return !('separator' in item);
    }
}
