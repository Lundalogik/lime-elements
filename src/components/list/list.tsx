import { MDCList } from '@lime-material/list';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { ListItem, ListSeparator } from './list-item';

@Component({
    tag: 'limel-list',
    styleUrl: 'list.scss',
    shadow: true,
})
export class List {
    /**
     * List of items to display
     */
    @Prop()
    public items: Array<ListItem | ListSeparator>;

    /**
     * True if the items in the list should be selectable/clickable
     */
    @Prop()
    public selectable: boolean;

    @Element()
    private element: HTMLElement;

    private mdcList: MDCList;

    /**
     * Fired when a new value has been selected from the list. Only fired if selectable is set to true
     */
    @Event()
    private change: EventEmitter;

    public componentDidLoad() {
        this.mdcList = new MDCList(
            this.element.shadowRoot.querySelector('.mdc-list')
        );

        if (!this.selectable) {
            return;
        }

        this.mdcList.singleSelection = true;

        // This is ugly and not the right way to do it.
        // A better way would be to implement our own
        // adapter and foundation classes for MDCList
        // that works with the shadow DOM
        this.mdcList.foundation_.adapter_.getFocusedElementIndex = () => {
            return this.mdcList.listElements_.indexOf(
                this.element.shadowRoot.activeElement
            );
        };
        const setSelectedIndex = this.mdcList.foundation_.setSelectedIndex;
        const self = this; // tslint:disable-line:no-this-assignment
        this.mdcList.foundation_.setSelectedIndex = function(...args) {
            setSelectedIndex.apply(this, args);
            self.handleSelectItem(args[0]);
        };
    }

    public componentDidUnload() {
        this.mdcList.destroy();
    }

    public render() {
        const twoLines = this.items.some(item => {
            return 'secondaryText' in item && !!item.secondaryText;
        });

        return (
            <ul
                class={`
                    mdc-list
                    ${twoLines ? 'mdc-list mdc-list--two-line' : ''}
                    ${this.selectable ? 'selectable' : ''}
                `}
                role="listbox"
                aria-orientation="vertical"
            >
                {this.items.map(this.renderListItem.bind(this))}
            </ul>
        );
    }

    /**
     * Listen for selection changes in the list and emit a change event
     *
     * @param {number} index index of the item that was selected/deselected
     *
     * @returns {void}
     */
    private handleSelectItem(index: number) {
        const selectedElement = this.element.shadowRoot.querySelector(
            '.mdc-list-item--selected'
        );
        let selectedItem: ListItem = null;
        if (selectedElement) {
            selectedItem = this.items.filter(item => {
                return !('separator' in item);
            })[index] as ListItem;
        }

        this.change.emit(selectedItem);
    }

    /**
     * Render a single list item
     *
     * @param {ListItem | ListSeparator} item the item to render
     *
     * @returns {HTMLElement} the list item
     */
    private renderListItem(item: ListItem | ListSeparator) {
        if ('separator' in item) {
            return <li class="mdc-list-divider" role="separator" />;
        }

        return (
            <li class="mdc-list-item">
                {this.renderIcon()}
                {this.renderText(item.text, item.secondaryText)}
            </li>
        );
    }

    /**
     * Render an icon for the list item (if any)
     *
     * @returns {HTMLElement} the icon
     */
    private renderIcon() {
        return null; // TODO
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

        return (
            <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">{text}</span>
                <span class="mdc-list-item__secondary-text">
                    {secondaryText}
                </span>
            </span>
        );
    }
}
