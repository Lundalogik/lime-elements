import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Client‑side resize, with graceful fallback for unsupported formats
 *
 * Resizing and compressing the image happens right in the browser, on the user's device,
 * before upload.
 *
 * Mostly, this works perfectly fine. However, it can lead to some edge-cases,
 * when a browser cannot support certain image formats. The most notable case is
 * `.heic` or `.heif` images, taken on iOS devices.
 *
 * On iPhones and iPads, all browsers use WebKit which can decode HEIC/HEIF.
 * Therefore using  `limel-profile-picture` for selecting a file from the Photos app,
 * or using the camera to take a photo works perfectly fine, and files can be converted
 * (e.g., to JPEG) and resized on the user's device, before uploading.
 *
 * However, selecting HEIC/HEIF files can become a problem off iOS/WebKit.
 * For instance a Mac user might try to upload an AirDropped (from iPhone) `.heic` file,
 * on their Chromium browser. At least at the time of writing this documentation,
 * Chrome, Edge, Firefox, Opera, Brave and Android browsers can’t
 * decode HEIC/HEIF yet. Therefore, the browser-side resizing/converting won't work.
 *
 * Therefore, if a user uploads a HEIC (e.g., AirDropped from an iPhone),
 * client-side preview/resize will fail unless you reject or handle it server‑side.
 *
 * :::note
 * Camera capture on iOS often returns JPEG; picking from the library may
 * return HEIC—plan to convert to JPEG for consistency.
 * :::
 *
 * This example demonstrates a user message strategy when client-side decode fails
 * (e.g., HEIC in non-WebKit browsers). To test this, select an image file with
 * HEIC format, on a desktop computer, using any browser except Safari.
 *
 * The component itself will emit the original file when resize fails;
 * and displays an inbuilt error message.
 *
 * But here we render an additional user message.
 *
 */
@Component({
    tag: 'limel-example-profile-picture-resize-fallback',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureResizeFallbackExample {
    @State()
    private value?: FileInfo | string = undefined;

    @State()
    private hasError = false;

    private options: ResizeOptions = {
        width: 400,
        height: 400,
        fit: 'cover',
        type: 'image/jpeg',
    };

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    label="Profile picture"
                    value={this.value}
                    resize={this.options}
                    onChange={this.handleChange}
                />
                {this.renderCallout()}
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private renderCallout() {
        if (!this.hasError) {
            return;
        }

        return [
            <hr style={{ margin: '2rem 0' }} />,
            <limel-callout aria-live="polite" heading="Preview unavailable">
                Client-side conversion may have been skipped due to unsupported
                format in this browser. The original file will be uploaded.
            </limel-callout>,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
        // Toggle error state if the emitted file was not converted to the expected type
        if (this.value && typeof this.value !== 'string') {
            const lower = this.value.filename?.toLowerCase?.() ?? '';
            const jpegExpected = this.options.type === 'image/jpeg';
            const gotJpeg = lower.endsWith('.jpg') || lower.endsWith('.jpeg');
            this.hasError = jpegExpected && !gotJpeg;
            return;
        }
        this.hasError = false;
    };
}
