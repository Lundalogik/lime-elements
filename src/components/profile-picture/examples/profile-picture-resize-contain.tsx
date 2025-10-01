import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Resize on select: 512×512 PNG using contain (no crop)
 *
 * By default, when a user selects a picture to upload, the component will take the original
 * file, which you should use for the upload. This will preserve the file's original filesize,
 * format, aspect ratio and proportions.
 *
 * The `imageFit` (`cover`/`contain`) property in this default mode only affects
 * the visual preview of the selected image, not the actual file itself.
 *
 * However, this might be problematic for very large images, as it can lead to slow
 * uploads and high memory usage.
 *
 * To support such scenarios, this component has a built-in client-side (in browser) resizing.
 * By configuring the `resize` prop, you can instruct the component to resize and compress
 * the selected image, before uploading it.
 *
 * The configuration showcased in this example works like this:
 * - `type: 'image/png'` converts the image to a PNG
 * - and this retains transparent background if the source file has transparency
 * - `width` & `height` set the target bounding box of 512×512 pixels
 * - `fit: 'contain'` preserves the entire image within that box (no crop; may add padding around the image)
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
        type: 'image/png',
        width: 512,
        height: 512,
        fit: 'contain',
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
