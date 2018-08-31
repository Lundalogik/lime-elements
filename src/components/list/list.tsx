import { MDCList } from '@lime-material/list';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { ListItem, ListSeparator } from './list-item';
import { ListRenderer } from './list-renderer';
import { ListRendererConfig } from './list-renderer-config';

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
    private listRenderer = new ListRenderer();

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
        const config: ListRendererConfig = {
            selectable: this.selectable,
        };
        return this.listRenderer.render(this.items, config);
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
}
