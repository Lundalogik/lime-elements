import { Component, h } from '@stencil/core';

/**
 * Type: `quote`
 *
 * It is useful for displaying a quote.
 */
@Component({
    tag: 'limel-example-callout-quote',
    shadow: true,
})
export class CalloutQuoteExample {
    public render() {
        return (
            <limel-callout type="quote">
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
