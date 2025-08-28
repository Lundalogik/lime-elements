import { Component, h, Host, State } from '@stencil/core';

/**
 * Interactive list item example
 *
 * A list item with the default type (`type="listitem"`) shows a simpler
 * visual feedback when hovered. Once it is clicked, it emits an event
 * with details about the item.
 *
 * However, certain item `type`s are "selectable";
 * for instance `option`, `radio` and `checkbox`.
 * When users click them (or focus and press <kbd>Enter</kbd> or <kbd>Space</kbd>)
 * these items toggle their selection.
 *
 * A `selected` item will both visually indicate that it is selected
 * and also informs assistive technology about its state, using proper ARIA attributes.
 *
 * Each of these types visualize the selected state differently.
 *
 * - `option`: The selected state is indicated by a tinted background,
 * colored by the consumer's defined accent color.
 * - `radio`: The selected state is indicated by a filled circle.
 * - `checkbox`: The selected state is indicated by a checked checkmark.
 *
 * :::important
 * Needless to say that a `disabled` item cannot be selected or interacted with.
 * The component owns “disabled” interaction semantics and accessibility.
 * The consumer should not make the list item unclickable / uninteractive,
 * using some TS logics, or by adding a `pointer-events: none;` style.
 * This is because:
 * 1. The list items are interactive, both using mouse and keyboard.
 * 2. The list items can contain a primary component, or an action menu,
 * which need to remain interactive, even when the item is disabled.
 * :::
 */
@Component({
    tag: 'limel-example-list-item-interactive',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemInteractiveExample {
    @State()
    private disabled = false;

    @State()
    private selected = false;

    @State()
    private lastEvent: string = 'No events yet';

    public render() {
        return (
            <Host>
                <limel-list-item
                    tabindex={0}
                    text="Interactive List Item, with `type='option'`"
                    secondaryText="Click me (or press Enter/Space) if I'm not disabled"
                    icon="star"
                    disabled={this.disabled}
                    selected={this.selected}
                    type="option"
                    onInteract={this.onInteract}
                />
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
                </limel-example-controls>
                <limel-example-value
                    label="Last event"
                    value={this.lastEvent}
                />
            </Host>
        );
    }

    private onInteract = (event: CustomEvent) => {
        this.lastEvent = `Item clicked - Selected: ${event.detail.selected}`;
        this.selected = event.detail.selected;
        console.log('List item interacted:', event.detail);
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };

    private setSelected = (event: CustomEvent<boolean>) => {
        this.selected = event.detail;
    };
}
