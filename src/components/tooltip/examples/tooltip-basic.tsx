import { Component, h } from '@stencil/core';

/**
 * Basic example
 * In order to display the tooltip, the tooltip element and its trigger element
 * must be within the same document or document fragment (the same `shadowRoot`).
 * Often, it's easiest to just place them next to each other like in the example
 * below, but if you need to, you can place them differently.
 *
 * Since `limel-tooltip` is absolutely positioned, it will not occupy any
 * space in the layout.
 *
 * ```html
 * <limel-button icon="search" id="tooltip-example" />
 * <limel-tooltip label="Search" elementId="tooltip-example" />
 * ```
 */
@Component({
    tag: 'limel-example-tooltip-basic',
    shadow: true,
})
export class TooltipBasicExample {
    public render() {
        return [
            <limel-button icon="search" id="tooltip-example" />,
            <limel-tooltip
                label="Search"
                helperLabel="Find on this page"
                elementId="tooltip-example"
            />,
        ];
    }
}
