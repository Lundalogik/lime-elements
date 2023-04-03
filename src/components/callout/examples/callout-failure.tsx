import { Component, h } from '@stencil/core';

/**
 * Type: `failure`
 *
 * It is useful for displaying information about a failed operation.
 */
@Component({
    tag: 'limel-example-callout-failure',
    shadow: true,
})
export class CalloutInfoExample {
    public render() {
        return (
            <limel-callout type="failure">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                et euismod nulla. Curabitur feugiat, tortor non consequat
                finibus, justo purus auctor massa, nec semper lorem quam in
                massa.
            </limel-callout>
        );
    }
}
