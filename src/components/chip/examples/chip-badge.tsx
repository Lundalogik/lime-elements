import { Component, h } from '@stencil/core';

/**
 * Chip with a badge
 * Chips can display a badge with a number or a short text.
 */
@Component({
    tag: 'limel-example-chip-badge',
    shadow: true,
    styleUrl: 'chip-badge.scss',
})
export class ChipBadgeExample {
    public render() {
        return [
            <limel-chip text="Batman" icon="batman_old" badge={2005} />,
            <limel-chip text="Batman" icon="batman_new" badge="NEW" />,
        ];
    }
}
