import { Component, h } from '@stencil/core';

/**
 * Basic example
 * Anything that is nested inside the `limel-collapsible-section` component
 * will be shown in the body of the section, only visible when the section is expanded.
 */
@Component({
    tag: 'limel-example-collapsible-section-basic',
    shadow: true,
})
export class CollapsibleSectionExample {
    public render() {
        return (
            <limel-collapsible-section header="Header">
                <p>Body</p>
            </limel-collapsible-section>
        );
    }
}
