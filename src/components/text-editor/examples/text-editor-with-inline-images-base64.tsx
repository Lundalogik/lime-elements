import { Component, h, State } from '@stencil/core';
import {
    InlineImages,
    LimelTextEditorCustomEvent,
} from '@limetech/lime-elements';

/**
 * Inline images stored as an image source
 *
 * Enable inline images by passing an `inlineImages` config. The editor owns the
 * whole paste lifecycle — it shows a thumbnail, calls your `upload`, then swaps
 * in a resizable image — so all you provide is `upload`, resolving to a `src`
 * that the editor stores as `<img src="…">`.
 *
 * Here `upload` returns a base64 data URI, so no backend is needed. The same
 * shape also covers external storage — just have `upload` return the uploaded
 * URL instead of a data URI. To store an opaque id rather than a URL, use the
 * custom-tag example instead.
 */
@Component({
    tag: 'limel-example-text-editor-with-inline-images-base64',
    shadow: true,
})
export class TextEditorWithInlineImagesExample {
    @State()
    private value = 'Copy an image file and paste it here.';

    private readonly inlineImages: InlineImages = {
        upload: (file) => this.toBase64(file),
    };

    public render() {
        return (
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                inlineImages={this.inlineImages}
                contentType="html"
            />
        );
    }

    private handleChange = (event: LimelTextEditorCustomEvent<string>) => {
        this.value = event.detail;
    };

    private readonly toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('loadend', () =>
                resolve(reader.result as string)
            );
            reader.addEventListener('error', () => reject(reader.error));
            reader.readAsDataURL(file);
        });
    };
}
