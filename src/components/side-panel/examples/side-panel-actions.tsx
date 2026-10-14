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
 * The buttons on the right side of the toolbar come from `actions`. The panel
 * emits `selectAction` when one of them is clicked. The example shows which
 * one was clicked.
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

    private openPanel = () => {
        this.open = true;
    };

    private closePanel = () => {
        this.open = false;
    };

    private handleSelectAction = (
        event: CustomEvent<SidePanelActionSelect>
    ) => {
        this.selected = event.detail.id;
    };
}
