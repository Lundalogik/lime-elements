import { Component, h } from '@stencil/core';

/**
 * Icon color
 * Using the `Icon` interface, you can specify colors for the icon.
 */
@Component({
    tag: 'limel-example-chip-icon-colors',
    shadow: true,
})
export class ChipIconColorsExample {
    public render() {
        const icon = {
            name: 'filled_star',
            color: 'rgb(var(--color-yellow-default))',
            backgroundColor: 'rgb(var(--color-blue-dark))',
        };

        return <limel-chip text="Golden star" icon={icon} />;
    }
}
