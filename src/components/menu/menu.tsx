import { Corner, MDCMenu } from '@lime-material/menu';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';

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
     * Is emitted when the menu is cancelled.
     */
    @Event()
    private cancel: EventEmitter;

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    private select: EventEmitter;

    @Element()
    private element: HTMLElement;

    private menu: MDCMenu;

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
        return (
            <div class="mdc-menu-surface--anchor">
                <slot name="trigger">{this.renderTrigger()}</slot>
                <div class="mdc-menu mdc-menu-surface" tabindex="-1">
                    <ul
                        class="mdc-list"
                        role="menu"
                        aria-hidden={this.open ? 'false' : 'true'}
                        aria-orientation="vertical"
                    >
                        {this.items.map(this.renderListItem.bind(this))}
                    </ul>
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

    /**
     * Render a single menu item
     *
     * @param {ListItem | ListSeparator} item the item to render
     * @param {number} index the index the item had in the `items` array
     *
     * @returns {HTMLElement} the list item
     */
    private renderListItem(item: ListItem | ListSeparator, index: number) {
        if ('separator' in item) {
            return <li class="mdc-list-divider" role="separator" />;
        }

        const props: {
            disabled?: true;
        } = {};

        if (item.disabled) {
            props.disabled = true;
        }

        return (
            <li
                class={`
                    mdc-list-item
                    ${item.disabled ? 'mdc-list-item--disabled' : ''}
                `}
                role="menuitem"
                data-index={index}
                {...props}
            >
                {item.icon ? this.renderIcon(item) : null}
                <span class="mdc-list-item__text">
                    {this.renderText(item.text, item.secondaryText)}
                </span>
            </li>
        );
    }

    /**
     * Render the text of the list item
     *
     * @param {string} text primary text for the list item
     * @param {string} secondaryText secondary text for the list item
     *
     * @returns {HTMLElement | string} the text for the list item
     */
    private renderText(text: string, secondaryText?: string) {
        if (!secondaryText) {
            return text;
        }

        return [
            <span class="mdc-list-item__primary-text">{text}</span>,
            <span class="mdc-list-item__secondary-text">{secondaryText}</span>,
        ];
    }

    /**
     * Render an icon for a list item
     *
     * @param {ListItem} item the list item
     *
     * @returns {HTMLElement} the icon element
     */
    private renderIcon(item: ListItem) {
        return (
            <limel-icon
                class="mdc-list-item__graphic"
                name={item.icon}
                size="medium"
            />
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
