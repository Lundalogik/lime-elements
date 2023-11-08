import { Component, h } from '@stencil/core';

/**
 * Disabled
 * :::note
 * Discover when to utilize the disabled state and when it is preferable to hide a button by reading our guidelines [Disabled vs. Hidden](#/DesignGuidelines/disabled-hidden.md/).
 * :::
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
