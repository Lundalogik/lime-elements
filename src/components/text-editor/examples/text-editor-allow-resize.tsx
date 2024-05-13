import { Component, h, State } from '@stencil/core';
/**
 * Allow resize
 * The text editor automatically adjusts its own height to fit the content inside.
 * So as the user types, the editor will grow taller, potentially resizing its own
 * container element.
 *
 * By default, the user can also manually change the height of the text editor
 * by dragging its bottom right corner.
 *
 * As soon as the user has changed the height, this will override the automatic
 * resizing, and the editor will no longer adjust its height to fit the content inside.
 *
 * By setting `allowResize` to `false`, you can disable the end user
 * to resize the text editor vertically.
 *
 * :::tip
 * Using `max-height` and `min-height` CSS properties, you can limit the
 * resizing to a specific range.
 * :::
 */
@Component({
    tag: 'limel-example-text-editor-allow-resize',
    shadow: true,
    styleUrl: 'text-editor-allow-resize.scss',
})
export class TextEditorAllowResizeExample {
    @State()
    private value: string;

    @State()
    private allowResize = true;

    public render() {
        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                allowResize={this.allowResize}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.allowResize}
                    label="Allow resize"
                    onChange={this.setAllowResize}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private setAllowResize = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.allowResize = event.detail;
    };

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };
}
