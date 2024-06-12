import { Component, h } from '@stencil/core';
/**
 * Resize with container
 * Sometimes, you may want to make the text editor to follow the size of its container,
 * both in width and height; for instance, when the container is resizable by the user.
 *
 * In such cases, make sure to set `allowResize={false}` on the component.
 *
 * However, you can still constrain the text editor to never grow beyond a certain height,
 * by either
 * - setting a fixed `height` or `max-height` the component itself, or using
 * `--text-editor-max-height` CSS variable;
 * - or alternatively by setting a fixed `height` or `max-height` on the container
 * element of the component.
 *
 * In this example, the maximum height is set to `15rem`, which means that:
 * 1. the editor will adjust itself to the content inside,
 * pushing out its container and making it taller, until it reaches `15rem` in height.
 * 1. and also when you manually resize the container,
 * the editor will try to fill the available surface area, until its height reaches `15rem`.
 */
@Component({
    tag: 'limel-example-text-editor-size',
    shadow: true,
    styleUrl: 'text-editor-size.scss',
})
export class TextEditorSizeExample {
    public render() {
        return <limel-text-editor allowResize={false} />;
    }
}
