import { Component, h } from '@stencil/core';

/**
 * Picture instead of icon
 * Using the `Img` interface, you can specify an image to be displayed on the chip.
 *
 * :::note
 * The specified image will be displayed instead of the icon, if both are provided.
 * :::
 */
@Component({
    tag: 'limel-example-chip-image',
    shadow: true,
})
export class ChipImageExample {
    public render() {
        const icon = {
            name: 'filled_star',
            color: 'rgb(var(--color-yellow-default))',
        };

        const image = {
            src: 'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png',
            alt: 'A picture of Lucy Chyzhova, UX designer at Lime Technologies',
        };

        return <limel-chip text="Lucy Chyzhova" icon={icon} image={image} />;
    }
}
