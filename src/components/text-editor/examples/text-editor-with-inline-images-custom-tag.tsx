import { Component, h, State, Host } from '@stencil/core';
import {
    InlineImages,
    LimelTextEditorCustomEvent,
    LimelCheckboxCustomEvent,
} from '@limetech/lime-elements';

/**
 * Inline images stored as a custom tag
 *
 * Persist images as a custom `<tagName image-id="…">` element — the id only, no
 * URL baked into the stored content — which keeps it portable across
 * environments. The element resolves the id to an image when rendered outside
 * the editor; inside the editor, `getUrl` resolves it for display. You provide:
 *
 * - `tagName` — the element images are persisted as,
 * - `getUrl` — resolve a stored id to a display URL,
 * - `upload` — store the pasted file and resolve to its id (the editor shows a
 *   failed state if it rejects).
 *
 * :::note
 * This example fakes the store with an in-memory map and object URLs; a real
 * implementation would upload to your backend and resolve a real URL.
 */
@Component({
    tag: 'limel-example-text-editor-with-inline-images-custom-tag',
    shadow: true,
})
export class TextEditorWithInlineImagesCustomTagExample {
    @State()
    private value = 'Copy an image file and paste it here.';

    @State()
    private uploadImageFails = false;

    private readonly store = new Map<string, string>();

    private readonly inlineImages: InlineImages = {
        tagName: 'my-image',
        getUrl: (id) => this.store.get(id) ?? '',
        upload: (file) => this.uploadImage(file),
    };

    public render() {
        return (
            <Host>
                <limel-text-editor
                    value={this.value}
                    onChange={this.handleChange}
                    inlineImages={this.inlineImages}
                />
                <limel-checkbox
                    label="Upload image fails"
                    onChange={this.handleFailedUploadChange}
                />
                <limel-example-value label="Value" value={this.value} />
            </Host>
        );
    }

    private readonly handleFailedUploadChange = (
        event: LimelCheckboxCustomEvent<boolean>
    ) => {
        this.uploadImageFails = event.detail;
    };

    private readonly handleChange = (
        event: LimelTextEditorCustomEvent<string>
    ) => {
        this.value = event.detail;
    };

    private readonly uploadImage = (file: File): Promise<string> => {
        // Simulate uploading to external storage and returning the stored id.
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.uploadImageFails) {
                    reject(new Error('Server error'));

                    return;
                }

                const id = crypto.randomUUID();
                this.store.set(id, URL.createObjectURL(file));
                resolve(id);
            }, 2000);
        });
    };
}
