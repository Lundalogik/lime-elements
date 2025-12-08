import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * List with Pictures and Icons
 *
 * :::note
 * While it's technically possible to display both images and icons simultaneously
 * for each list item, we recommend against using identical icons across all items.
 * Repeating the same icon for every list item adds unnecessary visual clutter
 * without providing additional value.
 *
 * Icons, like images, should serve to help users quickly differentiate between
 * list items. They are most effective when each icon uniquely identifies
 * the type or category of its list item.
 * :::
 */
@Component({
    tag: 'limel-example-list-pictures',
    shadow: true,
})
export class PictureListExample {
    private items: Array<ListItem<number>> = [
        {
            text: 'Lucy Chyzhova',
            secondaryText: 'UX Designer',
            value: 1,
            icon: {
                name: 'santas_hat',
                color: 'rgb(var(--color-coral-default))',
            },
            image: {
                src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                alt: 'A picture of Lucy Chyzhova, UX designer at Lime Technologies',
            },
        },
        {
            text: 'Kiarokh Moattar',
            secondaryText: 'Product Designer',
            value: 2,
            icon: {
                name: 'party_hat',
                color: 'rgb(var(--color-pink-default))',
            },
            image: {
                src: 'https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png',
                alt: 'A picture of Kiarokh Moattar, Product Designer at Lime Technologies',
            },
        },
        {
            text: 'Adrian Schmidt',
            secondaryText: 'Engineer',
            value: 3,
            icon: 'viking_helmet',
            image: {
                src: 'https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png',
                alt: 'A picture of Adrian Schmidt, Head of Smooth Operations at Lime Technologies',
            },
        },
        {
            text: 'Befkadu Degefa',
            secondaryText: 'Engineer',
            value: 4,
            icon: {
                name: 'bowler_hat',
                color: 'rgb(var(--color-sky-default))',
            },
        },
    ];

    @State()
    private badgeIcons: boolean = false;

    @State()
    private hasStripedRows: boolean = true;

    public render() {
        return [
            <limel-list
                items={this.items}
                type="selectable"
                badgeIcons={this.badgeIcons}
                class={this.hasStripedRows ? 'has-striped-rows' : ''}
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.badgeIcons}
                    label="badge icons"
                    onChange={this.setBadgeIcons}
                />
                <limel-switch
                    value={this.hasStripedRows}
                    label="striped rows"
                    onChange={this.setHasStripedRows}
                />
            </limel-example-controls>,
        ];
    }

    private setBadgeIcons = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcons = event.detail;
    };

    private setHasStripedRows = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.hasStripedRows = event.detail;
    };
}
