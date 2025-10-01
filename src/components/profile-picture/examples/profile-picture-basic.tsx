import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Basic profile picture
 *
 * This component can be both used as a placeholder for an avatar,
 * and in the same time act as an interactive element that enables
 * users to upload a new profile picture.
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

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture"
                    value={this.value}
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
