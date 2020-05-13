import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-icon-button-elevated',
    shadow: true,
})
export class IconButtonElevatedExample {
    @State()
    private disabled = false;

    constructor() {
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return [
            <limel-icon-button
                label="Add favourite"
                icon="heart_outlined"
                elevated={true}
                disabled={this.disabled}
                onClick={this.onClick}
            />,
            <limel-flex-container justify="end">
                <limel-button
                    onClick={this.toggleEnabled}
                    label={this.disabled ? 'Enable' : 'Disable'}
                />
            </limel-flex-container>,
        ];
    }

    private onClick() {
        console.log('Button clicked.');
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
