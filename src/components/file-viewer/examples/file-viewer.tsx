import { Component, h } from '@stencil/core';
/**
 * Most common file types
 *
 * These are file formats that any web browser can display,
 * without relying on any third-party plugins or additional
 * plugins or extensions.
 */
@Component({
    tag: 'limel-example-file-viewer',
    shadow: true,
    styleUrl: 'file-viewer.scss',
})
export class FileViewerExample {
    private fileViewers = [
        {
            title: 'Image',
            url: 'https://www.lime-technologies.se/wp-content/uploads/2021/02/SummerParty-8-scaled.jpg',
            alt: 'Some of the people working at Lime Technologies',
        },
        {
            title: 'Vector graphic',
            url: 'https://lundalogik.github.io/lime-elements/versions/next/favicon.svg',
            alt: 'Logo of Lime Elements',
        },
        {
            title: 'PDF',
            url: 'https://investors.lime-technologies.com/wp-content/uploads/2023/04/Sustainability-report-2022.pdf',
        },
        {
            title: 'Text',
            url: 'https://filesamples.com/samples/document/txt/sample1.txt',
        },
        {
            title: 'Audio',
            url: 'https://filesamples.com/samples/audio/wav/sample1.wav',
        },
        {
            title: 'Video',
            url: 'https://filesamples.com/samples/video/mp4/sample_960x540.mp4',
        },
        {
            title: 'Unsupported file type',
            url: 'https://filesamples.com/samples/font/bin/SourceCodePro-Regular.bin',
        },
    ];

    public render() {
        return this.fileViewers.map(this.renderFileViewer);
    }

    private renderFileViewer(fileViewer: any) {
        return [
            <h4>{fileViewer.title}</h4>,
            <limel-file-viewer url={fileViewer.url} alt={fileViewer.alt} />,
        ];
    }
}
