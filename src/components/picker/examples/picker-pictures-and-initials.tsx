import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * With pictures and initials
 *
 * The suggestions in a picker are drawn as a [List](#/component/limel-list/),
 * so they can show `initials` for the items that have no picture. That way,
 * every suggestion starts with something that helps users tell them apart,
 * and all the names line up in one column. A picked item is shown as a
 * [Chip](#/component/limel-chip/), with the same picture or initials.
 *
 * Here, two people have a picture, two have only their initials, and the
 * company is read with `nameType: 'company'`, which skips its legal form.
 */
@Component({
    tag: 'limel-example-picker-pictures-and-initials',
    shadow: true,
})
export class PickerPicturesAndInitialsExample {
    @State()
    private selectedItems: Array<ListItem<number>> = [];

    private readonly allItems: Array<ListItem<number>> = [
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
            text: 'Kiarokh Moattar',
            secondaryText: 'Product Designer',
            value: 3,
            initials: { name: 'Kiarokh Moattar' },
            image: {
                src: 'https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png',
                alt: '',
            },
        },
        {
            text: 'Jonas Ek',
            secondaryText: 'Engineer',
            value: 4,
            initials: { name: 'Jonas Ek' },
        },
        {
            text: 'Northwind Bikes AB',
            secondaryText: 'Customer',
            value: 5,
            initials: { name: 'Northwind Bikes AB', nameType: 'company' },
        },
    ];

    public render() {
        return (
            <Host>
                <limel-picker
                    label="Contacts"
                    value={this.selectedItems}
                    searchLabel="Search contacts"
                    multiple={true}
                    allItems={this.allItems}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.selectedItems} />
            </Host>
        );
    }

    private readonly handleChange = (
        event: LimelPickerCustomEvent<Array<ListItem<number>>>
    ) => {
        this.selectedItems = [...event.detail];
    };
}
