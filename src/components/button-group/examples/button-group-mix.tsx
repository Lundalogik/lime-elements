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

    public render() {
        return [
            <limel-button-group
                disabled={this.disabled}
                onChange={this.handleChange}
                value={[
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
                ]}
            />,
            <limel-example-controls>
                <limel-checkbox
                    label="Disabled"
                    onChange={this.toggleEnabled}
                    checked={this.disabled}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event) => {
        console.log(event.detail);
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };
}
