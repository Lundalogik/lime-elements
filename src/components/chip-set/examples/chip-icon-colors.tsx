import { Component, h } from '@stencil/core';

/**
 * Chip Icon Color
 *
 * The color and background color of each chip's icon can be individually
 * configured.
 */
@Component({
    tag: 'limel-example-chip-icon-color',
    shadow: true,
})
export class ChipIconColorExample {
    public render() {
        return [
            <limel-chip-set
                value={[
                    {
                        id: 1,
                        text: 'Badger',
                        icon: 'badger',
                    },
                    {
                        id: 2,
                        text: 'Elephant',
                        icon: 'elephant',
                        iconFillColor: 'rgb(var(--color-magenta-default))',
                    },
                    {
                        id: 3,
                        text: 'Caterpillar',
                        icon: 'caterpillar',
                        iconBackgroundColor: 'rgb(var(--color-orange-default))',
                    },
                    {
                        id: 4,
                        text: 'Fish',
                        icon: 'fish',
                        iconFillColor: 'rgb(var(--color-yellow-light))',
                        iconBackgroundColor: 'rgb(var(--color-indigo-darker))',
                    },
                ]}
            />,
        ];
    }
}
