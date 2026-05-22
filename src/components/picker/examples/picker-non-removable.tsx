import { LimelPickerCustomEvent, PickerItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Picker with non-removable values
 *
 * When `multiple={true}`, picked items become chips that are
 * removable by default. To "lock" an individual item so the user
 * cannot remove it, set `removable: false` on that item.
 *
 * A non-removable picked item:
 *
 * - has no remove button on its chip
 * - cannot be deleted with <kbd>Backspace</kbd> or <kbd>Delete</kbd>
 * - is left untouched by the "Clear all" button (which hides itself
 *   when every remaining chip is locked)
 *
 * :::note
 * Non-removable chips remain fully interactive. Clicking them still
 * emits the `interact` event. This is the right tool for pre-filled
 * values that the consumer always wants present (for example, the
 * current user in a list of meeting participants, or a mandatory
 * tag on a record), while still letting the user add and remove
 * other items freely. If you want to disable interaction entirely,
 * use the picker's `readonly` or `disabled` props instead.
 * :::
 */
@Component({
    tag: 'limel-example-picker-non-removable',
    shadow: true,
})
export class PickerNonRemovableExample {
    @State()
    private selectedItems: Array<PickerItem<number>> = [
        {
            text: 'You',
            value: 0,
            icon: 'user_shield',
            removable: false,
        },
    ];

    private allItems: Array<PickerItem<number>> = [
        { text: 'Admiral Swiggins', value: 1, icon: 'person_male' },
        { text: 'Ayla', value: 2, icon: 'person_female' },
        { text: 'Clunk', value: 3, icon: 'person_male' },
        { text: 'Coco', value: 4, icon: 'person_female' },
        { text: 'Derpl', value: 5, icon: 'person_male' },
        { text: 'Froggy G', value: 6, icon: 'person_male' },
        { text: 'Lonestar', value: 8, icon: 'person_male' },
        { text: 'Lucy', value: 14, icon: 'person_female' },
        { text: 'Raelynn', value: 10, icon: 'person_female' },
        { text: 'Voltar', value: 12, icon: 'person_male' },
        { text: 'Yuri', value: 13, icon: 'person_male' },
    ];

    private availableItems: Array<PickerItem<number>> = [...this.allItems];

    public render() {
        return (
            <Host>
                <limel-picker
                    label="Meeting participants"
                    helperText="You are always a participant and cannot be removed."
                    searchLabel="Add a participant"
                    value={this.selectedItems}
                    multiple={true}
                    allItems={this.availableItems}
                    emptyResultMessage="No matching participants found"
                    onChange={this.onChange}
                    onInteract={this.onInteract}
                />
                <limel-example-value value={this.selectedItems} />
            </Host>
        );
    }

    private onChange = (
        event: LimelPickerCustomEvent<Array<PickerItem<number>>>
    ) => {
        this.selectedItems = [...event.detail];
        this.updateAvailableItems();
    };

    private updateAvailableItems = () => {
        this.availableItems = this.allItems.filter((item) => {
            return !this.selectedItems.some((selectedItem) => {
                return item.value === selectedItem.value;
            });
        });
    };

    private onInteract = (
        event: LimelPickerCustomEvent<PickerItem<number>>
    ) => {
        console.log('Value interacted with:', event.detail);
    };
}
