import {
    FileInfo,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Using the `imageFit` prop
 * To control how the image is resized within the profile picture component,
 * you can set the `imageFit` prop to one of the following values:
 * - `cover` (default): the image will be resized to cover the entire container, potentially cropping it.
 * - `contain`: the image will be resized to fit within the container while maintaining its aspect ratio.
 */
@Component({
    tag: 'limel-example-profile-picture-image-fit',
    shadow: true,
    styleUrl: 'profile-picture-image-fit.scss',
})
export class ProfilePictureImageFitExample {
    @State()
    private fit: 'cover' | 'contain' = 'cover';

    private fitOptions: Option[] = [
        { text: 'cover', value: 'cover' },
        { text: 'contain', value: 'contain' },
    ];

    @State()
    private value?: FileInfo | string =
        'https://lundalogik.github.io/lime-elements/2e86c284-d190-4c41-8da2-4de50103a0cd.png';

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Change profile picture"
                    value={this.value}
                    onChange={this.handleChange}
                    imageFit={this.fit}
                />
                <limel-example-controls>
                    <limel-select
                        label="imageFit"
                        value={this.getSelectedFit()}
                        options={this.fitOptions}
                        onChange={this.handleImageFitChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private getSelectedFit = (): Option => {
        return this.fitOptions.find((option) => option.value === this.fit);
    };

    private handleImageFitChange = (event: LimelSelectCustomEvent<Option>) => {
        this.fit = event.detail.value as 'cover' | 'contain';
    };
}
