import { Corner, MDCMenu } from '@lime-material/menu';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';
import { ListItem, ListSeparator } from '../list/list-item';
import { ListRenderer } from '../list/list-renderer';

@Component({
    tag: 'limel-menu',
    shadow: true,
    styleUrl: 'menu.scss',
})
export class Menu {
    @Prop({ reflectToAttr: true })
    /**
     * Sets the disabled state of the menu.
     */
    public disabled = false;

    /**
     * A list of items and separators to show in the menu.
     */
    @Prop()
    public items: Array<ListItem | ListSeparator> = [];

    /**
     * Sets the open state of the menu.
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public open = false;

    /**
     * Is displayed on the default trigger button.
     */
    @Prop()
    public label = '';

    /**
     * Is emitted when the menu is cancelled.
     */
    @Event()
    public cancel: EventEmitter;

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    public select: EventEmitter;

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
                this.select.emit(
                    this.items[parseInt(event.detail.item.dataset.index, 10)]
                );
                this.open = false;
            }
        );
        menuElement.addEventListener('MDCMenu:cancel', () => {
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
        return (
            <div class="mdc-menu-anchor">
                <slot name="trigger">{this.renderTrigger()}</slot>
                <div class="mdc-menu" tabindex="-1">
                    {this.listRenderer.render(this.items, { isMenu: true })}
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
                    ${!this.disabled ? 'menu__trigger-enabled' : ''}
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
