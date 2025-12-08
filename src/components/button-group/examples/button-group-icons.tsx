import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Icon only
 *
 * If you pick well descriptive icons, this layout will usually suffice. When
 * you specify an `icon`, it will automatically be shown instead of the `title`.
 *:::important
 * Adding titles for buttons is compulsory. The reason is that when
 * only icons are shown, titles will appear as `aria-label` for screen readers,
 * as well as `title` attribute when users hover and hold their cursors on the
 * buttons.
 * :::
 * This makes it easier for them to know what the button actually does
 * or what the icon tries to indicate.
 *
 * So, make sure to label your icons properly and descriptively.
 */
@Component({
    tag: 'limel-example-button-group-icons',
    shadow: true,
})
export class ButtonGroupIconsExample {
    @State()
    private disabled: boolean = false;

    @State()
    private buttons: Button[] = [
        {
            id: '1',
            title: 'Clear sky',
            icon: 'sun',
        },
        {
            id: '2',
            title: 'Partly cloudy',
            icon: 'partly_cloudy_day',
        },
        {
            id: '3',
            title: 'Rain showers',
            icon: 'rain',
        },
        {
            id: '4',
            title: 'Thunderstorms',
            icon: 'cloudshot',
        },
        {
            id: '5',
            title: 'Snow showers',
            icon: 'snowflake',
        },
    ];

    public render() {
        return [
            <limel-button-group
                disabled={this.disabled}
                onChange={this.handleChange}
                value={this.buttons}
            />,
            <limel-example-controls>
                <limel-switch
                    label="Disabled"
                    onChange={this.toggleEnabled}
                    value={this.disabled}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event: LimelButtonGroupCustomEvent<Button>) => {
        const changedButton = event.detail;
        console.log(changedButton);

        this.buttons = this.buttons.map((button) => {
            return {
                ...button,
                selected: button.id === changedButton.id,
            };
        });
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };
}
