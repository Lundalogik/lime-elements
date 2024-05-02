import { Component, h } from '@stencil/core';
/**
 * Height of the editor
 *
 * The text editor automatically adjusts its own height to fit the content inside.
 * So as the user types, the editor will grow taller, potentially resizing its own
 * container element.
 *
 * However, you can constrain the text editor to never grow beyond a certain height,
 * by either
 * - setting a fixed `height` or `max-height` the component itself,
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
    tag: 'limel-example-text-editor-height',
    shadow: true,
    styleUrl: 'text-editor-height.scss',
})
export class TextEditorHeightExample {
    public render() {
        return <limel-text-editor />;
    }
}
