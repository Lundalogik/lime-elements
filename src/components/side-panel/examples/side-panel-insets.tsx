import { Component, h, State } from '@stencil/core';

/**
 * Keeping parts of the page visible
 *
 * By default, the panel covers the full height of its positioned ancestor,
 * along the right edge. Use `--side-panel-top-inset`, `--side-panel-right-inset`
 * and `--side-panel-bottom-inset` to keep parts of that element visible.
 * You can set them on the panel or on any ancestor.
 *
 * In this example, the insets keep the header and the dock visible while the
 * panel is open.
 */
@Component({
    tag: 'limel-example-side-panel-insets',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelInsetsExample {
    @State()
    private open = false;

    public render() {
        return (
            <div class="page has-header-and-dock">
                <header class="header">Header</header>
                <nav class="dock">Dock</nav>
                <div class="main">
                    <limel-button
                        primary
                        label="Open the panel"
                        onClick={this.openPanel}
                    />
                </div>
                {this.renderPanel()}
            </div>
        );
    }

    private renderPanel() {
        if (!this.open) {
            return;
        }

        return (
            <limel-side-panel label="Edit the list" onClose={this.closePanel}>
                <div class="panel-content">
                    <limel-input-field label="Title" value="Sales pipe" />
                </div>
            </limel-side-panel>
        );
    }

    private openPanel = () => {
        this.open = true;
    };

    private closePanel = () => {
        this.open = false;
    };
}
