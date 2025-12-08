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
 * 1. The text editor makes sure that it never becomes taller than the viewport's height.
 * This way, its toolbar and resize control will remain reasonably visible, when
 * the component is auto resizing itself based on the content it holds.
 * This behavior is controlled by the `--text-editor-max-height` CSS variable,
 * which defaults to `calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)) - 4rem)`,
 * taking also into account the safe zones which are defined by the environment variables.
 *
 * 1. Using `max-height` and `min-height` CSS properties on the component itself,
 * (or using `--text-editor-max-height`), you can limit the resizing to a specific range.
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
                <limel-switch
                    value={this.allowResize}
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
