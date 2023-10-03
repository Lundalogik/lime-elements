import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { ListSeparator, MenuItem } from '../../interface';

/**
 * A split button is a button with two components:
 * a button and a side-menu attached to it.
 *
 * Clicking on the button runs a default action,
 * and clicking on the arrow opens up a list of other possible actions.
 *
 * :::warning
 * - Never use a split button for navigation purposes, such as going to next page.
 * The button should only be used for performing commands!
 * - Never use this component instead of a Select or Menu component!
 * :::
 * @exampleComponent limel-example-split-button-basic
 * @exampleComponent limel-example-split-button-repeat-default-command
 */
@Component({
    tag: 'limel-split-button',
    styleUrl: 'split-button.scss',
    shadow: true,
})
export class SplitButton {
    /**
     * The text to show on the default action part of the button.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Set to `true` to make the button primary.
     */
    @Prop({ reflect: true })
    public primary = false;

    /**
     * Set icon for the button
     */
    @Prop({ reflect: true })
    public icon: string;

    /**
     * Set to `true` to disable the button.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * A list of items and separators to show in the menu.
     */
    @Prop()
    public items: Array<MenuItem | ListSeparator> = [];

    /**
     * Is emitted when a menu item is selected.
     */
    @Event()
    public select: EventEmitter<MenuItem>;

    render() {
        return (
            <Host
                class={{
                    'has-menu': !!this.items.length,
                }}
            >
                <limel-button
                    label={this.label}
                    primary={this.primary}
                    icon={this.icon}
                    disabled={this.disabled}
                />
                {this.renderMenu()}
            </Host>
        );
    }

    private renderMenu = () => {
        if (!this.items.length) {
            return;
        }

        return (
            <limel-menu
                class={{
                    primary: this.primary,
                }}
                disabled={this.disabled}
                items={this.items}
                openDirection="bottom"
            >
                <button
                    class="menu-trigger"
                    slot="trigger"
                    disabled={this.disabled}
                >
                    ⋮
                </button>
            </limel-menu>
        );
    };
}
