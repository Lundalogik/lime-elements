import { Component, h } from '@stencil/core';

/**
 * Basic Example
 *
 * Just an icon and a click-handler.
 * Open the dev-tools console to see logged clicks.
 */
@Component({
    tag: 'limel-example-icon-button-basic',
    shadow: true,
})
export class IconButtonBasicExample {
    public render() {
        return [
            <limel-icon-button
                label="Add favourite"
                icon="heart_outlined"
                onClick={this.onClick}
            />,
        ];
    }

    private onClick() {
        console.log('Button clicked.');
    }
}
