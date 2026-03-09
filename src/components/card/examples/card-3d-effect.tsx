import { Component, h, State } from '@stencil/core';
/**
 * 3D effect
 * By default, cards have a 3D tilt hover effect with a glow.
 * You can disable it by setting `show3dEffect` to `false`.
 */
@Component({
    shadow: true,
    tag: 'limel-example-card-3d-effect',
    styleUrl: 'card-basic.scss',
})
export class Card3dEffectExample {
    @State()
    private show3dEffect = true;

    @State()
    private clickable = true;

    public render() {
        const icon = {
            name: '-lime-logo-elements',
            title: 'Logo of Lime Elements',
        };

        const image = {
            src: 'https://unsplash.it/800/800/?random',
            alt: 'Random picture from unsplash.it',
            loading: 'lazy' as const,
        };

        return (
            <div>
                <limel-card
                    icon={icon}
                    image={image}
                    heading="Heading"
                    subheading="Subheading"
                    value="This is the body of the card. It can contain a lot of text, or just a little. It can also contain markdown, like **bold** or *italic* text, or even `inline code`."
                    show3dEffect={this.show3dEffect}
                    clickable={this.clickable}
                    onClick={this.handleClick}
                />
                <limel-example-controls>
                    <limel-switch
                        label="show3dEffect"
                        value={this.show3dEffect}
                        onChange={this.toggle3dEffect}
                    />
                    <limel-switch
                        label="clickable"
                        value={this.clickable}
                        onChange={this.toggleClickable}
                    />
                </limel-example-controls>
            </div>
        );
    }

    private handleClick = () => {
        console.log('Card clicked');
    };

    private toggle3dEffect = (event: CustomEvent<boolean>) => {
        this.show3dEffect = event.detail;
    };

    private toggleClickable = (event: CustomEvent<boolean>) => {
        this.clickable = event.detail;
    };
}
