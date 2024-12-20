import { Component, h } from '@stencil/core';

/**
 * Using inbuilt actions
 *
 * The component offers a few inbuilt actions that enable users
 * to download the file, open it in a new tab, or view it in fullscreen mode.
 *
 * :::note
 * These action buttons do not get rendered for the office files,
 * because the 3rd-party office viewers already offer the same features
 * in their UI.
 * :::
 *
 * :::important
 * The download button will not work here in this example,
 * due to the security policies of the web browsers.
 * This is because the example files are not hosted in the same domain.
 * :::
 */
@Component({
    tag: 'limel-example-file-viewer-inbuilt-actions',
    shadow: true,
    styleUrl: 'file-viewer-inbuilt-actions.scss',
})
export class FileViewerInbuiltActionsExample {
    public render() {
        return [
            <limel-file-viewer
                url="https://unsplash.it/1280/720/?random"
                alt="Some random picture form Unsplash"
                filename="random-image.jpg"
                allowFullscreen={true}
                allowOpenInNewTab={true}
                allowDownload={true}
            />,
            <limel-file-viewer
                class="hosted-on-the-same-domain"
                url="https://lundalogik.github.io/lime-elements/versions/latest/favicon.svg"
                allowFullscreen={true}
                allowOpenInNewTab={true}
                allowDownload={true}
            />,
        ];
    }
}
