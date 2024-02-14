import { Component, h } from '@stencil/core';

/**
 * Basic example
 *
 * :::tip
 * Users can still hover the cursor on the truncated headings to read the full
 * text.
 * :::
 *
 */

@Component({
    tag: 'limel-example-header',
    shadow: true,
})
export class HeaderExample {
    public render() {
        return (
            <limel-header
                icon="brake_warning"
                heading="Useful information"
                subheading="Note"
                supportingText="Data couldn't be loaded!"
            />
        );
    }
}
