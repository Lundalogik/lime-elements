import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 *
 * The panel is positioned relative to its nearest positioned ancestor, which
 * has `position: relative` in this example.
 *
 * The panel emits `close` when the close button is clicked or Escape is
 * pressed. The example then removes the panel.
 *
 * Drag the left edge of the panel to resize it. The panel keeps the new width
 * itself, and emits `changeWidth`. The example saves the width from the event.
 * Close the panel and open it again: the example sets the saved width with
 * `--side-panel-width`, so the panel opens with the same width.
 */
@Component({
    tag: 'limel-example-side-panel-basic',
    shadow: true,
    styleUrl: 'side-panel-example.scss',
})
export class SidePanelBasicExample {
    @State()
    private open = false;

    @State()
    private width?: number;

    public render() {
        return (
            <div class="page">
                <limel-button
                    primary
                    label="Open the panel"
                    onClick={this.openPanel}
                />
                <p>The panel is displayed on top of this content.</p>
                <p>{this.describeSavedWidth()}</p>
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
                style={this.getPanelStyle()}
                onClose={this.closePanel}
                onChangeWidth={this.handleChangeWidth}
            >
                <div class="panel-content">
                    <limel-input-field label="Title" value="Sales pipe" />
                    <limel-input-field label="Rows" value="10" type="number" />
                </div>
            </limel-side-panel>
        );
    }

    private describeSavedWidth(): string {
        if (this.width === undefined) {
            return 'No width is saved yet.';
        }

        return `Saved width: ${Math.round(this.width)}px`;
    }

    private getPanelStyle(): Record<string, string> {
        if (this.width === undefined) {
            return {};
        }

        return { '--side-panel-width': `${this.width}px` };
    }

    private openPanel = () => {
        this.open = true;
    };

    private closePanel = () => {
        this.open = false;
    };

    private handleChangeWidth = (event: CustomEvent<number>) => {
        this.width = event.detail;
    };
}
