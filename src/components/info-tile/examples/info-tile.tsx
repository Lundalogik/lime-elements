import { Component, h } from '@stencil/core';

/**
 * Basic example
 *
 * This component does its best to offer a responsive layout
 * that reacts both to the length of text, and size of the container.
 *
 * :::note
 * To use this component properly, you need to define both
 * a declared `height` and a declared `width` for it. Alternatively,
 * make sure that its container enforces a width and height,
 * for instance, use it as a flex or grid child.
 * :::
 *
 * In this example, you can resize the component to see how it
 * tries to adjust its content to the size of its container.
 *
 * :::tip
 * Try to avoid long textual content to get
 * the best possible visualization. They can cause
 * undesired overlapping of the content, depending on the size of the
 * component.
 * :::
 */
@Component({
    tag: 'limel-example-info-tile',
    shadow: true,
    styleUrl: 'info-tile.scss',
})
export class InfoTileExample {
    public render() {
        const link = {
            href: 'https://duckduckgo.com/?q=weather',
            title: 'Click to see real-time weather forecast',
            target: '_blank',
        };

        return (
            <div>
                <limel-info-tile
                    icon="partly_cloudy_rain"
                    label="Partly cloudy with a risk of rain"
                    prefix="temp"
                    value="23"
                    suffix="°C"
                    link={link}
                />
            </div>
        );
    }
}
