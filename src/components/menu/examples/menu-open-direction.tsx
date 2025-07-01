import {
    MenuItem,
    ListSeparator,
    OpenDirection,
    Option,
    LimelSelectCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * openDirection
 *
 * The value of the `openDirection` property defines how the menu content
 * is aligned with its trigger element, and in which direction it opens.
 */
@Component({
    tag: 'limel-example-menu-open-direction',
    shadow: true,
    styleUrl: 'menu-open-direction.scss',
})
export class MenuOpenDirectionExample {
    @State()
    private selectedOpenDirection: Option<OpenDirection>;

    private availableOpenDirections: Array<Option<OpenDirection>>;

    private items: Array<MenuItem | ListSeparator> = [
        { text: 'Copy' },
        { text: 'Cut' },
        { separator: true },
        { text: 'Paste' },
    ];

    constructor() {
        const openDirections: OpenDirection[] = [
            'left-start',
            'left',
            'left-end',
            'right-start',
            'right',
            'right-end',
            'top-start',
            'top',
            'top-end',
            'bottom-start',
            'bottom',
            'bottom-end',
        ];
        this.availableOpenDirections = openDirections.map((value) => {
            return {
                text: value as string,
                value: value,
            } as Option<OpenDirection>;
        });
        this.selectedOpenDirection = this.availableOpenDirections.find(
            (v) => v.value === 'bottom-start'
        );
    }

    public render() {
        return [
            <limel-menu
                items={this.items}
                openDirection={this.selectedOpenDirection?.value}
            >
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-select
                class="is-narrow"
                label="openDirection"
                options={this.availableOpenDirections}
                value={this.selectedOpenDirection}
                onChange={this.handleNewSelection}
            />,
        ];
    }

    private handleNewSelection = (
        event: LimelSelectCustomEvent<Option<OpenDirection>>
    ) => {
        this.selectedOpenDirection = event.detail;
    };
}
