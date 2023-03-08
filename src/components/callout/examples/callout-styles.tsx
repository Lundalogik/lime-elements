import { Component, h } from '@stencil/core';

/**
 * Styling
 *
 * It is possible to change the default colors
 * using provided CSS variables. Just make sure to have
 * good contrast between the text and background color,
 * to provide good readability.
 */
@Component({
    tag: 'limel-example-callout-styles',
    shadow: true,
    styleUrl: 'callout-styles.scss',
})
export class CalloutStylesExample {
    public render() {
        return [
            <limel-callout type="example">
                <span slot="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla et euismod nulla. Curabitur feugiat, tortor non
                    consequat finibus, justo purus auctor massa, nec semper
                    lorem quam in massa.
                </span>
            </limel-callout>,
            <limel-callout type="note">
                <span slot="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla et euismod nulla. Curabitur feugiat, tortor non
                    consequat finibus, justo purus auctor massa, nec semper
                    lorem quam in massa.
                </span>
            </limel-callout>,
        ];
    }
}
