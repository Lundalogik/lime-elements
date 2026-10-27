import { Component, h, Host } from '@stencil/core';

/**
 * Heading level
 * The `headingLevel` decides which of the heading elements, from `h1` to
 * `h6`, draws the header of the section. Set it so that the heading fits
 * below the headings around the section. Here, the section is below an `h2`,
 * so its heading is an `h3`.
 *
 * The heading level does not change how the header looks.
 */
@Component({
    tag: 'limel-example-collapsible-section-heading-level',
    shadow: true,
})
export class CollapsibleSectionHeadingLevelExample {
    public render() {
        return (
            <Host>
                <h2>Order</h2>
                <limel-collapsible-section header="Delivery" headingLevel={3}>
                    <p>Where and when the order arrives.</p>
                </limel-collapsible-section>
            </Host>
        );
    }
}
