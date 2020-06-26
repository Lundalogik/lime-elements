import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-button-group-mix',
    shadow: true,
})
export class ButtonGroupMixExample {
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
