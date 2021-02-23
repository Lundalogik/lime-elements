import { Component, h } from '@stencil/core';

/**
 * Some text
 */
@Component({
    tag: 'limel-example-file-viewer-image',
    shadow: true,
})
export class FileViewerExample {
    public render() {
        return [
            <limel-file-viewer
                url="https://jobs.lime-technologies.com/wp-content/uploads/2020/04/Traineer-ad.jpg"
                alt="Some of the people working at Lime Technologies"
                type="image/jpg"
            />,
            <limel-file-viewer
                url="https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf"
                type="application/pdf"
            />,
            <limel-file-viewer
                url="https://filesamples.com/samples/document/txt/sample1.txt"
                type="text/plain"
            />,
            <limel-file-viewer
                url="https://github.com/caseyohara/campfire-sounds/raw/gh-pages/sounds/trombone.mp3"
                type="audio/mpeg"
            />,
            <limel-file-viewer
                url="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
                type="video/mp4"
            />,
        ];
    }
}
