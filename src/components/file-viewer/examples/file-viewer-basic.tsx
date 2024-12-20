import { Component, h } from '@stencil/core';
/**
 * Most common file types
 *
 * These are file formats that any web browser can display,
 * without relying on any third-party plugins or additional
 * plugins or extensions.
 */
@Component({
    tag: 'limel-example-file-viewer-basic',
    shadow: true,
    styleUrl: 'file-viewer-basic.scss',
})
export class FileViewerExample {
    private fileViewers = [
        {
            title: 'Image',
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/TEIDE.JPG/2880px-TEIDE.JPG',
            alt: 'A synthetic-aperture radar image acquired by the SIR-C/X-SAR radar on board the Space Shuttle Endeavour shows the Teide volcano.',
        },
        {
            title: 'Vector graphic',
            url: 'https://lundalogik.github.io/lime-elements/versions/latest/favicon.svg',
            alt: 'Logo of Lime Elements',
        },
        {
            title: 'PDF',
            url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Example.pdf',
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
