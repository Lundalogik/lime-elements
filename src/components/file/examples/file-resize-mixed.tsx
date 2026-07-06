import { FileInfo, type ResizeOptions } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Resize in a general file picker
 *
 * The same `resizeImage` options with the default `accept="*"` — the scenario
 * unique to a general-purpose picker. Resize degrades gracefully:
 *
 * - selecting an image resizes and re-encodes it;
 * - selecting a PDF, archive, document, or SVG passes through untouched —
 *   only decodable raster images are resized;
 * - selecting a HEIC/HEIF off Safari emits the original unchanged, because the
 *   browser cannot decode it.
 *
 * Inspect the emitted value below: its `filename`, `contentType` and `size`
 * change only when the file was actually resized.
 *
 * :::note
 * HEIC/HEIF images (common from iPhones) cannot be decoded outside Safari, so
 * they are emitted unchanged. Detect this in your app — for example from the
 * emitted filename extension, as below — and convert or reject server-side if
 * needed.
 * :::
 *
 * @beta
 */
@Component({
    tag: 'limel-example-file-resize-mixed',
    shadow: true,
})
export class FileResizeMixedExample {
    @State()
    private value?: FileInfo;

    @State()
    private notResized = false;

    // Every field is optional. When omitted, `fit` defaults to `cover`, `type`
    // to `image/jpeg` and `quality` to `0.85`; `width`/`height` fall back to the
    // source dimensions (a missing one preserves the aspect ratio).
    private options: ResizeOptions = {
        width: 1024,
        height: 1024,
        fit: 'contain',
        type: 'image/jpeg',
        quality: 0.85,
    };

    public render() {
        return (
            <Host>
                <limel-file
                    label="Attach a file"
                    value={this.value}
                    resizeImage={this.options}
                    onChange={this.handleChange}
                />
                {this.renderCallout()}
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private renderCallout() {
        if (!this.notResized) {
            return;
        }

        return [
            <hr key="divider" style={{ margin: '2rem 0' }} />,
            <limel-callout
                key="callout"
                aria-live="polite"
                heading="Uploaded as-is"
            >
                This file was not resized — either it is not an image, or its
                format cannot be decoded in this browser (for example HEIC
                outside Safari). The original file will be used.
            </limel-callout>,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;

        if (this.value) {
            const name = this.value.filename?.toLowerCase?.() ?? '';
            const looksLikeImage =
                /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif|tiff?)$/.test(name);
            const gotJpeg = name.endsWith('.jpg') || name.endsWith('.jpeg');
            // We request `image/jpeg` output, so an image-looking file that did
            // not come back as `.jpg` means resize was skipped (non-decodable).
            this.notResized = looksLikeImage && !gotJpeg;

            return;
        }

        this.notResized = false;
    };
}
