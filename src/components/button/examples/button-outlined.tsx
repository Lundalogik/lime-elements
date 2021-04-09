import { Component, h } from '@stencil/core';

/**
 * Outlined
 */
@Component({
    tag: 'limel-example-button-outlined',
    shadow: true,
})
export class ButtonOutlinedExample {
    public render() {
        return <limel-button label="My Button" outlined={true} />;
    }
}
