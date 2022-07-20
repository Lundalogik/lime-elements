import { Component, h, State } from '@stencil/core';
import { DockItemConfig } from '../dock.types';

/**
 * Displaying a custom component after Dock item is clicked
 *
 * It is possible to display a custom component in a popover,
 * when the Dock item is clicked. This enables you to design
 * the content of the menu as you wish, independently from the Dock.
 *
 * :::note
 * Pay attention to the `--popover-surface-width` variable in the
 * `.SCSS` file. That defines the width the popover component, which is `auto`
 * by default. But modifying it may be helpful depending on the usage.
 * :::
 *
 * @link my-custom-menu.tsx
 */

@Component({
    tag: 'limel-example-dock-custom-component',
    shadow: true,
    styleUrl: 'dock-basic.scss',
})
export class DockCustomComponentExample {
    @State()
    private dockItems: DockItemConfig[] = [
        {
            value: 'home',
            label: 'Lime',
            helperLabel: 'Cmd + H',
            selected: true,
            icon: '-lime-logo-outlined-colored',
        },
        {
            value: 'tables',
            label: 'Tables',
            icon: 'insert_table',
            component: { name: 'my-custom-menu' },
        },
    ];

    public render() {
        return [
            <div class="application">
                <limel-dock
                    dockItems={this.dockItems}
                    onChange={this.handleChange}
                />
            </div>,

            <limel-example-value
                value={this.dockItems.find((i) => i.selected)}
            />,
        ];
    }

    private handleChange = (event: CustomEvent<DockItemConfig>) => {
        this.dockItems = this.dockItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    };
}
