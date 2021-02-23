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
        return [
            <limel-file-preview
                url="https://www.lime-technologies.se/wp-content/uploads/2020/05/Product-logos-Preview.png"
                alt="Something descriptive"
                type="image/jpg"
            />,
            <limel-file-preview
                url="https://www.skolverket.se/download/18.49f081e1610d887500ae7/1573116091500/information-np-ak9-engelska.pdf"
                alt="Something descriptive"
                type="application/pdf"
            />,
            <limel-file-preview
                url="https://filesamples.com/samples/document/txt/sample1.txt"
                alt="Something descriptive"
                type="text/plain"
            />,
            <limel-file-preview
                url="https://github.com/caseyohara/campfire-sounds/raw/gh-pages/sounds/trombone.mp3"
                alt="Something descriptive"
                type="audio/mpeg"
            />,
            <limel-file-preview
                url="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
                alt="Something descriptive"
                type="video/mp4"
            />,
        ];
    }
}
