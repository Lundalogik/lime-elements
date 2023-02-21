import { Component, h } from '@stencil/core';

/**
 * Badge without a `label`
 * When no `label` is provided, the badge will only render as a circle.
 * This is a convention which is used in many applications to attract the
 * user's attention to a certain element on the user interface; typically to
 * menus or buttons that navigate the user to another pane or screen.
 *
 * In such cases, the idea is to provide the users with a "red thread"
 * and help them find something that requires their attention, but is located
 * on another place in the app, and not directly visible.
 *
 * :::tip
 * Make sure that the dot is noticeable, by providing an
 * eye-catching background color, as shown in this example.
 *:::
 */
@Component({
    tag: 'limel-example-badge',
    styleUrl: 'badge.scss',
    shadow: true,
})
export class BadgeExample {
    public render() {
        return [<limel-badge />];
    }
}
