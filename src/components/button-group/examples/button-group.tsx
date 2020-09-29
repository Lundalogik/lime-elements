import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-button-group',
    shadow: true,
})
export class ButtonGroupExample {
    @State()
    private disabled: boolean = false;

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return [
            <limel-button-group
                disabled={this.disabled}
                onChange={this.onChange}
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
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        checked={this.disabled}
                    />
                </limel-flex-container>
            </p>,
        ];
    }

    private onChange(event) {
        console.log(event.detail);
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
