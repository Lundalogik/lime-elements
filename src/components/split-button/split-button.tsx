import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { ListSeparator } from '../list/list-item.types';
import { MenuItem } from '../menu/menu.types';

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
 *
 * @exampleComponent limel-example-split-button-basic
 * @exampleComponent limel-example-split-button-loading
 * @exampleComponent limel-example-split-button-repeat-default-command
 */
@Component({
    tag: 'limel-split-button',
    shadow: { delegatesFocus: true },
    styleUrl: 'split-button.scss',
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
     * Set to `true` to put the button in the `loading` state.
     * This also disables the button.
     */
    @Prop({ reflect: true })
    public loading = false;

    /**
     * Set to `true` to indicate failure instead of success when the button is
     * no longer in the `loading` state.
     */
    @Prop({ reflect: true })
    public loadingFailed = false;

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
                onClick={this.filterClickWhenDisabled}
            >
                <limel-button
                    label={this.label}
                    primary={this.primary}
                    icon={this.icon}
                    disabled={this.disabled}
                    loading={this.loading}
                    loadingFailed={this.loadingFailed}
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
                disabled={this.disabled || this.loading}
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

    private filterClickWhenDisabled = (e) => {
        if (this.disabled) {
            e.preventDefault();
        }
    };
}
