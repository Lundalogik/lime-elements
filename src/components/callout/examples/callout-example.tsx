import { Component, h } from '@stencil/core';

/**
 * Type: `example`
 *
 * This type is useful for displaying tips & tricks, and How-Tos.
 */
@Component({
    tag: 'limel-example-callout-example',
    shadow: true,
})
export class CalloutExampleExample {
    public render() {
        return (
            <limel-callout type="example">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                et euismod nulla. Curabitur feugiat, tortor non consequat
                finibus, justo purus auctor massa, nec semper lorem quam in
                massa.
            </limel-callout>
        );
    }
}
