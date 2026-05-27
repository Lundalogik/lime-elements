import { LimelPickerCustomEvent, PickerItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * With a custom empty-result message
 *
 * When the user's query returns no matches, the picker shows a
 * generic translated message (`No results matching "X"` in English,
 * where `X` is the typed query). To replace it with a more
 * domain-specific phrase, set `emptyResultMessage`.
 *
 * :::note
 * Most pickers do **not** need to set this prop. The default already
 * reads naturally for any domain. Customize only when the picker's
 * content has a name worth mentioning — for example, a participants
 * picker that should say "No matching participants found" instead of
 * the generic default.
 * :::
 *
 * Type something that doesn't match any of the items below (e.g.,
 * `xyz`) to see the custom message appear.
 */
@Component({
    tag: 'limel-example-picker-empty-result-message',
    shadow: true,
})
export class PickerEmptyResultMessageExample {
    @State()
    private selectedItems: Array<PickerItem<number>> = [];

    private readonly allItems: Array<PickerItem<number>> = [
        { text: 'Admiral Swiggins', value: 1, icon: 'person_male' },
        { text: 'Ayla', value: 2, icon: 'person_female' },
        { text: 'Clunk', value: 3, icon: 'person_male' },
        { text: 'Coco', value: 4, icon: 'person_female' },
        { text: 'Derpl', value: 5, icon: 'person_male' },
        { text: 'Lonestar', value: 8, icon: 'person_male' },
        { text: 'Raelynn', value: 10, icon: 'person_female' },
        { text: 'Voltar', value: 12, icon: 'person_male' },
    ];

    public render() {
        return (
            <Host>
                <limel-picker
                    label="Meeting participants"
                    searchLabel="Search for a participant"
                    value={this.selectedItems}
                    multiple={true}
                    allItems={this.allItems}
                    emptyResultMessage="No matching participants found"
                    onChange={this.onChange}
                />
                <limel-example-value value={this.selectedItems} />
            </Host>
        );
    }

    private readonly onChange = (
        event: LimelPickerCustomEvent<Array<PickerItem<number>>>
    ) => {
        this.selectedItems = [...event.detail];
    };
}
