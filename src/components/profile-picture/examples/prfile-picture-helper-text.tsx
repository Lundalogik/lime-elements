import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Helper text
 * Using a helper text, you can provide additional guidance to the user,
 * for example about the expected file format or any other relevant information.
 *
 * This also helps assistive technologies to describe the purpose of the component
 * in a user interface.
 */
@Component({
    tag: 'limel-example-profile-picture-helper-text',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureHelperTextExample {
    @State()
    private value?: FileInfo | string = undefined;

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture"
                    helperText="Drag & drop a PNG or JPG file here, or click to browse."
                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
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
