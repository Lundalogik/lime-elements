import { Component, h } from '@stencil/core';

/**
 * Some text
 */
@Component({
    tag: 'limel-example-file-preview-image',
    shadow: true,
})
export class FilePreviewExample {
    public render() {
        return (
            <limel-file-preview
                url="https://www.lime-technologies.se/wp-content/uploads/2020/05/Product-logos-Preview.png"
                alt="Something descriptive"
                type="image/jpg"
            />
        );
    }
}
