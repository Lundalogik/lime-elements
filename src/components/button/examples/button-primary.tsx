import { Component, h } from '@stencil/core';

/**
 * Primary
 */
@Component({
    tag: 'limel-example-button-primary',
    shadow: true,
})
export class ButtonPrimaryExample {
    public render() {
        return <limel-button label="My Button" primary={true} />;
    }
}
