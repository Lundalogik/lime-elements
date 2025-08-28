import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic profile picture
 */
@Component({
    tag: 'limel-example-profile-picture',
    shadow: true,
})
export class ProfilePictureExample {
    @State()
    private value?: FileInfo | string =
        'https://avatars.githubusercontent.com/u/9919?v=4';

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
