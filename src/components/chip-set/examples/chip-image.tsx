import { Component, h } from '@stencil/core';

/**
 * Chips with images
 *
 * You can use images instead of icons on chips.
 *
 * :::note
 * The image will be displayed instead of the icon, if both are provided.
 * :::
 */
@Component({
    tag: 'limel-example-chip-set-image',
    shadow: true,
})
export class ChipSetImageExample {
    public render() {
        return [
            <limel-chip-set
                value={[
                    {
                        id: 1,
                        text: 'Kiarokh',
                        icon: {
                            name: 'honey_badger',
                            color: 'rgb(var(--color-yellow-default))',
                        },
                        image: {
                            src: 'https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png',
                            alt: 'A picture of Kiarokh Moattar, Product Designer at Lime Technologies',
                        },
                    },
                    {
                        id: 2,
                        text: 'Lucy',
                        image: {
                            src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
                            alt: 'A picture of Lucy Chyzhova, UX Designer at Lime Technologies',
                        },
                    },
                    {
                        id: 3,
                        text: 'Adrian',
                        image: {
                            src: 'https://lundalogik.github.io/lime-elements/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png',
                            alt: 'A picture of Adrian Schmidt, Head of Smooth Operations at Lime Technologies',
                        },
                    },
                ]}
            />,
        ];
    }
}
