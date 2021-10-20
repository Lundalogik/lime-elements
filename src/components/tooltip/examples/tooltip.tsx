import { Component, h } from '@stencil/core';

/**
 * Tooltip for icons
 * with supporting a hotkey
 */
@Component({
    tag: 'limel-example-tooltip',
    shadow: true,
    styleUrl: 'tooltip.scss',
})
export class TooltipExample {
    public render() {
        return [
            <limel-button icon="search" id="tooltip-example" />,
            <limel-tooltip
                label="Search"
                helperLabel="alt+f"
                elementId="tooltip-example"
            />,
        ];
    }
}
