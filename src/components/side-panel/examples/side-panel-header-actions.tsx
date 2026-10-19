import { MenuItem, SidePanelEntry } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const DEAL: SidePanelEntry = {
    heading: 'Big deal',
    subheading: 'Acme Inc.',
    icon: { name: 'money', color: 'rgb(var(--color-white))' },
    color: 'rgb(var(--color-indigo-default))',
};

const MENU_ITEMS: MenuItem[] = [
    { text: 'Copy link', icon: 'link' },
    { text: 'Delete', icon: 'trash' },
];

/**
 * Header actions
 *
 * Controls in the `header-actions` slot are shown at the right end of the
 * header. In this example, they are a follow button and a menu. When `stack`
 * is empty, there is no header, and the slot content is not shown.
 *
 * The slot is for small controls. It is at most half as wide as the header,
 * and at most as tall as the heading and subheading together. Larger content
 * is cut off, so that the header keeps its size.
 *
 * The slot content keeps its own colors. Here it uses
 * `--side-panel-header-text-color`, which is white when the header has a
 * `color`. It can also be used as the `color` of an `Icon`. Turn off the
 * color of the header to see the difference.
 *
 * The slot content is not tied to the entries in `stack`. When the last entry
 * changes, change the slot content too.
 */
@Component({
    tag: 'limel-example-side-panel-header-actions',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelHeaderActionsExample {
    @State()
    private open = false;

    @State()
    private colored = true;

    @State()
    private followed = false;

    public render() {
        return (
            <div class="page">
                <limel-button
                    primary
                    label="Open the panel"
                    onClick={this.openPanel}
                />
                <limel-switch
                    label="Color the header"
                    value={this.colored}
                    onChange={this.handleChangeColored}
                />
                {this.renderPanel()}
            </div>
        );
    }

    private renderPanel() {
        if (!this.open) {
            return;
        }

        return (
            <limel-side-panel
                stack={[this.getEntry()]}
                onClose={this.closePanel}
            >
                <button
                    slot="header-actions"
                    class="follow-button"
                    aria-pressed={this.followed ? 'true' : 'false'}
                    onClick={this.toggleFollowed}
                >
                    {this.followed ? 'Following' : 'Follow'}
                </button>
                <limel-menu slot="header-actions" items={MENU_ITEMS}>
                    <limel-icon-button
                        class="menu-trigger"
                        slot="trigger"
                        label="More options"
                        icon={{
                            name: 'menu_2',
                            color: 'var(--side-panel-header-text-color)',
                        }}
                    />
                </limel-menu>
                <p class="panel-content">The deal is shown here.</p>
            </limel-side-panel>
        );
    }

    private getEntry(): SidePanelEntry {
        if (this.colored) {
            return DEAL;
        }

        return { ...DEAL, icon: 'money', color: undefined };
    }

    private readonly openPanel = () => {
        this.open = true;
    };

    private readonly closePanel = () => {
        this.open = false;
    };

    private readonly handleChangeColored = (event: CustomEvent<boolean>) => {
        this.colored = event.detail;
    };

    private readonly toggleFollowed = () => {
        this.followed = !this.followed;
    };
}
