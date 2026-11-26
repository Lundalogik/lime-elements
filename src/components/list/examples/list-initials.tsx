import { ListItem } from '@limetech/lime-elements';
import { Component, h } from '@stencil/core';

/**
 * List with initials
 *
 * Not every item has a picture. A contact may never have uploaded one, and a
 * company may have no logo. For such items, give `initials` instead of
 * `image`. The list then shows the initials of the name in a tile that has
 * the same size and shape as the pictures, so that all the names still line
 * up in one column.
 *
 * `initials` takes the `name` to read the initials from. For the name of a
 * company, add `nameType: 'company'`. To show letters that you have already
 * picked yourself, give them as the `name` with `nameType: 'initials'`. The
 * documentation of [Initials](#/component/limel-initials/) explains how the
 * letters are worked out.
 *
 * When an item has both `image` and `initials`, the picture is shown. So it is
 * fine to always set `initials`, and to add `image` whenever there is one.
 */
@Component({
    tag: 'limel-example-list-initials',
    shadow: true,
})
export class ListInitialsExample {
    private readonly items: Array<ListItem<number>> = [
        {
            text: 'Lucy Chyzhova',
            secondaryText: 'UX Designer',
            value: 1,
            initials: { name: 'Lucy Chyzhova' },
            image: {
                src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                alt: '',
            },
        },
        {
            text: 'Elin Berg',
            secondaryText: 'Account Manager',
            value: 2,
            initials: { name: 'Elin Berg' },
        },
        {
            text: 'Anna Maria Svensson',
            secondaryText: 'Engineer',
            value: 3,
            initials: { name: 'Anna Maria Svensson' },
            disabled: true,
        },
        {
            text: 'Northwind Bikes AB',
            secondaryText: 'Customer',
            value: 4,
            initials: { name: 'Northwind Bikes AB', nameType: 'company' },
        },
    ];

    public render() {
        return <limel-list items={this.items} type="selectable" />;
    }
}
