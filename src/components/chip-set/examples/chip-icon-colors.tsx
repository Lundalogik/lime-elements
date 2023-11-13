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
                        icon: {
                            name: 'elephant',
                            color: 'rgb(var(--color-magenta-default))',
                        },
                    },
                    {
                        id: 3,
                        text: 'Caterpillar',
                        icon: {
                            name: 'caterpillar',
                            backgroundColor: 'rgb(var(--color-orange-default))',
                        },
                    },
                    {
                        id: 4,
                        text: 'Fish',
                        icon: {
                            name: 'fish',
                            color: 'rgb(var(--color-yellow-light))',
                            backgroundColor: 'rgb(var(--color-indigo-darker))',
                        },
                    },
                ]}
            />,
        ];
    }
}
