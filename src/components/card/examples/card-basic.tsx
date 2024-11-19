import { Component, h } from '@stencil/core';
/**
 * Basic example
 * Cards can be used to show some information in a static manner,
 * for instance when displaying a grid of cards, each of which is
 * providing a brief summary of a topic.
 *
 * However, the most common use cases of these UI components is to
 * provide a media-rich and interactive experience to the user,
 * which you can see in next examples.
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-basic',
    styleUrl: 'card-basic.scss',
})
export class CardBasicsExample {
    public render() {
        const icon = {
            name: '-lime-logo-elements',
            title: 'Logo of Lime Elements',
        };

        return (
            <limel-card
                icon={icon}
                heading="Lime Elements"
                subheading="World's best component library"
                value="Enterprise class design system, written in typescript, empowering developers & designers to build _modern_ and _flexible_ web applications."
            />
        );
    }
}
