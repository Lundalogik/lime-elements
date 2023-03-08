import { Component, h } from '@stencil/core';

/**
 * Type: `note`
 *
 * Shows how a short description as a warning looks like
 */
@Component({
    tag: 'limel-example-callout-note',
    shadow: true,
})
export class CalloutNoteExample {
    public render() {
        return (
            <limel-callout type="note">
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
