import { Component, h } from '@stencil/core';

/**
 * Icon
 */
@Component({
    tag: 'limel-example-button-icon',
    shadow: true,
})
export class ButtonIconExample {
    public render() {
        return <limel-button icon="filled_message" />;
    }
}
