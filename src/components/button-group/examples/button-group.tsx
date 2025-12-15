import { Component, h, State } from '@stencil/core';
import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';

/**
 * Text only
 *
 * This layout is good when you do not have access to icons which are
 * descriptive enough.
 */
@Component({
    tag: 'limel-example-button-group',
    shadow: true,
})
export class ButtonGroupExample {
    @State()
    private disabled: boolean = false;

    @State()
    private buttons: Button[] = [
        {
            id: '1',
            title: 'First',
        },
        {
            id: '2',
            title: 'Second',
            selected: true,
        },
        {
            id: '3',
            title: 'Third',
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
