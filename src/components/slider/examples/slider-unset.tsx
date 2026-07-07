import { Component, h, Host, State } from '@stencil/core';

/**
 * Unsetting the value
 *
 * This slider is initialized *unset*, which means its `value` is `NaN`.
 * Therefore the thumb rests in the middle, and the value indicator shows a `?`.
 * Assistive technologies announce the value as "Value not set".
 *
 * As soon as the user drags the thumb (or nudges it with the arrow keys),
 * the slider becomes set and the trailing **clear** button becomes active.
 * Pressing it unsets the slider again, emitting `NaN` on the `change` event.
 *
 * A `required` slider does not offer the clear button — a required value
 * cannot be unset — but it can still start unset to prompt a first choice.
 *
 * To unset the slider programmatically, set its `value` to `NaN` (or any
 * other non-finite value, such as `undefined`).
 */
@Component({
    tag: 'limel-example-slider-unset',
    shadow: true,
})
export class SliderUnsetExample {
    @State()
    private value: number = Number.NaN;

    public render() {
        return (
            <Host>
                <limel-slider
                    label="Priority"
                    value={this.value}
                    valuemin={1}
                    valuemax={5}
                    step={1}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private readonly handleChange = (event: CustomEvent<number>) => {
        this.value = event.detail;
    };
}
