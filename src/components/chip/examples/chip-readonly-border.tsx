import { Component, h } from '@stencil/core';

/**
 * Border color
 * In readonly state, the border color of the chip can be customized,
 * using `--chip-readonly-border-color`.
 */
@Component({
    tag: 'limel-example-chip-readonly-border',
    shadow: true,
    styleUrl: 'chip-readonly-border.scss',
})
export class ChipReadonlyBorderExample {
    public render() {
        const icon = {
            name: 'sent',
            color: 'rgb(var(--color-green-default))',
        };

        return <limel-chip text="Delivered" icon={icon} readonly={true} />;
    }
}
