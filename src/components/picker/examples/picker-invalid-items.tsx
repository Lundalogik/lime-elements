import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Per-item invalid state
 *
 * Set `invalid: true` on any `ListItem` passed to the picker's `value` to
 * render that specific selection as an invalid chip. This is useful when
 * a previously-valid selection is no longer valid (for example, a
 * deactivated user or an archived tag) while other selections remain
 * valid.
 *
 * This is independent of the picker-level `invalid` prop, which marks
 * the whole field as invalid.
 */
@Component({
    tag: 'limel-example-picker-invalid-items',
    shadow: true,
})
export class PickerInvalidItemsExample {
    private allItems: Array<ListItem<number>> = [
        { text: 'Admiral Swiggins', value: 1 },
        { text: 'Ayla', value: 2 },
        { text: 'Clunk', value: 3, invalid: true },
        { text: 'Coco', value: 4 },
        { text: 'Derpl', value: 5, invalid: true },
        { text: 'Froggy G', value: 6 },
    ];

    @State()
    private selectedItems: Array<ListItem<number>> = [
        this.allItems[0],
        this.allItems[2],
        this.allItems[3],
    ];

    public render() {
        return [
            <limel-picker
                label="Team members"
                value={this.selectedItems}
                multiple={true}
                allItems={this.availableItems()}
                emptyResultMessage="No matching members found"
                onChange={this.onChange}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private availableItems = (): Array<ListItem<number>> => {
        return this.allItems.filter((item) => {
            return !this.selectedItems.some((selected) => {
                return selected.value === item.value;
            });
        });
    };

    private onChange = (
        event: LimelPickerCustomEvent<Array<ListItem<number>>>
    ) => {
        this.selectedItems = [...event.detail];
    };
}
