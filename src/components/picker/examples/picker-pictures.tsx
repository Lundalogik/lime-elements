import { LimelPickerCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With pictures
 *
 * Give an item an `image` to show a picture in its suggestion, for example a
 * photo of a person or the logo of a company. Pictures make suggestions
 * quicker to tell apart than names alone.
 *
 * An item can have an `icon` as well. In the list of suggestions, the icon is
 * then shown as a small badge on the corner of the picture. An item without a
 * picture shows its icon in the picture's place instead, so that all the
 * names still line up.
 *
 * When an item is picked, its chip shows the picture, or the icon when there
 * is no picture.
 */
@Component({
    tag: 'limel-example-picker-pictures',
    shadow: true,
})
export class PickerPicturesExample {
    @State()
    private selectedItems: Array<ListItem<number>> = [];

    private allItems: Array<ListItem<number>> = [
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

    public render() {
        return [
            <limel-picker
                label="Favorite awesomenaut"
                value={this.selectedItems}
                searchLabel={'Search your awesomenaut'}
                multiple={true}
                allItems={this.allItems}
                onChange={this.onChange}
                onInteract={this.onInteract}
            />,
            <limel-example-value value={this.selectedItems} />,
        ];
    }

    private onChange = (
        event: LimelPickerCustomEvent<Array<ListItem<number>>>
    ) => {
        this.selectedItems = [...event.detail];
    };

    private onInteract = (event: LimelPickerCustomEvent<ListItem<number>>) => {
        console.log('Value interacted with:', event.detail);
    };
}
