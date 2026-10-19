import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 *
 * The panel is positioned relative to its nearest positioned ancestor, which
 * has `position: relative` in this example.
 *
 * The panel is a dialog that does not block the rest of the page. Set `label`
 * to give it an accessible name, which screen readers announce. When the panel
 * opens, focus moves into it. When the panel is removed, focus returns to the
 * element that had it before, unless focus is somewhere else by then.
 *
 * The panel emits `close` when the close button is clicked or Escape is
 * pressed. The panel does not remove itself. In this example, the page removes
 * it when it gets the event.
 *
 * The panel starts with the width from `--side-panel-width`. You can resize it
 * by dragging its left edge. You can also focus the edge and use the arrow
 * keys: <kbd>←</kbd> makes the panel wider, and <kbd>→</kbd> makes it narrower.
 * The width is limited by `--side-panel-min-width` and by the space that is
 * available.
 *
 * The panel keeps the new width itself. As long as the panel exists, the new
 * width wins over `--side-panel-width`. When you let go of the edge, or press an
 * arrow key, the panel emits `changeWidth` with the new width in pixels. It
 * does not emit the event when the width did not change. You do not have to
 * handle the event. Store the width if the panel should open with the same
 * width next time, for example across sessions. Then set it with
 * `--side-panel-width` before the panel opens.
 *
 * `close` and `changeWidth` events from the content inside the panel do not
 * propagate past the panel. This stops you from mistaking them for events from
 * the panel.
 *
 * In this example, you can drag the left edge of the panel to resize it. The
 * example saves the width from the `changeWidth` event. Close the panel and
 * open it again: the example sets the saved width with `--side-panel-width`, so
 * the panel opens with the same width.
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
                label="Edit the list"
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
