import { Component, h, State } from '@stencil/core';

/**
 * Interactive list item example
 *
 * This example demonstrates the interactive features of the `limel-list-item` component
 * including selectable, selected, and disabled states.
 *
 * A list item shows a visual feedback when hovered.
 * Once clicked, it emits an event with details about the item.
 *
 * However, only when the the item is `selectable` a user can click on it
 * (or focus and press the Enter or Space key) to make it selected.
 *
 * A `selected` item will both visually indicate that it is selected
 * and also informs assistive technology about its state.
 *
 * Needless to say that a `disabled` item cannot be selected or interacted with.
 */
@Component({
    tag: 'limel-example-list-item-interactive',
    shadow: true,
    styleUrl: 'list-item-interactive.scss',
})
export class ListItemInteractiveExample {
    @State()
    private disabled = false;

    @State()
    private selected = false;

    @State()
    private selectable = true;

    @State()
    private lastEvent: string = 'No events yet';

    public render() {
        return [
            <limel-list-item
                text="Interactive List Item"
                secondaryText="Click me if I'm not disabled and selectable"
                icon="star"
                disabled={this.disabled}
                selected={this.selected}
                selectable={this.selectable}
                onInteract={this.onInteract}
            />,
            <limel-example-controls>
                <limel-switch
                    label="Disabled"
                    value={this.disabled}
                    onChange={this.setDisabled}
                />
                <limel-switch
                    label="Selected"
                    value={this.selected}
                    onChange={this.setSelected}
                />
                <limel-switch
                    label="Selectable"
                    value={this.selectable}
                    onChange={this.setSelectable}
                />
            </limel-example-controls>,
            <limel-example-value label="Last event" value={this.lastEvent} />,
        ];
    }

    private onInteract = (event: CustomEvent) => {
        this.lastEvent = `Item clicked - Selected: ${event.detail.selected}`;
        this.selected = event.detail.selected; // Update the state to reflect the new selection
        console.log('List item interacted:', event.detail);
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };

    private setSelected = (event: CustomEvent<boolean>) => {
        this.selected = event.detail;
    };

    private setSelectable = (event: CustomEvent<boolean>) => {
        this.selectable = event.detail;
    };
}
