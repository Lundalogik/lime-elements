import { LimelPickerCustomEvent, PickerItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Picker with badges on picked chips
 *
 * Set `badge` on a `PickerItem` to stamp the resulting chip with a
 * short status label or counter. The badge accepts a string
 * (e.g. `"Inactive"`, `"Beta"`) or a number (e.g. `12`).
 *
 * Use it to surface metadata about the picked value at a glance
 * without forcing the consumer to read the chip text or open a
 * tooltip — for example, marking deactivated users in a group
 * picker, or flagging items that have unread notifications.
 *
 * :::note
 * For long string labels you may need to override the
 * `--badge-max-width` CSS custom property on the host element of
 * the consuming component, since the default is tuned for short
 * numeric counters.
 * :::
 */
@Component({
    tag: 'limel-example-picker-with-badges',
    shadow: true,
})
export class PickerWithBadgesExample {
    @State()
    private selectedItems: Array<PickerItem<number>> = [
        {
            text: 'Admiral Swiggins',
            value: 1,
            icon: 'person_male',
            badge: 'Inactive',
            secondaryText: 'Inactive',
        },
        {
            text: 'Ayla',
            value: 2,
            icon: 'person_female',
        },
    ];

    private allItems: Array<PickerItem<number>> = [
        {
            text: 'Admiral Swiggins',
            value: 1,
            icon: 'person_male',
            badge: 'Inactive',
            secondaryText: 'Inactive',
        },
        { text: 'Ayla', value: 2, icon: 'person_female' },
        { text: 'Clunk', value: 3, icon: 'person_male' },
        { text: 'Coco', value: 4, icon: 'person_female' },
        {
            text: 'Derpl',
            value: 5,
            icon: 'person_male',
            badge: 'Inactive',
            secondaryText: 'Inactive',
        },
        { text: 'Froggy G', value: 6, icon: 'person_male' },
        { text: 'Lonestar', value: 8, icon: 'person_male' },
        { text: 'Lucy', value: 14, icon: 'person_female' },
        { text: 'Raelynn', value: 10, icon: 'person_female' },
        { text: 'Voltar', value: 12, icon: 'person_male' },
        { text: 'Yuri', value: 13, icon: 'person_male' },
    ];

    private availableItems: Array<PickerItem<number>> = this.allItems.filter(
        (item) =>
            !this.selectedItems.some(
                (selected) => selected.value === item.value
            )
    );

    public render() {
        return (
            <Host>
                <limel-picker
                    label="Meeting participants"
                    searchLabel="Add a participant"
                    value={this.selectedItems}
                    multiple={true}
                    allItems={this.availableItems}
                    onChange={this.onChange}
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
}
