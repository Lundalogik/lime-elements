import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Changing the placeholder icon
 * By default, the component uses a generic icon as a placeholder.
 * However, depending on the context, you may want to customize
 * how the default icon looks like, and what kind of motif it
 * represents.
 */
@Component({
    tag: 'limel-example-profile-picture-icon',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureIconExample {
    @State()
    private value?: FileInfo | string = undefined;

    public render() {
        const icon = {
            name: 'upload_to_cloud',
            color: 'rgb(var(--color-sky-dark))',
            title: 'upload icon',
        };

        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture"
                    value={this.value}
                    onChange={this.handleChange}
                    icon={icon}
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
