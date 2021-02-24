import { Component, Element, h, Prop, Watch } from '@stencil/core';

/**
 * This is a smart component that detects most common file types such as
 * image, audio, video, or text files,
 * and renders them properly using native HTML5 elements.
 *
 * :::note
 * Image files will always be contained in their containers, which means
 * they automatically increases or decreases in size to fill the box
 * whilst preserving thier aspect-ratio.
 *
 * Text and PDF files will also always respect the width and height of the
 * container in which the `limel-file-viewer` is loaded.
 * :::
 *
 * For some file types such as text and images, the component will display a
 * download button and a button to open the file in a new browser tab.
 * This will allow users to preview the file in a fullscreen more with the
 * browser and take advantage of for example native zooming and panning
 * functionalities.
 *
 *:::note
 * The download button will not work in this documentation, since example files
 * are not hosted in the same domain.
 *:::
 * @exampleComponent limel-example-file-viewer
 * @exampleComponent limel-example-file-viewer-with-picker
 */

@Component({
    tag: 'limel-file-viewer',
    shadow: true,
    styleUrl: 'file-viewer.scss',
})
export class FileViewer {
    /**
     * Link to the file
     */
    @Prop({ reflect: true })
    public url: string;

    /**
     * Alternative text for assistive technologies and screen readers
     */
    @Prop({ reflect: true })
    public alt: string;

    /**
     * The file type
     */
    @Prop({ reflect: true })
    public type: string;

    /**
     * Title of the button that downloads the file
     */
    @Prop({ reflect: true })
    public titleDownload: string = 'Download';

    /**
     * Title of the button that opens the file in a new browser tab
     */
    @Prop({ reflect: true })
    public titleOpenInNewTab: string = 'Open in a new tab';

    /**
     * Title of the button that opens the file for fullscreen viewing
     */
    @Prop({ reflect: true })
    public titleOpenInFullscreen: string = 'Open in fullscreen';

    /**
     * Title of the button that exists the fullscreen mode
     */
    @Prop({ reflect: true })
    public titleExitFullscreen: string = 'Exit fullscreen';

    /**
     * Message which will be displayed when the file type is not supported
     */
    @Prop({ reflect: true })
    public messageNoFileTypeSupport: string = 'Cannot display this file!';

    @Element()
    public HostElement: HTMLLimelFileViewerElement;

    constructor() {
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
    }

    public render() {
        if (!this.url) {
            return;
        }

        if (!this.type) {
            return this.renderNoFileSupportMessage();
        }

        if (this.type.startsWith('image/')) {
            return [
                this.renderButtons(),
                <img src={this.url} alt={this.alt} />,
            ];
        }

        if (this.type === 'application/pdf') {
            return <object data={this.url} type={this.type} />;
        }

        if (this.type === 'text/plain') {
            return [
                this.renderButtons(),
                <object data={this.url} type={this.type} />
            ];
        }

        if (this.type.startsWith('audio/')) {
            return (
                <audio controls>
                    <source src={this.url} type={this.type} />
                </audio>
            );
        }

        if (this.type.startsWith('video/')) {
            return (
                <video controls>
                    <source src={this.url} type={this.type} />
                </video>
            );
        }

        return this.renderNoFileSupportMessage();
    }

    private renderNoFileSupportMessage() {
        return (
            <div class="no-support">
                <div class="no-support__info">
                    <limel-icon
                        class="icon--warning"
                        name="brake_warning"
                        size="large"
                    ></limel-icon>
                    <div>{this.messageNoFileTypeSupport}</div>
                </div>
                <a
                    href={this.url}
                    title="download"
                    class="button--download"
                    download
                >
                    <limel-icon name="download_2" size="large" />
                </a>
            </div>
        );
    }

    private renderButtons() {
        return (
            <div class="buttons">
                <a
                    class="button--exit-fullscreen"
                    onClick={this.toggleFullScreen}
                    title={this.titleExitFullscreen}
                >
                    <limel-icon name="multiply" size="small" />
                </a>
                <a
                    class="button--enter-fullscreen"
                    onClick={this.toggleFullScreen}
                    title={this.titleOpenInFullscreen}
                >
                    <limel-icon name="fit_to_width" size="small" />
                </a>
                <a
                    href={this.url}
                    title={this.titleDownload}
                    class="button--download"
                    download
                >
                    <limel-icon name="download_2" size="small" />
                </a>
                <a
                    class="button--new-tab"
                    href={this.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={this.titleOpenInNewTab}
                >
                    <limel-icon name="external_link" size="small" />
                </a>
            </div>
        );
    }

    private toggleFullScreen() {
        if (!document.fullscreenElement) {
            this.HostElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}
