import { Component, h } from '@stencil/core';

/**
 * Type: `danger`
 *
 * This type is useful for displaying information with very high importance,
 * such as warnings about actions that have destructive consequences.
 */
@Component({
    tag: 'limel-example-callout-danger',
    shadow: true,
})
export class CalloutDangerExample {
    public render() {
        return (
            <limel-callout type="danger">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                et euismod nulla. Curabitur feugiat, tortor non consequat
                finibus, justo purus auctor massa, nec semper lorem quam in
                massa.
            </limel-callout>
        );
    }
}
