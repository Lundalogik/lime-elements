import { Component, Host, Prop, h } from '@stencil/core';

/**
 * Meta content for menu list items
 *
 * This sub-component is intended to be passed as `primaryComponent`
 * to `limel-list-item`, when it is used in the menu list.
 * It includes command text, badge, and chevron, which are the
 * features of menu list items.
 *
 * @private
 */
@Component({
    tag: 'limel-menu-item-meta',
    shadow: true,
    styleUrl: 'menu-item-meta.scss',
})
export class MenuItemMeta {
    /**
     * Use to display optional keyboard shortcut or command hint, e.g. `⌘ + K`
     */
    @Prop()
    public commandText?: string;

    /**
     * Optional badge value
     */
    @Prop()
    public badge?: string | number;

    /**
     * Shows a submenu chevron to indicate nested items
     */
    @Prop()
    public showChevron = false;

    public render() {
        return (
            <Host>
                {this.renderCommandText()}
                {this.renderBadge()}
                {this.renderChevron()}
            </Host>
        );
    }

    private renderCommandText() {
        if (!this.commandText) {
            return;
        }

        return <span class="command-text">{this.commandText}</span>;
    }

    private renderBadge() {
        if (this.badge === undefined) {
            return;
        }

        return <limel-badge label={String(this.badge)} />;
    }

    private renderChevron() {
        if (!this.showChevron) {
            return;
        }

        return <div class="chevron" aria-hidden="true" />;
    }
}
