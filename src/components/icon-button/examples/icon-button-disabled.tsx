import { Component, h } from '@stencil/core';

/**
 * Disabled
 */
@Component({
    tag: 'limel-example-icon-button',
    shadow: true,
})
export class IconButtonDisabledExample {
    public render() {
        return [
            <limel-icon-button
                label="Add favourite"
                icon="heart_outlined"
                disabled={true}
                onClick={this.onClick}
            />,
        ];
    }

    private onClick() {
        console.log('This should never happen, since the button is disabled.');
    }
}
