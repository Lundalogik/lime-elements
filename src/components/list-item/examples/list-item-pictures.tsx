import { Component, h, Host, State } from '@stencil/core';

/**
 * List item with pictures
 *
 * This example demonstrates how to use images in list items.
 * The first item shows a picture only, the second one shows both a picture
 * and an icon together, and the third one shows an icon but no picture.
 *
 * Notice how the icon of the third item is given the same footprint as the
 * pictures above it, so that all three labels start in the same column.
 * This happens whenever an item without a picture sits among items that
 * have one, and applies to badge icons and plain icons alike.
 */
@Component({
    tag: 'limel-example-list-item-pictures',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemPicturesExample {
    @State()
    private badgeIcon = false;

    public render() {
        return (
            <Host>
                <ul>
                    <limel-list-item
                        text="Lucy Chyzhova"
                        secondaryText="UX Designer"
                        image={{
                            src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                            alt: 'A picture of Lucy Chyzhova, UX designer at Lime Technologies',
                        }}
                    />
                    <limel-list-item
                        text="Kiarokh Moattar"
                        secondaryText="Product Designer"
                        badgeIcon={this.badgeIcon}
                        icon={{
                            name: 'party_hat',
                            title: 'Party hat icon',
                            color: 'rgb(var(--color-white))',
                            backgroundColor: 'rgb(var(--color-pink-default))',
                        }}
                        image={{
                            src: 'https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png',
                            alt: 'A picture of Kiarokh Moattar, Product Designer at Lime Technologies',
                        }}
                    />
                    <limel-list-item
                        text="Befkadu Degefa"
                        secondaryText="Engineer"
                        badgeIcon={this.badgeIcon}
                        icon={{
                            name: 'bowler_hat',
                            title: 'Bowler hat icon',
                            color: 'rgb(var(--color-sky-default))',
                        }}
                    />
                </ul>
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.badgeIcon}
                        label="badgeIcon"
                        onChange={this.setBadgeIcon}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setBadgeIcon = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.badgeIcon = event.detail;
    };
}
