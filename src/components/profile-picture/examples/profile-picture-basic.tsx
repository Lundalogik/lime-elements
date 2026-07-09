import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Basic profile picture
 *
 * This component can be both used as a placeholder for an avatar,
 * and in the same time act as an interactive element that enables
 * users to upload a new profile picture.
 *
 * This example enables client-side resizing with only `width` and `height`
 * set on `resize`. Every other option is left to the component's
 * avatar-oriented defaults: the file is emitted as an `image/jpeg` at
 * `quality` `0.85`, cropped to the `imageFit` (`cover` here). Set `type`,
 * `quality` or `fit` on `resize` to override any of them.
 *
 * :::note
 * You must add a proper `width` and `height` to the component.
 * :::
 */
@Component({
    tag: 'limel-example-profile-picture-basic',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureExample {
    @State()
    private value?: FileInfo | string = undefined;

    // Only width and height are set; type, quality and fit fall back to the
    // component's avatar defaults (image/jpeg, 0.85, and imageFit).
    private resize: ResizeOptions = { width: 400, height: 400 };

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture"
                    value={this.value}
                    resize={this.resize}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };
}
