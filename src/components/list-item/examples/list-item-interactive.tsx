import { Component, h, Host, State } from '@stencil/core';

/**
 * Interactive list item example
 *
 * A list item with the default type (`type="listitem"`) shows a simpler
 * visual feedback when hovered.
 *
 * However, certain item `type`s are "selectable"; for instance `option`, `radio` and `checkbox`.
 * When users click them (or focus and press <kbd>Enter</kbd> or <kbd>Space</kbd>)
 * these items must toggle their selection.
 *
 * This example demonstrates manual selection handling. Note that
 * `limel-list-item` does not emit its own `interact` event. The consumer
 * should listen for native `click` events and handle keyboard events.
 *
 * The component is purely presentational; selection state is passed in
 * via the `selected` prop and updated by the parent example using
 * native `click` and keyboard events.
 *
 * Item `type`s that are "selectable" (`option`, `radio`, `checkbox`)
 * are expected to be managed by a container component like `limel-list`.
 * For standalone demo purposes we toggle `selected` ourselves.
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
            <Host onKeyDown={this.onHostKeyDown}>
                <limel-list-item
                    tabindex={0}
                    text="Interactive List Item, with `type='option'`"
                    secondaryText="Click me (or press Enter/Space) if I'm not disabled"
                    icon="star"
                    disabled={this.disabled}
                    selected={this.selected}
                    type="option"
                    onClick={this.onItemClick}
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

    private toggleSelection = () => {
        if (this.disabled) {
            return;
        }
        this.selected = !this.selected;
        this.lastEvent = `Item ${this.selected ? 'selected' : 'deselected'}`;
    };

    private onItemClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
            target.closest('.action-menu-trigger') ||
            target.closest('limel-menu')
        ) {
            return; // ignore action menu clicks
        }
        this.toggleSelection();
    };

    private onHostKeyDown = (event: KeyboardEvent) => {
        if (this.disabled) {
            return;
        }
        const isEnter = event.key === 'Enter';
        const isSpace =
            event.key === ' ' ||
            event.key === 'Space' ||
            event.key === 'Spacebar' ||
            event.code === 'Space';
        if (!isEnter && !isSpace) {
            return;
        }
        if (event.repeat) {
            return;
        }
        if (isSpace) {
            event.preventDefault();
        }
        // Ensure the focused element is our list item before toggling
        const active = document.activeElement as HTMLElement | null;
        if (active && active.tagName.toLowerCase() === 'limel-list-item') {
            this.toggleSelection();
        }
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        this.disabled = event.detail;
    };

    private setSelected = (event: CustomEvent<boolean>) => {
        this.selected = event.detail;
    };
}
