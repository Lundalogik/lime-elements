import { Component, h } from '@stencil/core';

/**
 * When the helper line is empty
 *
 * When the component has no content, for example when there is no
 * `helperTex`t or no character counter, the component will get a `display: none`
 * as style, to avoid creating empty holes in the UI of the consumer component.
 *
 * This is important for example in a `flex` or `grid` component that has a `gap`
 * between its children. If so, we don't want the empty
 * `limel-helper-line` to get rendered and cause unnecessary gaps in the UI.
 */
@Component({
    tag: 'limel-example-helper-line-empty',
    shadow: true,
    styleUrl: 'helper-line-empty.scss',
})
export class HelperLineEmptyExample {
    public render() {
        return [
            <span>This is a flex container with gaps between flex items.</span>,
            <span>There is a helper line here 👇</span>,
            <limel-helper-line helperTextId="tf-helper-text" />,
            <span>but it won't show up, since it is empty.</span>,
        ];
    }
}
