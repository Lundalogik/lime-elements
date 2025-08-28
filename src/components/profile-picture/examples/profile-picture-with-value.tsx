import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With pre-defined value
 */
@Component({
    tag: 'limel-example-profile-picture-with-value',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureWithValueExample {
    @State()
    private value?: FileInfo | string =
        'https://lundalogik.github.io/lime-elements/780af2a6-d3d1-4593-8642-f03210d09271.png';

    public render() {
        return [
            <limel-profile-picture
                label="Change profile picture"
                value={this.value}
                onChange={this.handleChange}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };
}
