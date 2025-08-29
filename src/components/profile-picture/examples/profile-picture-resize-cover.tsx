import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Resize on select: 400×400 JPEG using cover (center-crop)
 *
 * Typical avatar setup. Converts anything decodable to a square JPEG.
 *
 * Notes
 * - iOS/Safari can decode HEIC/HEIF, so selecting from iPhone Photos works.
 * - Chromium/Firefox generally cannot decode HEIC; the component will fall back
 *   to the original file if decoding fails.
 */
@Component({
    tag: 'limel-example-profile-picture-resize-cover',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureResizeCoverExample {
    @State()
    private value?: FileInfo | string = undefined;

    private options: ResizeOptions = {
        width: 400,
        height: 400,
        fit: 'cover',
        type: 'image/jpeg',
        quality: 0.85,
    };

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture"
                    value={this.value}
                    accept="image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic"
                    resize={this.options}
                    onChange={this.handleChange}
                />
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
        // Upload `event.detail?.fileContent` if present
    };
}
