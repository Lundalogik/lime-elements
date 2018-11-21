import { MDCCheckbox } from '@lime-material/checkbox';
import { MDCFormField } from '@lime-material/form-field';
import { MDCList } from '@lime-material/list';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';
import { ListRenderer } from './list-renderer';
import { ListRendererConfig } from './list-renderer-config';

@Component({
    tag: 'limel-list',
    shadow: true,
    styleUrl: 'list.scss',
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

    /**
     * True if the list should display larger icons with a background
     */
    @Prop()
    public badgeIcons: boolean;

    /**
     * True if each list item should start with a checkbox.
     * No support in combination with icons.
     */
    @Prop()
    public includeCheckboxes: boolean;

    @Element()
    private element: HTMLElement;

    private mdcList: MDCList;
    private listRenderer = new ListRenderer();

    /**
     * Fired when a new value has been selected from the list. Only fired if selectable or includeCheckboxes is set to true
     */
    @Event()
    private change: EventEmitter;

    @State()
    private mdcCheckboxes = [];

    public componentDidLoad() {
        this.mdcList = new MDCList(
            this.element.shadowRoot.querySelector('.mdc-list')
        );

        if (this.selectable || this.includeCheckboxes) {
            this.mdcList.singleSelection = true;

            // This is ugly and not the right way to do it.
            // A better way would be to implement our own
            // adapter and foundation classes for MDCList
            // that works with the shadow DOM
            this.mdcList.foundation_.adapter_.getFocusedElementIndex = () => {
                return this.mdcList.listElements.indexOf(
                    this.element.shadowRoot.activeElement
                );
            };
            const setSelectedIndex = this.mdcList.foundation_.setSelectedIndex;
            const self = this; // tslint:disable-line:no-this-assignment
            this.mdcList.foundation_.setSelectedIndex = function(...args) {
                setSelectedIndex.apply(this, args);
                self.handleSelectItem(args[0]);
            };
            if (this.includeCheckboxes) {
                const elements = Array.from(
                    this.element.shadowRoot.querySelectorAll('.mdc-form-field')
                );

                elements.forEach(element => {
                    const formField = new MDCFormField(element);
                    const checkbox = new MDCCheckbox(element.firstChild);
                    formField.input = checkbox;
                    this.mdcCheckboxes.push(checkbox);
                });
            }
        }
    }

    public componentDidUnload() {
        this.mdcList.destroy();
        this.mdcCheckboxes.forEach(checkbox => {
            checkbox.destroy();
        });
    }

    public render() {
        const config: ListRendererConfig = {
            selectable: this.selectable || this.includeCheckboxes,
            badgeIcons: this.badgeIcons,
            includeCheckboxes: this.includeCheckboxes,
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
        if (this.selectable) {
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
        if (this.includeCheckboxes) {
            const checked = this.items.filter((item: ListItem) => {
                const optionChecked = this.mdcCheckboxes.some(mdcCheckbox => {
                    return (
                        mdcCheckbox.checked &&
                        mdcCheckbox.value === item.id.toString()
                    );
                });
                if (optionChecked) {
                    return item;
                }
            });
            this.change.emit(checked);
        }
    }
}
