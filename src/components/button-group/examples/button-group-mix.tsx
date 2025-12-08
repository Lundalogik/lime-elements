import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Mixed text and icon within the same group
 *
 * Generally, you should avoid mixing text and images in button group. Although
 * individual buttons can contain text or images, mixing the two in a single
 * group can lead to an inconsistent and confusing interface.
 *
 * However, in some case your design may benefit from having only one button in
 * a different format.
 */
@Component({
    tag: 'limel-example-button-group-mix',
    shadow: true,
})
export class ButtonGroupMixExample {
    @State()
    private disabled: boolean = false;

    @State()
    private buttons: Button[] = [
        {
            id: '1',
            title: 'All',
        },
        {
            id: '2',
            title: 'Banana',
            icon: 'banana',
        },
        {
            id: '3',
            title: 'Apple',
            icon: 'apple',
        },
        {
            id: '4',
            title: 'Pear',
            icon: 'pear',
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
