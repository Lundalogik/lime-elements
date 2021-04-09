import { Component, h } from '@stencil/core';

/**
 * Loading
 *
 * Note that the example is also using `disabled`, because a button that is
 * loading should normally also be disabled.
 */
@Component({
    tag: 'limel-example-button-loading',
    shadow: true,
})
export class ButtonLoadingExample {
    public render() {
        return (
            <limel-button label="My Button" disabled={true} loading={true} />
        );
    }
}
