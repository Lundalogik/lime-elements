import { Component, h } from '@stencil/core';
/**
 * Narrow headers
 * Sometimes your UI design may require having a narrower header.
 * This will be easy to achieve by sending in the class of `is-narrow`
 * to your component.
 *
 * This will render the header icon smaller, and reduces the font size of
 * the `heading`.
 *
 * :::tip
 * Keep in mind that headers are programmed to grow in height, depending
 * on their content. So if you have large custom components in the `actions`
 * slot or use both `heading` and `subheading`, they will still force the header
 * to appear tall.
 * :::
 *
 */
@Component({
    tag: 'limel-example-header-narrow',
    shadow: true,
    styleUrl: 'header-narrow.scss',
})
export class HeaderExample {
    public render() {
        return (
            <limel-header
                class="is-narrow"
                icon="ok"
                heading="This is a narrow header"
            />
        );
    }
}
