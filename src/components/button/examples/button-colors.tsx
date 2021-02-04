import { Component, h } from '@stencil/core';

/**
 * How to color button text and background
 * When a button is a "primary" button (`primary={true}`), the color value you specify
 * for `--lime-primary-color` will apply to its background. By default, text color
 * of primary buttons is white. To change their text color you must send a color
 * value with the `--lime-on-primary-color` variable.
 *
 * When a button is not a "primary" button, the value of `--lime-primary-color`
 * will be applied to its text, and `--lime-on-primary-color` will have no effect.
 *
 * Keep in mind that `disabled` buttons don't care about your specified colors at all.
 */
@Component({
    tag: 'limel-example-button-colors',
    shadow: true,
    styleUrl: 'button-colors.scss',
})
export class ButtonColorsExample {
    public render() {
        return (
            <div class="colorful-buttons">
                <span>Enabled</span>
                <limel-button
                    class="blue-primary"
                    label="Primary"
                    primary={true}
                    icon="star"
                />
                <limel-button
                    class="yellow-primary orange-text"
                    label="Primary"
                    primary={true}
                    icon="star"
                />
                <limel-button
                    class="blue-secondary"
                    label="Secondary"
                    icon="button"
                />
                <span>Disabled</span>
                <limel-button
                    class="blue-primary"
                    label="Primary"
                    primary={true}
                    disabled={true}
                    icon="star"
                />
                <limel-button
                    class="yellow-primary orange-text"
                    label="Primary"
                    primary={true}
                    disabled={true}
                    icon="star"
                />
                <limel-button
                    class="blue-secondary"
                    label="Secondary"
                    disabled={true}
                    icon="button"
                />
            </div>
        );
    }
}
