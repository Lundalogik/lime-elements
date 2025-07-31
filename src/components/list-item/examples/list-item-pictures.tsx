import { Component, h, Host, State } from '@stencil/core';

/**
 * List item with pictures
 *
 * This example demonstrates how to use images in list items.
 * The first item shows a picture only, while the second item
 * shows both a picture and an icon together.
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
