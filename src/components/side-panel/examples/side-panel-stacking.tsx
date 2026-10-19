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
 * A panel can open another panel, for example to edit a part of what the first
 * panel shows. Only one panel is shown at a time. The other panels are shown as
 * backs behind the left edge of the panel, so the user can go back to them.
 *
 * Each entry in `stack` is one panel, outermost first. The last entry is the
 * panel that is shown, and the other entries are the backs. To open a panel,
 * add an entry at the end of `stack`, and change the content. A back is too
 * narrow for text, so it only shows the `color` of its entry. Point at a back
 * to see its heading and subheading in a tooltip.
 *
 * Click a back to go back to it. The panel emits `selectStackEntry` with the
 * index of the entry in `stack`. To go back to that panel, remove all entries
 * after it, and change the content. The example does this.
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

    private readonly openFirstPanel = () => {
        this.depth = 1;
    };

    private readonly openNextPanel = () => {
        this.depth += 1;
    };

    private readonly closePanel = () => {
        this.depth -= 1;
    };

    private readonly handleSelectStackEntry = (event: CustomEvent<number>) => {
        this.depth = event.detail + 1;
    };
}
