import { Component, h, State } from '@stencil/core';

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

    public render() {
        return [
            <limel-button-group
                disabled={this.disabled}
                onChange={this.handleChange}
                value={[
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
                ]}
            />,
            <kompendium-example-controls>
                <limel-checkbox
                    label="Disabled"
                    onChange={this.toggleEnabled}
                    checked={this.disabled}
                />
            </kompendium-example-controls>,
        ];
    }

    private handleChange = (event) => {
        console.log(event.detail);
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };
}
