import { Component, h } from '@stencil/core';

/**
 * Some text
 */
@Component({
    tag: 'limel-example-file-viewer',
    shadow: true,
    styleUrl: 'file-viewer.scss',
})
export class FileViewerExample {
    public render() {
        return [
            <h4>Image</h4>,
            <limel-file-viewer
                url="https://media-exp1.licdn.com/dms/image/C561BAQFNY8Ei6v1CSA/company-background_10000/0/1568387658609?e=1614247200&v=beta&t=EbxZQba3cqJ3wtX9Hx1weDjNR--kXxMqJpNmkBUghBQ"
                alt="Some of the people working at Lime Technologies"
                type="image/jpg"
            />,
            <h4>PDF</h4>,
            <limel-file-viewer
                url="https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf"
                type="application/pdf"
            />,
            <h4>Text</h4>,
            <limel-file-viewer
                url="https://filesamples.com/samples/document/txt/sample1.txt"
                type="text/plain"
            />,
            <h4>Audio</h4>,
            <limel-file-viewer
                url="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3"
                type="audio/mpeg"
            />,
            <h4>Video</h4>,
            <limel-file-viewer
                url="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1280_10MG.mp4"
                type="video/mp4"
            />,
            <h4>Zip (unsupported file type)</h4>,
            <limel-file-viewer
                url="https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip"
                type="application/zip"
            />,
        ];
    }
}
