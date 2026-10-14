import { SidePanelEntry } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const PANELS: SidePanelEntry[] = [
    {
        heading: 'Start page',
        subheading: 'Page',
        icon: { name: 'home', color: 'rgb(var(--color-white))' },
        color: 'rgb(var(--color-blue-default))',
    },
    {
        heading: 'Sales pipe',
        subheading: 'Widget on the start page',
        icon: { name: 'sales_performance', color: 'rgb(var(--color-white))' },
        color: 'rgb(var(--color-teal-default))',
    },
    {
        heading: 'Rules',
        subheading: '3 rules',
        icon: { name: 'filter', color: 'rgb(var(--color-white))' },
        color: 'rgb(var(--color-purple-default))',
    },
];

/**
 * Stacking
 *
 * Open a panel from inside the panel to make a stack. The last entry of
 * `stack` is the panel that is shown. The other entries are shown as backs
 * behind its left edge. Point at a back to see its heading.
 *
 * Click a back to go back to it. The panel emits `selectStackEntry` with the
 * index of the entry in `stack`, and the example removes all entries after it.
 *
 * In this example, `close` goes back one step. Another application could close
 * all panels instead.
 */
@Component({
    tag: 'limel-example-side-panel-stacking',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelStackingExample {
    @State()
    private depth = 0;

    public render() {
        return (
            <div class="page">
                <limel-button
                    primary
                    label="Open the start page"
                    onClick={this.openFirstPanel}
                />
                <p>Open a panel from inside the panel to make a stack.</p>
                {this.renderPanel()}
            </div>
        );
    }

    private renderPanel() {
        if (this.depth === 0) {
            return;
        }

        return (
            <limel-side-panel
                stack={PANELS.slice(0, this.depth)}
                onClose={this.closePanel}
                onSelectStackEntry={this.handleSelectStackEntry}
            >
                <div class="panel-content">{this.renderOpenNext()}</div>
            </limel-side-panel>
        );
    }

    private renderOpenNext() {
        const next = PANELS[this.depth];
        if (!next) {
            return <p>No more panels to open.</p>;
        }

        return (
            <limel-button
                label={`Open ${next.heading}`}
                onClick={this.openNextPanel}
            />
        );
    }

    private openFirstPanel = () => {
        this.depth = 1;
    };

    private openNextPanel = () => {
        this.depth += 1;
    };

    private closePanel = () => {
        this.depth -= 1;
    };

    private handleSelectStackEntry = (event: CustomEvent<number>) => {
        this.depth = event.detail + 1;
    };
}
