import { Component, h, Host, State } from '@stencil/core';
import { DockItem } from '@limetech/lime-elements';

/**
 * Showing the labels of the dock items
 *
 * Set `expanded` to `true` to show the labels of the dock items together
 * with their icons. In the vertical layout, the labels are placed beside
 * the icons. In the horizontal mobile layout, they are placed below the
 * icons, in small text that is truncated when there is not enough space.
 * Items that have a `helperLabel` still show it as a tooltip.
 *
 * Use the switches to toggle `expanded`, and to switch between the vertical
 * layout and the mobile layout. In the mobile layout, drag the lower right
 * corner of the example to change its width, and see how the labels are
 * truncated when the items get less space.
 *
 * In the vertical layout, end-users can expand and shrink the dock with the
 * button at the bottom of it. In the horizontal layout, there is no room for
 * that button, so the component does not show it there. Whether the labels
 * are shown is up to you, for example by letting users change it in their
 * settings.
 *
 * The component switches to the mobile layout when the screen is narrower
 * than `mobileBreakPoint`. To let you try both layouts here in the
 * documentation, no matter how large your screen is, this example sets
 * `mobileBreakPoint` to a very large number (`5000`) for the mobile layout,
 * and to `0` for the vertical layout.
 */
@Component({
    tag: 'limel-example-dock-expanded',
    shadow: true,
    styleUrl: 'dock-expanded.scss',
})
export class DockExpandedExample {
    @State()
    private expanded = true;

    @State()
    private mobileLayout = false;

    @State()
    private dockItems: DockItem[] = [
        {
            id: 'home',
            label: 'Lime',
            helperLabel: 'Cmd + H',
            selected: true,
            icon: '-lime-logo-outlined-colored',
        },
        {
            id: 'tables',
            label: 'Tables',
            icon: 'insert_table',
            dockMenu: { componentName: 'my-custom-menu' },
        },
        {
            id: 'search',
            label: 'Search',
            icon: 'search',
        },
    ];

    @State()
    private dockFooterItems: DockItem[] = [
        {
            id: 'create',
            label: 'Create object',
            icon: 'plus_math',
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings',
        },
    ];

    public render() {
        return (
            <Host>
                <div class="application">
                    <limel-dock
                        accessibleLabel="Dock Example: expanded"
                        dockItems={this.dockItems}
                        dockFooterItems={this.dockFooterItems}
                        onItemSelected={this.handleSelected}
                        mobileBreakPoint={this.mobileLayout ? 5000 : 0}
                        expanded={this.expanded}
                        onDockExpanded={this.setExpanded}
                    />
                </div>
                <limel-example-controls>
                    <limel-switch
                        label="Expanded"
                        value={this.expanded}
                        onChange={this.setExpanded}
                    />
                    <limel-switch
                        label="Mobile layout"
                        value={this.mobileLayout}
                        onChange={this.setMobileLayout}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setExpanded = (event: CustomEvent<boolean>) => {
        this.expanded = event.detail;
    };

    private setMobileLayout = (event: CustomEvent<boolean>) => {
        this.mobileLayout = event.detail;
    };

    private handleSelected = (event: CustomEvent<DockItem>) => {
        const setSelection = (item: DockItem) => {
            return {
                ...item,
                selected: item.id === event.detail.id,
            };
        };

        this.dockItems = this.dockItems.map(setSelection);
        this.dockFooterItems = this.dockFooterItems.map(setSelection);
    };
}
