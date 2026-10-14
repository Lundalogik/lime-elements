import { Component, h, State } from '@stencil/core';

const MIN_WIDTH = 120;
const MAX_WIDTH = 360;

/**
 * Basic example
 *
 * The handle does not resize the panel. It emits `changeSize` with the width
 * that the user asks for, while the user drags the handle, and when the user
 * presses <kbd>←</kbd> or <kbd>→</kbd> while the handle has focus. It emits
 * `endResize` when the user has finished: when the pointer is released, and
 * after each arrow key press.
 *
 * The example limits the width, sets it on the panel, and gives it back to the
 * handle as `value`, together with `min` and `max`. The events that the handle
 * emits are printed below the panel.
 */
@Component({
    tag: 'limel-example-resize-handle-basic',
    shadow: true,
    styleUrl: 'resize-handle-basic.scss',
})
export class ResizeHandleBasicExample {
    @State()
    private width = 200;

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public render() {
        return [
            <section>
                <aside style={{ width: `${this.width}px` }}>
                    <limel-resize-handle
                        label="Resize the panel"
                        location="left"
                        value={this.width}
                        min={MIN_WIDTH}
                        max={MAX_WIDTH}
                        onChangeSize={this.handleChangeSize}
                        onEndResize={this.handleEndResize}
                    />
                    <p>The panel is {this.width}px wide.</p>
                </aside>
            </section>,
            <limel-example-event-printer
                ref={(element) => (this.eventPrinter = element)}
            />,
        ];
    }

    private handleChangeSize = (event: CustomEvent<number>) => {
        const width = Math.min(Math.max(event.detail, MIN_WIDTH), MAX_WIDTH);
        this.width = Math.round(width);

        this.eventPrinter.writeEvent(event);
    };

    private handleEndResize = (event: CustomEvent<void>) => {
        this.eventPrinter.writeEvent(event);
    };
}
