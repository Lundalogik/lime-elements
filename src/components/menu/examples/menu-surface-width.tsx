import {
    MenuItem,
    ListSeparator,
    SurfaceWidth,
    Option,
    LimelSelectCustomEvent,
} from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';

interface SurfaceWidthOption extends Option<SurfaceWidth> {
    buttonLabel: string;
}

/**
 * Size of the menu drop-down surface
 *
 * Any element in the UI can be configured to open a menu.
 * By default, the dropdown that opens up after the menu trigger is clicked
 * inherits its width from the items that are inside the dropdown menu.
 *
 * However, for some designs, you may want the width of the menu dropdown
 * to be exactly as wide as the width of its trigger element, or
 * as wide as `limel-menu` element itself. This is easily achieved using the
 * `surfaceWidth` prop. Read more on `SurfaceWidth`.
 *
 * :::tip
 * In this example, `limel-menu` is highlighted with a dashed border,
 * to make it easier to see its width.
 * :::
 * :::note
 * The `--menu-surface-width` Overrides the width defined by `surfaceWidth`!
 * :::
 */
@Component({
    tag: 'limel-example-menu-surface-width',
    styleUrl: 'menu-surface-width.scss',
    shadow: true,
})
export class MenuSurfaceWidthExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Small text',
        },
        {
            text: 'Very very wide text',
        },
    ];

    private availableSurfaceWidths: SurfaceWidthOption[] = [];

    @State()
    private selectedSurfaceWidth: SurfaceWidthOption;

    constructor() {
        this.availableSurfaceWidths = [
            {
                text: 'inherit-from-items',
                value: 'inherit-from-items',
                buttonLabel: 'Width based on menu items (default)',
            },
            {
                text: 'inherit-from-menu',
                value: 'inherit-from-menu',
                buttonLabel: 'Width based on limel-menu',
            },
            {
                text: 'inherit-from-trigger',
                value: 'inherit-from-trigger',
                buttonLabel: 'Width based on trigger element',
            },
        ] as SurfaceWidthOption[];

        this.selectedSurfaceWidth = this.availableSurfaceWidths.find(
            (v) => v.value === 'inherit-from-items'
        );
    }

    public render() {
        return [
            <div class="is-resizable">
                <limel-menu
                    class="highlight-limel-menu"
                    items={this.items}
                    surfaceWidth={this.selectedSurfaceWidth?.value}
                >
                    <limel-button
                        slot="trigger"
                        label={this.selectedSurfaceWidth?.buttonLabel}
                    />
                </limel-menu>
            </div>,
            <limel-select
                class="is-narrow"
                label="surfaceWidth"
                options={this.availableSurfaceWidths}
                value={this.selectedSurfaceWidth}
                onChange={this.handleNewSelection}
            />,
        ];
    }

    private handleNewSelection = (
        event: LimelSelectCustomEvent<SurfaceWidthOption>
    ) => {
        this.selectedSurfaceWidth = event.detail;
    };
}
