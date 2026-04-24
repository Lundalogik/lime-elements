import { Component, h } from '@stencil/core';

/**
 * Basic example
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
