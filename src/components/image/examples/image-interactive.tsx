import { Component, h, State } from '@stencil/core';
import { Option } from '@limetech/lime-elements';

/**
 * Interactive image example
 *
 * This example shows how the image component handles different states
 * and allows you to test various properties interactively.
 */
@Component({
    tag: 'limel-example-image-interactive',
    shadow: true,
})
export class ImageInteractiveExample {
    @State()
    private imageSrc: string = 'https://picsum.photos/400/300?random=2';

    @State()
    private altText: string = 'Interactive example image';

    @State()
    private showImage: boolean = true;

    private imageOptions: Option<string>[] = [
        {
            text: 'Nature (400x300)',
            value: 'https://picsum.photos/400/300?random=2',
        },
        {
            text: 'Architecture (500x350)',
            value: 'https://picsum.photos/500/350?random=3',
        },
        {
            text: 'Portrait (300x400)',
            value: 'https://picsum.photos/300/400?random=4',
        },
        {
            text: 'Broken link',
            value: 'https://invalid-url-that-will-fail.com/image.jpg',
        },
    ];

    public render() {
        return [
            this.showImage ? (
                <limel-image src={this.imageSrc} alt={this.altText} />
            ) : null,
            <limel-example-controls>
                <limel-select
                    label="Image source"
                    value={this.imageOptions.find(
                        (option) => option.value === this.imageSrc
                    )}
                    options={this.imageOptions}
                    onChange={this.handleImageChange}
                />
                <limel-input-field
                    label="Alt text"
                    value={this.altText}
                    onChange={this.handleAltChange}
                />
                <limel-checkbox
                    label="Show image"
                    checked={this.showImage}
                    onChange={this.handleShowImageChange}
                />
            </limel-example-controls>,
        ];
    }

    private handleImageChange = (event: CustomEvent) => {
        this.imageSrc = event.detail?.value || '';
    };

    private handleAltChange = (event: CustomEvent) => {
        this.altText = event.detail;
    };

    private handleShowImageChange = (event: CustomEvent) => {
        this.showImage = event.detail;
    };
}
