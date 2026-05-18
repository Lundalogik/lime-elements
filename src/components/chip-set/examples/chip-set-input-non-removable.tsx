import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { ENTER } from '../../../util/keycodes';

/**
 * Input chip set with non-removable chips
 *
 * In a chip-set of `type="input"`, chips are removable by default.
 * To "lock" an individual chip so the user cannot remove it,
 * set `removable: false` on that chip.
 *
 * A non-removable chip:
 *
 * - has no remove button
 * - cannot be deleted with <kbd>Backspace</kbd> or <kbd>Delete</kbd>
 * - is left untouched by the "Clear all" button (which hides itself
 *   when every remaining chip is locked)
 *
 * :::note
 * The non-removable chips remain fully interactive. It means clicking them still emits
 * the `interact` event. This is the right tool for pre-filled values
 * that the consumer always wants present (for example, the current
 * user in a list of meeting participants, or a mandatory tag on a
 * record), while still letting the user add and remove other chips
 * freely. If you want to disable interaction entirely, use the
 * chip-set's `readonly` or `disabled` props instead.
 * :::
 */
@Component({
    tag: 'limel-example-chip-set-input-non-removable',
    shadow: true,
})
export class ChipSetInputNonRemovableExample {
    @State()
    private value: Chip[] = [
        {
            id: 'me',
            text: 'You',
            icon: 'user_shield',
            removable: false,
        },
        {
            id: 'lucy',
            text: 'Lucy',
            icon: 'person_female',
        },
        {
            id: 'befkadu',
            text: 'Befkadu',
            icon: 'person_male',
        },
    ];

    @State()
    private textValue = '';

    public render() {
        return (
            <Host>
                <limel-chip-set
                    type="input"
                    label="Meeting participants"
                    helperText="You are always a participant and cannot be removed."
                    searchLabel="Add a participant & press Enter"
                    value={this.value}
                    onChange={this.handleChange}
                    onInput={this.handleInput}
                    onInteract={this.handleInteraction}
                    onKeyUp={this.onKeyUp}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleInput = (
        event: LimelChipSetCustomEvent<string> | InputEvent
    ) => {
        if (event instanceof CustomEvent) {
            this.textValue = event.detail;
        }
    };

    private onKeyUp = (event: KeyboardEvent) => {
        if (event.key === ENTER && this.textValue.trim()) {
            const name = this.textValue.trim();
            this.value = [
                ...this.value,
                {
                    id: name,
                    text: name,
                    icon: 'person_male',
                },
            ];
            this.textValue = '';
        }
    };

    private handleChange = (event: LimelChipSetCustomEvent<Chip[]>) => {
        this.value = event.detail;
    };

    private handleInteraction = (event: CustomEvent<Chip>) => {
        console.log('Chip interacted with:', event.detail);
    };
}
