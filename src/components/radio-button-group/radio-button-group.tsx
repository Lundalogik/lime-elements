import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { ListItem, ListSeparator } from '../list/list-item.types';
import { LimelListCustomEvent } from '@limetech/lime-elements';

/**
 * The Radio Button component provides a convenient way to create a group of radio buttons
 * from an array of options. Radio buttons allow users to select a single option from
 * multiple choices, making them ideal for exclusive selections.
 *
 * :::note
 * A single radio button is never useful in a UI. Radio buttons should always come in groups
 * of at least 2 options where only one can be selected at a time.
 * :::
 *
 * @exampleComponent limel-example-radio-button-group-basic
 * @exampleComponent limel-example-radio-button-group-deselect-selected
 * @exampleComponent limel-example-radio-button-group-icons
 * @exampleComponent limel-example-radio-button-group-multiple-lines
 * @beta
 */
@Component({
    tag: 'limel-radio-button-group',
    shadow: false,
})
export class RadioButtonGroup {
    /**
     * Array of radio button options to display
     */
    @Prop()
    public items: Array<ListItem | ListSeparator>;

    /**
     * The currently selected item in the radio button group.
     * This is a ListItem object that contains the value and other properties of the selected item.
     * If no item is selected, this will be `undefined`.
     */
    @Prop()
    public selectedItem?: ListItem<string | number>;

    /**
     * Disables all radio buttons when `true`
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` if the radio button group should display larger icons with a background
     */
    @Prop({ reflect: true })
    public badgeIcons: boolean;

    /**
     * By default, lists will display 3 lines of text, and then truncate the rest.
     * Consumers can increase or decrease this number by specifying
     * `maxLinesSecondaryText`. If consumer enters zero or negative
     * numbers we default to 1; and if they type decimals we round up.
     */
    @Prop({ reflect: true })
    public maxLinesSecondaryText: number = 3;

    /**
     * Emitted when the selection changes with the full ListItem payload
     */
    @Event()
    public change: EventEmitter<ListItem<string | number | undefined>>;

    public render() {
        return (
            <limel-list
                items={this.createItems()}
                type="radio"
                badgeIcons={this.badgeIcons}
                maxLinesSecondaryText={this.maxLinesSecondaryText}
                onChange={this.handleChange}
            />
        );
    }

    private createItems(): Array<ListItem | ListSeparator> {
        return this.items.map((option: ListItem) => {
            if ('separator' in option) {
                return option;
            }
            return {
                ...option,
                selected: option.value === this.selectedItem?.value,
                disabled: this.disabled || option.disabled,
            };
        });
    }

    private handleChange = (event: LimelListCustomEvent<ListItem>) => {
        event.stopPropagation();

        if (this.disabled) {
            return;
        }

        this.change.emit(event.detail);
    };
}
