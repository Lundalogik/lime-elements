import { Component, Host, Prop, h } from '@stencil/core';
import { normalizeHotkeyString } from '../../../util/hotkeys';
import { ListComponent } from '../list-item.types';

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
    @Prop({ reflect: true })
    public commandText?: string;

    /**
     * Hotkey to display. When provided, `commandText` is ignored.
     */
    @Prop({ reflect: true })
    public hotkey?: string;

    /**
     * Will be set to `true` when the menu item is disabled.
     */
    @Prop({ reflect: true })
    public disabled = false;

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

    /**
     * Optional primary component to render before other meta content
     */
    @Prop()
    public primaryComponent?: ListComponent;

    public render() {
        return (
            <Host>
                {this.renderPrimaryComponent()}
                {this.renderCommandText()}
                {this.renderBadge()}
                {this.renderChevron()}
            </Host>
        );
    }

    private renderCommandText() {
        if (this.hotkey) {
            const hotkey = normalizeHotkeyString(this.hotkey);
            if (hotkey) {
                return <limel-hotkey value={hotkey} disabled={this.disabled} />;
            }
        }

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

    private renderPrimaryComponent() {
        const primary = this.primaryComponent;
        if (!primary?.name) {
            return;
        }

        const PrimaryComponent: any = primary.name;
        const props = primary.props || {};

        return <PrimaryComponent {...props} disabled={this.disabled} />;
    }

    private renderChevron() {
        if (!this.showChevron) {
            return;
        }

        return <div class="chevron" aria-hidden="true" />;
    }
}
