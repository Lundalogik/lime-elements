import { Component, h, State } from '@stencil/core';
import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';

/**
 * Disabled item
 *
 * Individual buttons can be disabled by setting `disabled: true` on the
 * button, without disabling the rest of the group.
 */
@Component({
    tag: 'limel-example-button-group-disabled-item',
    shadow: true,
})
export class ButtonGroupDisabledItemExample {
    @State()
    private buttons: Button[] = [
        {
            id: '1',
            title: 'First',
            selected: true,
        },
        {
            id: '2',
            title: 'Second',
            disabled: true,
        },
        {
            id: '3',
            title: 'Third',
        },
    ];

    public render() {
        return (
            <limel-button-group
                onChange={this.handleChange}
                value={this.buttons}
            />
        );
    }

    private handleChange = (event: LimelButtonGroupCustomEvent<Button>) => {
        const changedButton = event.detail;

        this.buttons = this.buttons.map((button) => {
            return {
                ...button,
                selected: button.id === changedButton.id,
            };
        });
    };
}
