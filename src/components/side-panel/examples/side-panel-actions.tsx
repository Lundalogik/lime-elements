import {
    SidePanelAction,
    SidePanelActionSelect,
    SidePanelEntry,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const SALES_PIPE: SidePanelEntry = {
    heading: 'Sales pipe',
    subheading: 'Widget on the start page',
    icon: { name: 'sales_performance', color: 'rgb(var(--color-white))' },
    color: 'rgb(var(--color-teal-default))',
};

const ACTIONS: SidePanelAction[] = [
    { type: 'expand', label: 'Expand' },
    {
        type: 'newTab',
        label: 'Open in a new tab',
        helperLabel: 'Sales pipe',
        href: 'https://lundalogik.github.io/lime-elements/',
    },
];

/**
 * Header and actions
 *
 * The header shows the last entry of `stack`. The `color` of the entry is the
 * background color of the header.
 *
 * The toolbar has a close button on the left. The buttons on the right side
 * come from `actions`. The `type` of an action decides its icon. The panel
 * emits `selectAction` with the `id` of the action and the click event when
 * one of them is clicked. You decide what the action does. The example shows
 * which one was clicked.
 *
 * An action with an `href` is a link, so the user can open it in a new tab.
 * To handle the navigation in another way, for example with the router of the
 * application, call `preventDefault` on the click event in `selectAction`. Do
 * this only for a plain click with the primary button. Let the browser handle
 * all other clicks, so that Ctrl-click and Cmd-click still open the link in a
 * new tab:
 *
 * ```ts
 * function handleSelectAction(event: CustomEvent<SidePanelActionSelect>) {
 *     const click = event.detail.event;
 *     const isPlainClick =
 *         click.button === 0 &&
 *         !click.metaKey &&
 *         !click.ctrlKey &&
 *         !click.shiftKey &&
 *         !click.altKey;
 *     if (!isPlainClick) {
 *         return;
 *     }
 *
 *     click.preventDefault();
 *     router.navigate(event.detail.id);
 * }
 * ```
 *
 * The second action has an `href`, so it is a link. Try to open it in a new
 * tab with the context menu.
 */
@Component({
    tag: 'limel-example-side-panel-actions',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelActionsExample {
    @State()
    private open = false;

    @State()
    private selected?: string;

    public render() {
        return (
            <div class="page">
                <limel-button
                    primary
                    label="Open the panel"
                    onClick={this.openPanel}
                />
                <p>{this.describeSelected()}</p>
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
                stack={[SALES_PIPE]}
                actions={ACTIONS}
                onSelectAction={this.handleSelectAction}
                onClose={this.closePanel}
            >
                <p class="panel-content">Click a button in the toolbar.</p>
            </limel-side-panel>
        );
    }

    private describeSelected(): string {
        if (!this.selected) {
            return 'No action was clicked yet.';
        }

        return `Last clicked action: ${this.selected}`;
    }

    private readonly openPanel = () => {
        this.open = true;
    };

    private readonly closePanel = () => {
        this.open = false;
    };

    private readonly handleSelectAction = (
        event: CustomEvent<SidePanelActionSelect>
    ) => {
        this.selected = event.detail.id;
    };
}
