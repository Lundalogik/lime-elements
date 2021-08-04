import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * With grid layout
 * To render items of a menu in a gird layout instead of a vertical list,
 * two things are required:
 * 1. Simply setting the `gridLayout` property to `true`, and
 * 1. Specifying a proper width for the menu surface, using the
 * `--menu-surface-width` variable.
 *
 * :::note
 * Do not forget that menus should behave responsively, thus using a fixed `width`
 * should be avoided. To make the width responsive, try using the `min()` function.
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
    private items: Array<ListItem | ListSeparator> = [
        {
            text: 'Companies',
            icon: 'organization',
            iconColor: 'rgb(var(--color-blue-default)',
        },
        {
            text: 'Deals',
            icon: 'money',
            iconColor: 'rgb(var(--color-green-default))',
        },
        {
            text: 'Agreements',
            icon: 'handshake',
            iconColor: 'rgb(var(--color-pink-default))',
        },
        {
            text: 'Todos',
            icon: 'today',
            iconColor: 'rgb(var(--color-teal-default))',
        },
        {
            text: 'History',
            icon: 'comments',
            iconColor: 'rgb(var(--color-grey-light))',
        },
        { separator: true },
        {
            text: 'Coworkers',
            icon: 'gender_neutral_user',
            iconColor: 'rgb(var(--color-orange-light))',
        },
        {
            text: 'Persons',
            icon: 'user_group_man_man',
            iconColor: 'rgb(var(--color-yellow-dark)',
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
