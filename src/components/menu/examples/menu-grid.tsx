import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * With grid layout
 * To render items of a menu in a grid layout instead of a vertical list,
 * simply setting the `gridLayout` property to `true`.
 *
 * :::note
 * Menus with the grid layout has a responsive width by default,
 * which will not grow wider than a certain size. However, if the default size is not
 * wide enough for your use case, you can try setting another responsive width, using
 * the `--menu-surface-width` variable.
 *
 * To achieve a responsive width, try using the `min()` function.
 * This function selects the smallest value from a list of comma-separated expressions
 * which are placed within the parentheses.
 *
 * For example, `--menu-surface-width: min(100vw, 40rem);` will output
 * `width: min(100wv, 40rem);` which will tell the browser to render the menu
 * content in a 40rem-wide grid, as long as 100% of the viewport's width (`100vw`)
 * is larger than `40rem`.
 * :::
 *
 *
 * To tweak the grid layout, a few other variables are available:
 * - `--list-grid-item-max-width`: Defines maximum width of items in the list, which defaults to `10rem`.
 * - `--list-grid-item-min-width`: Defines minimum width of items, which to `7.5rem`.
 * - `--list-grid-gap`: Defines the distance between the items, which defaults to `0.75rem`.
 *
 */
@Component({
    tag: 'limel-example-menu-grid',
    shadow: true,
    styleUrl: 'menu-grid.scss',
})
export class MenuGridExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Companies',
            icon: {
                name: 'organization',
                color: 'rgb(var(--color-blue-default)',
            },
        },
        {
            text: 'Deals',
            icon: {
                name: 'money',
                color: 'rgb(var(--color-green-default))',
            },
        },
        {
            text: 'Agreements',
            icon: {
                name: 'handshake',
                color: 'rgb(var(--color-pink-default))',
            },
        },
        {
            text: 'Todos',
            icon: {
                name: 'today',
                color: 'rgb(var(--color-teal-default))',
            },
        },
        {
            text: 'History',
            icon: {
                name: 'comments',
                color: 'rgb(var(--color-grey-light))',
            },
        },
        { separator: true },
        {
            text: 'Coworkers',
            icon: {
                name: 'gender_neutral_user',
                color: 'rgb(var(--color-orange-light))',
            },
        },
        {
            text: 'Persons',
            icon: {
                name: 'user_group_man_man',
                color: 'rgb(var(--color-yellow-dark)',
            },
        },
    ];

    public render() {
        return (
            <limel-menu items={this.items} badgeIcons={true} gridLayout={true}>
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>
        );
    }
}
