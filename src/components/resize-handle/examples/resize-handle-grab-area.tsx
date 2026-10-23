import { Component, h, State } from '@stencil/core';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 200;

/**
 * Larger grab area
 *
 * A handle at the top or the bottom can have a larger grab area, which is
 * easier to hit with a finger. Set the size of the grab area with
 * `--limel-resize-handle-thickness`, and the length of the visible strip with
 * `--limel-resize-handle-visual-length`. The grab area grows away from the
 * edge, and the visible strip stays at the edge.
 *
 * The background of the handle in this example shows the grab area.
 */
@Component({
    tag: 'limel-example-resize-handle-grab-area',
    shadow: true,
    styleUrl: 'resize-handle-grab-area.scss',
})
export class ResizeHandleGrabAreaExample {
    @State()
    private height = 120;

    public render() {
        return (
            <section style={{ height: `${this.height}px` }}>
                <limel-resize-handle
                    resizableRegionLabel="sheet"
                    location="top"
                    value={this.height}
                    min={MIN_HEIGHT}
                    max={MAX_HEIGHT}
                    onChangeSize={this.handleChangeSize}
                />
                <p>The sheet is {this.height}px high.</p>
            </section>
        );
    }

    private handleChangeSize = (event: CustomEvent<number>) => {
        const height = Math.min(Math.max(event.detail, MIN_HEIGHT), MAX_HEIGHT);
        this.height = Math.round(height);
    };
}
