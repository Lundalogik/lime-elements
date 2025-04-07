import { Component, h, State } from '@stencil/core';
import {
    ImageInserter,
    LimelTextEditorCustomEvent,
} from '@limetech/lime-elements';
/**
 * Handling inline images (with base64 encoded data)
 *
 * To allow users to paste images directly into the text editor, you can
 * listen to the `imagePasted` event, which is triggered when an image file
 * is pasted into the editor.
 *
 * The `imagePasted` event contains an `ImageInserter` object, which you can
 * use to insert a thumbnail of the pasted image into the editor.
 * After the thumbnail is inserted, you can immediately insert the image
 * as base64 encoded data using the `insertImage` method.
 *
 * :::note
 * This example demonstrates the simplest approach using base64 encoding.
 * However, for production use, it is recommended to upload images to
 * external file storage and insert the src URL of the uploaded image
 * instead, as shown in the file-storage example.
 */
@Component({
    tag: 'limel-example-text-editor-with-inline-images-base64',
    shadow: true,
})
export class TextEditorWithInlineImagesExample {
    @State()
    private value = 'Copy an image file and paste it here.';

    public render() {
        return (
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                onImagePasted={this.handleImagePasted}
                contentType="html"
            />
        );
    }

    private handleChange = (event: LimelTextEditorCustomEvent<string>) => {
        this.value = event.detail;
    };

    private handleImagePasted = async (
        event: LimelTextEditorCustomEvent<ImageInserter>,
    ) => {
        const imageInserter = event.detail;

        imageInserter.insertThumbnail();
        imageInserter.insertImage();
    };
}
