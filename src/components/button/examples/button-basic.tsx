import { Component, h } from '@stencil/core';

/**
 * Basic Example
 *
 * Just a label and a click-handler.
 * Open the dev-tools console to see logged clicks.
 */
@Component({
    tag: 'limel-example-button-basic',
    shadow: true,
})
export class ButtonBasicExample {
    public render() {
        return <limel-button label="Click me!" onClick={this.onClick} />;
    }

    private onClick() {
        console.log('Button clicked.');
    }
}
