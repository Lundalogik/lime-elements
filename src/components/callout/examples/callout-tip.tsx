import { Component, h } from '@stencil/core';

/**
 * Type: `tip`
 *
 * This type is useful for displaying tips & tricks, and How-Tos.
 */
@Component({
    tag: 'limel-example-callout-tip',
    shadow: true,
})
export class CalloutTipExample {
    public render() {
        return (
            <limel-callout type="tip">
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
