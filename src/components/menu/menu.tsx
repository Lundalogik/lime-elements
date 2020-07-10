import { ListItem, ListSeparator } from '@limetech/lime-elements';
import {
    Component,
    Event,
    EventEmitter,
    h,
    Prop,
    Element,
} from '@stencil/core';
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
    @Prop({ mutable: true, reflectToAttr: true }) // eslint-disable-line @stencil/strict-mutable
    public open = false;

    /**
     * Defines whether the menu should show badges.
     */
    @Prop({ reflectToAttr: true })
    public badgeIcons = false;

    /**
     * Defines whether the menu should have a fixed position on the screen
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
    private select: EventEmitter<ListItem | ListItem[]>;

    @Element()
    private host: HTMLLimelMenuElement;

    private portalId: string;

    constructor() {
        this.portalId = createRandomString();
    }

    public render() {
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

    private onTriggerClick = (event: MouseEvent) => {
        event.stopPropagation();
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
}
