import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Styling
 *
 * Even though the component's main use case is displaying a profile picture—in
 * which a file input, an image viewer, and other controls are combined within
 * the same component—it can also be styled to fit different design requirements.
 *
 * Custom CSS property `--profile-picture-border-radius` can be used to customize
 * the appearance of the component. Additionally, you can define a custom size or
 * aspect ratio to render the image as desired.
 */
@Component({
    tag: 'limel-example-profile-picture-styling',
    shadow: true,
    styleUrl: 'profile-picture-styling.scss',
})
export class ProfilePictureStylingExample {
    @State()
    private value?: FileInfo | string = 'https://unsplash.it/800/600/?random';

    public render() {
        const icon = {
            name: 'add_image',
            title: 'add new photo',
        };
        return (
            <Host>
                <div>
                    <limel-profile-picture
                        label="Custom photo"
                        value={this.value}
                        onChange={this.handleChange}
                        icon={icon}
                    />
                </div>
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };
}
