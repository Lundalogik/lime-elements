import { Corner, MDCMenu } from '@lime-material-16px/menu';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';
import { ListRenderer } from '../list/list-renderer';
import { ListRendererConfig } from '../list/list-renderer-config';

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
    private select: EventEmitter<ListItem>;

    @Element()
    private element: HTMLElement;

    private menu: MDCMenu;
    private listRenderer = new ListRenderer();

    public componentDidLoad() {
        const menuElement = this.element.shadowRoot.querySelector('.mdc-menu');
        this.menu = new MDCMenu(menuElement);
        menuElement.addEventListener(
            'MDCMenu:selected',
            (event: CustomEvent) => {
                this.select.emit(this.items[
                    parseInt(event.detail.item.dataset.index, 10)
                ] as ListItem);
                this.open = false;
            }
        );
        menuElement.addEventListener('MDCMenuSurface:closed', () => {
            this.cancel.emit();
            this.open = false;
        });

        this.menu.setAnchorCorner(Corner.TOP_START);
        this.menu.quickOpen = true;
    }

    public componentDidUnload() {
        this.menu.destroy();
    }

    public render() {
        const config: ListRendererConfig = {
            selectable: true,
            isMenu: true,
            isOpen: this.open,
            badgeIcons: this.badgeIcons,
        };
        return (
            <div class="mdc-menu-surface--anchor">
                <slot name="trigger">{this.renderTrigger()}</slot>
                <div class="mdc-menu mdc-menu-surface" tabindex="-1">
                    {this.listRenderer.render(this.items, config)}
                </div>
                {this.disabled ? <div class="menu-disabled" /> : null}
            </div>
        );
    }

    @Watch('open')
    protected openWatcher(newValue: boolean) {
        if (newValue !== this.menu.open) {
            this.menu.open = newValue;
        }
    }

    private renderTrigger() {
        return (
            <button
                class={`
                    menu__trigger
                    ${this.disabled ? '' : 'menu__trigger-enabled'}
                `}
                disabled={this.disabled}
                onClick={this.onTriggerClick}
            >
                <span>{this.label}</span>
            </button>
        );
    }

    private onTriggerClick = () => {
        this.open = !this.open;
    };
}
