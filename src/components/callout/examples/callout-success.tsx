import { Component, h } from '@stencil/core';

/**
 * Type: `success`
 *
 * This type is useful for displaying information about a successful operation.
 */
@Component({
    tag: 'limel-example-callout-success',
    shadow: true,
})
export class CalloutSuccessExample {
    public render() {
        return (
            <limel-callout type="success">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                et euismod nulla. Curabitur feugiat, tortor non consequat
                finibus, justo purus auctor massa, nec semper lorem quam in
                massa.
            </limel-callout>
        );
    }
}
