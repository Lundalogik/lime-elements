import { Component, h } from '@stencil/core';

/**
 * Type: `info`
 *
 * This is the default type, which means the component will automatically
 * select it, if no type is specified specified by you.
 * It is useful for displaying information with low importance.
 */
@Component({
    tag: 'limel-example-callout-info',
    shadow: true,
})
export class CalloutInfoExample {
    public render() {
        return (
            <limel-callout>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                et euismod nulla. Curabitur feugiat, tortor non consequat
                finibus, justo purus auctor massa, nec semper lorem quam in
                massa.
            </limel-callout>
        );
    }
}
