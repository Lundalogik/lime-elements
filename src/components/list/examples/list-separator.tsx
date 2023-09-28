import { ListItem, ListSeparator } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * List with separators
 *
 * Separators are simple yet powerful design elements that can be
 * employed in lists of items. They offer significant usability advantages
 * by providing valuable visual cues that aid users in perceiving
 * and navigating through lists.
 *
 * - **Grouping and Hierarchy:**
 * Separators can be used to group related items, signaling to users that
 * those items share a common attribute or purpose.
 * This grouping effect aids in creating a hierarchical structure within the list,
 * making it simpler for users to grasp relationships and make informed decisions.
 * - **Visual Scannability:**
 * When users quickly scan a list, their eyes naturally use the separator lines
 * as visual anchors, making it easier to find items and remember their whereabouts
 * next time they revisit the same list.
 * - **Reduced Cognitive Effort:**
 * Separators contribute to a user's overall comprehension and experience
 * by reducing the cognitive effort required to process the information.
 *
 * You can optionally add a short title to the separators,
 * to clarify further what each group of items is about,
 * and by doing so improve the users perception and experience.
 */
@Component({
    tag: 'limel-example-list-separator',
    shadow: true,
})
export class ListSeparatorExample {
    private items: Array<ListItem<number> | ListSeparator> = [
        { separator: true, text: 'Unread emails' },
        {
            text: 'Kerry Anderson',
            secondaryText: 'Picture from last Saturday',
            value: 1,
        },
        {
            text: 'Regis, Peter, and Rachel',
            secondaryText: 'Board game night?',
            value: 2,
        },
        {
            text: 'Aruna Knight',
            secondaryText: 'The book you recommended',
            value: 3,
        },
        { separator: true, text: 'Everything else' },
        {
            text: 'Ara Azadi',
            secondaryText: 'Oops… Need to reschedule',
            value: 4,
        },
        {
            text: 'Anissa Lee',
            secondaryText: 'Furniture we no longer need',
            value: 5,
        },
        {
            text: 'Gustaf Lundberg',
            secondaryText: 'Re: Job Interview',
            value: 6,
        },
        {
            text: 'Separator without a title',
            secondaryText: 'Next item is a separator without a title',
            value: 7,
        },
        { separator: true },
        {
            text: 'Separator should not be last',
            secondaryText: 'Never put a separator as the last list item',
            value: 7,
        },
    ];

    public render() {
        return <limel-list items={this.items} />;
    }
}
