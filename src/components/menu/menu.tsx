import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { OpenDirection } from './menu.types';

/**
 * @slot trigger - Element to use as a trigger for the menu
 */
@Component({
    tag: 'limel-menu',
    shadow: true,
    styleUrl: 'menu.scss',
})
export class Menu {
    /**
     * Is displayed on the default trigger button.
     */
    @Prop({ reflectToAttr: true })
    public label = '';

    /**
     * A list of items and separators to show in the menu.
     */
    @Prop()
    public items: Array<ListItem | ListSeparator> = [];

    /**
     * Sets the disabled state of the menu.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * Decides if the menu should open right or left. Defaults to right.
     */
    @Prop({ reflectToAttr: true })
    public openDirection: OpenDirection = 'right';

    /**
     * Sets the open state of the menu.
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public open = false;

    /**
     * Defines whether the menu should show badges.
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public badgeIcons = false;

    /**
     * Is emitted when the menu is cancelled.
     */
    @Event()
    private cancel: EventEmitter<void>;

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    private select: EventEmitter<ListItem | ListItem[]>;

    private portalId: string;

    constructor() {
        this.portalId = createRandomString();
    }

    public render() {
        return (
            <div class="mdc-menu-surface--anchor" onClick={this.onTriggerClick}>
                <slot name="trigger">{this.renderTrigger()}</slot>
                <limel-portal
                    visible={this.open}
                    containerId={this.portalId}
                    openDirection={this.openDirection}
                >
                    <limel-menu-surface
                        open={this.open}
                        onDismiss={this.onClose}
                    >
                        <limel-list
                            items={this.items}
                            type="menu"
                            badgeIcons={this.badgeIcons}
                            onChange={this.onListChange}
                        />
                    </limel-menu-surface>
                </limel-portal>
            </div>
        );
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

    private onClose = () => {
        this.cancel.emit();
        this.open = false;
    };

    private onTriggerClick = () => {
        if (this.disabled) {
            return;
        }
        this.open = !this.open;
    };

    private onListChange = (event) => {
        this.items = this.items.map((item: ListItem) => {
            if (item === event.detail) {
                return event.detail;
            }

            return item;
        });
        this.select.emit(event.detail);
        this.open = false;
    };
}
