import { Component, h } from '@stencil/core';

/**
 * Type: `warning`
 *
 * This type is useful for displaying information with high importance, like warnings.
 */
@Component({
    tag: 'limel-example-callout-warning',
    shadow: true,
})
export class CalloutWarningExample {
    public render() {
        return (
            <limel-callout type="warning">
                <span slot="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla et euismod nulla. Curabitur feugiat, tortor non
                    consequat finibus, justo purus auctor massa, nec semper
                    lorem quam in massa.
                </span>
            </limel-callout>
        );
    }
}
