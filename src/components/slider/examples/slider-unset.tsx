import { Component, h, Host, State } from '@stencil/core';

/**
 * Unsetting the value
 *
 * This slider is initialized *unset*, which means its `value` is `null`.
 * Therefore the thumb rests in the middle, and the value indicator shows a
 * left-right arrow (`↔`) instead of a number.
 * Assistive technologies announce the value as "Value not set".
 *
 * As soon as the user drags the thumb, presses anywhere on the track, or
 * nudges the thumb with the arrow keys, the slider becomes set and the
 * trailing **clear** button becomes active.
 * Pressing it unsets the slider again, emitting `null` on the `change`
 * event — so a handler must accept `number | null`.
 *
 * A `required` slider does not offer the clear button — a required value
 * cannot be unset — but it can still start unset to prompt a first choice.
 *
 * To unset the slider programmatically, set its `value` to `null`. Any other
 * value that is not a finite number — `undefined`, or `NaN` — works too.
 */
@Component({
    tag: 'limel-example-slider-unset',
    shadow: true,
})
export class SliderUnsetExample {
    @State()
    private value: number | null = null;

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

    private readonly handleChange = (event: CustomEvent<number | null>) => {
        this.value = event.detail;
    };
}
