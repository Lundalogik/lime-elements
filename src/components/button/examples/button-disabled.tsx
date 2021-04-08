import { Component, h } from '@stencil/core';

/**
 * Disabled
 */
@Component({
    tag: 'limel-example-button-disabled',
    shadow: true,
})
export class ButtonDisabledExample {
    public render() {
        return (
            <limel-button
                label="My Button"
                disabled={true}
                onClick={this.onClick}
            />
        );
    }

    private onClick() {
        console.log('This should never happen, since the button is disabled.');
    }
}
