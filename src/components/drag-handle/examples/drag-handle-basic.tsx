import { Component, h, Host } from '@stencil/core';
/**
 * Basic example
 * The component is designed to be working both by mouse, pointer devices, and touch.
 */
@Component({
    shadow: true,
    tag: 'limel-example-drag-handle-basic',
    styleUrl: 'drag-handle-basic.scss',
})
export class DragHandleBasicExample {
    public render() {
        return (
            <Host>
                <limel-drag-handle dragDirection="vertical" />
                <limel-drag-handle dragDirection="horizontal" />
            </Host>
        );
    }
}
