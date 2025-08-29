import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Resize on select: 512×512 PNG using contain (no crop)
 *
 * By default, when a user select a picture to upload, the component will the original
 * file as selected, preserving its original filesize, format, aspect ratio and proportions.
 * The `imageFit` in the default mode only affects the visual preview (cover/contain) of the
 * selected image, not the actual file itself.
 *
 * However, this might be problematic for very large images, as it can lead to slow
 * uploads and high memory usage.
 *
 * To support such scenarios, this component has a built-in client-side (in browser)
 * resizing. By configuring the `resize` prop, you can instruct the
 * component to resize the selected image, before uploading it.
 *
 * The configuration showcased in this example works like this:
 * - converts the selected image to a 512×512 PNG
 * - preserves the entire image within the specified square;
 * - and retains transparent background if the source file has transparency
 */
@Component({
    tag: 'limel-example-profile-picture-resize-contain',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureResizeContainExample {
    @State()
    private value?: FileInfo | string = undefined;

    private options: ResizeOptions = {
        width: 512,
        height: 512,
        fit: 'contain',
        type: 'image/png',
    };

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture (contain)"
                    value={this.value}
                    resize={this.options}
                    imageFit="contain"
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
    };
}
