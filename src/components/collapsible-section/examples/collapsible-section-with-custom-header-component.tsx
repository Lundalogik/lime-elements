import { Component, h } from '@stencil/core';

/**
 * With custom component in the header
 * By using the `slot="header"` attribute on a custom UI elements, you can place it
 * in the header area of the collapsible section alongside the default header text
 * and header actions.
 * This can enable richer header content, like status indicators, badges, or icons.
 *
 * :::important
 * 1. The custom component is responsible for its own size, and should not
 * visually grow out of the header area.
 * 1. If the is not interactive, we recommend styling it with `pointer-events: none;`,
 * to avoid blocking the user from interacting with the header. This is because
 * the entire surface of the header should be clickable to toggle visibility of the section.
 * :::
 */
@Component({
    tag: 'limel-example-collapsible-section-with-custom-header-component',
    shadow: true,
})
export class CollapsibleSectionWithCustomHeaderComponentExample {
    public render() {
        const style = {
            'pointer-events': 'none',
        };

        return (
            <limel-collapsible-section header="This section has custom content in the header">
                <limel-circular-progress
                    style={style}
                    slot="header"
                    value={65}
                    size="x-small"
                />
                <p>This element becomes the body.</p>
            </limel-collapsible-section>
        );
    }
}
