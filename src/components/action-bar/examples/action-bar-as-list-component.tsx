import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * Creative usage
 * Since the action bar can automatically overflow actions which do not
 * fit into the available width, it makes the component a good candidate
 * for providing contextual actions within small sections of a user interface.
 *
 * For such cases, setting a `max-width` on the action bar component
 * would be necessary.
 *
 * :::important
 * For this specific usage (`limel-action-bar` as a primary component in `limel-list`)
 * the certain styles are required for the overflow menu to properly work.
 * See the linked CSS file!
 *
 * In this context, the overflow menu cannot render, if the declared width
 * of the component is relative, for instance `40%`.
 * A relative width can trigger infinite re-rendering of the action bar
 * in certain widths (depending on the width of the action items).
 * The declared `5rem` here ensures that there is space for the long first item
 * as well as the overflow menu.
 * :::
 * @link action-bar-in-list.tsx
 * @link action-bar-in-list.scss
 */
@Component({
    tag: 'limel-example-action-bar-as-primary-component',
    shadow: true,
})
export class ActionBarAsListComponent {
    private items: Array<ListItem<number>> = [
        {
            text: 'Follow up quote · Cool Hotels',
            secondaryText: 'My to-dos · Today',
            icon: 'tear_off_calendar',
            value: 1,
            primaryComponent: {
                name: 'limel-example-action-bar-in-list',
            },
        },
        {
            text: 'Customer visit · Cool Hotels',
            secondaryText: 'My to-dos · Next monday',
            icon: 'tear_off_calendar',
            value: 2,
            primaryComponent: {
                name: 'limel-example-action-bar-in-list',
            },
        },
        {
            text: 'Sales call · Nice Stuff Agency',
            secondaryText: 'Unassigned · 2023-06-01',
            icon: 'tear_off_calendar',
            value: 3,
            primaryComponent: {
                name: 'limel-example-action-bar-in-list',
            },
        },
        {
            text: 'Sales call · Lime Technologies',
            secondaryText: 'Unassigned · 2023-06-02',
            icon: 'tear_off_calendar',
            value: 4,
            primaryComponent: {
                name: 'limel-example-action-bar-in-list',
            },
        },
    ];

    public render() {
        return [
            <h3>To-dos</h3>,
            <limel-list items={this.items} class="has-striped-rows" />,
        ];
    }
}
