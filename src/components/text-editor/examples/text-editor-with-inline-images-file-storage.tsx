import { Component, h, State, Host } from '@stencil/core';
import {
    ImageInserter,
    FileInfo,
    EditorImage,
    LimelTextEditorCustomEvent,
    LimelCheckboxCustomEvent,
    EditorMetadata,
} from '@limetech/lime-elements';
/**
 * Handling inline images (with external file storage)
 *
 * To allow users to paste images directly into the text editor, you can
 * listen to the `imagePasted` event, which is triggered when an image file
 * is pasted into the editor.
 *
 * The `imagePasted` event contains an `ImageInserter` object, which you can
 * use to insert a thumbnail of the pasted image into the editor.
 * After the thumbnail is inserted, you can upload the image to an external
 * file storage and insert the src url of the uploaded image using the
 * `insertImage` method.
 *
 * If the image upload fails, you can insert a failed thumbnail using the
 * `insertFailedThumbnail` method.
 *
 * :::note
 * In this example, because we don't actually upload the image you paste
 * anywhere, once the "upload" is done, we will replace the image you
 * pasted with a url to an image of the Lime CRM logo.
 *
 * In reality, you would of course insert the url to the newly uploaded
 * image instead.
 */
@Component({
    tag: 'limel-example-text-editor-with-inline-images-file-storage',
    shadow: true,
})
export class TextEditorWithInlineImagesExample {
    @State()
    private value = 'Copy an image file and paste it here.';

    @State()
    private uploadImageFails = false;

    private metadata: EditorMetadata = { links: [], images: [] };

    public render() {
        return (
            <Host>
                <limel-text-editor
                    value={this.value}
                    onChange={this.handleChange}
                    onImagePasted={this.handleImagePasted}
                    onMetadataChange={this.handleMetadataChange}
                />
                <limel-checkbox
                    label="Upload image fails - insert failed thumbnail"
                    onChange={this.handleFailedThumbnailChange}
                />
                <limel-example-value label="Value" value={this.value} />
            </Host>
        );
    }

    private handleFailedThumbnailChange = (
        event: LimelCheckboxCustomEvent<boolean>
    ) => {
        this.uploadImageFails = event.detail;
    };

    private handleChange = (event: LimelTextEditorCustomEvent<string>) => {
        this.value = event.detail;
    };

    private handleImagePasted = async (
        event: LimelTextEditorCustomEvent<ImageInserter>
    ) => {
        const imageInserter = event.detail;

        imageInserter.insertThumbnail();

        const imageSrc = await this.uploadImage(imageInserter.fileInfo);
        if (imageSrc) {
            imageInserter.insertImage(imageSrc);
        } else {
            imageInserter.insertFailedThumbnail();
        }
    };

    private uploadImage = async (fileInfo: FileInfo): Promise<string> => {
        try {
            // Upload image to external file storage.
            // fileInfo.fileContent contains the image data.

            // Simulate upload delay.
            const imageSrc: string = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (this.uploadImageFails) {
                        reject('Server error');
                    } else {
                        resolve('https://cdn.lime-crm.com/mail-addin-logo.png');
                    }
                }, 2000);
            });

            // Return the src url of the uploaded image.
            return imageSrc;
        } catch (error) {
            console.error(
                `Failed to upload image ${fileInfo.filename}: ${error}`
            );
        }
    };

    private handleMetadataChange = (
        event: LimelTextEditorCustomEvent<EditorMetadata>
    ) => {
        const removedImages = this.getRemovedImages(
            this.metadata,
            event.detail
        );

        for (const image of removedImages) {
            if (image.state === 'success') {
                this.removeImage(image);
            }
        }

        this.metadata = event.detail;
    };

    private getRemovedImages(
        oldMetadata: EditorMetadata,
        newMetadata: EditorMetadata
    ): EditorImage[] {
        const newImageIds = new Set(
            newMetadata.images.map((image) => image.fileInfoId)
        );

        return oldMetadata.images.filter(
            (image) => !newImageIds.has(image.fileInfoId)
        );
    }

    private removeImage(image: EditorImage) {
        // Remove image from external file storage if desired.
        console.log(`Image removed: ${image.fileInfoId}`);
    }
}
