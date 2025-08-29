import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Resize with graceful fallback for unsupported formats
 *
 * Demonstrates a user message strategy when client-side decode fails (e.g.,
 * HEIC in non-WebKit browsers). The component itself will emit the original
 * file when resize fails; here we pair it with a message.
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
    private note?: string;

    private options: ResizeOptions = {
        width: 400,
        height: 400,
        fit: 'cover',
        type: 'image/jpeg',
    };

    public render() {
        return [
            <limel-profile-picture
                label="Profile picture"
                value={this.value}
                resize={this.options}
                onChange={this.handleChange}
            />,
            this.note && <p>{this.note}</p>,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        const before = this.value;
        this.value = event.detail;
        // Heuristic message: if the emitted file didn't change type/name as expected,
        // inform users that conversion may not have happened client-side.
        if (
            before &&
            typeof before !== 'string' &&
            this.value &&
            typeof this.value !== 'string'
        ) {
            const gotJpeg =
                this.value.filename?.toLowerCase?.().endsWith('.jpg') ||
                this.value.filename?.toLowerCase?.().endsWith('.jpeg');
            if (!gotJpeg && this.options.type === 'image/jpeg') {
                this.note =
                    'Preview shown. Client-side conversion may have been skipped due to unsupported format in this browser. The original file will be uploaded.';
            } else {
                this.note = undefined;
            }
        }
    };
}
