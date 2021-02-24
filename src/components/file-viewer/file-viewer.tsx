import { Component, Element, h, Prop, Watch } from '@stencil/core';

/**
 * This is a smart component that detects most common file types such as
 * image, audio, video, or text files,
 * and renders them properly using native HTML5 elements.
 * ::: note
 * Image files will always be contained in their containers, which means
 * they automatically increases or decreases in size to fill the box
 * whilst preserving thier aspect-ratio.
 * :::
 *
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
    public titleNewTab: string = 'Open in a new tab';

    /**
     * Message which will be displayed when the file type is not supported
     */
    @Prop({ reflect: true })
    public noFileTypeSupportMessage: string = 'Cannot display this file!';

    public render() {
        if (!this.type) {
            return;
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
                    <div>{this.noFileTypeSupportMessage}</div>
                </div>
                <a
                    href={this.url}
                    title="download"
                    class="button--download"
                    download>
                    <limel-icon name="download_2" size="large" />
                </a>
            </div>
        );
    }

    private renderButtons() {
        return (
            <div class="buttons">
                <a
                    class="button--new-tab"
                    href={this.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={this.titleNewTab}
                >
                    <limel-icon name="external_link" size="small" />
                </a>
                <a
                    href={this.url}
                    title={this.titleDownload}
                    class="button--download"
                    download>
                    <limel-icon name="download_2" size="small" />
                </a>
            </div>
        );
    }
}
