import { Languages } from '@limetech/lime-elements';
import translate from '../../global/translations';
import { Component, Element, h, Prop } from '@stencil/core';

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
     * Alternative text for assistive technologies and screen readers, displayed for image files
     */
    @Prop({ reflect: true })
    public alt: string;

    /**
     * The MIME content type of the file, such as text/plain, application/pdf, etc.
     */
    @Prop({ reflect: true })
    public type: string;

    /**
     * Defines the localisation for translations.
     */
    @Prop()
    public language: Languages = 'en';

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

        return (
            this.renderImage() ||
            this.renderAudio() ||
            this.renderVideo() ||
            this.renderObject()
        );
    }

    private renderImage() {
        if (this.type.startsWith('image/')) {
            return [
                this.renderButtons(),
                <img src={this.url} alt={this.alt} />,
            ];
        }
    }

    private renderObject() {
        const objectElement = (
            <object data={this.url} type={this.type}>
                {this.renderNoFileSupportMessage()}
            </object>
        );

        if (this.type === 'application/pdf') {
            return objectElement;
        }

        return [this.renderButtons(), objectElement];
    }

    private renderAudio() {
        if (this.type.startsWith('audio/')) {
            return (
                <audio controls>
                    <source src={this.url} type={this.type} />
                    {this.renderNoFileSupportMessage()}
                </audio>
            );
        }
    }

    private renderVideo() {
        if (this.type.startsWith('video/')) {
            return (
                <video controls>
                    <source src={this.url} type={this.type} />
                    {this.renderNoFileSupportMessage()}
                </video>
            );
        }
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
                    <div>
                        {this.getTranslation('message.unsupported-filetype')}
                    </div>
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
                    title={this.getTranslation('title.exit-fullscreen')}
                >
                    <limel-icon name="multiply" size="small" />
                </a>
                <a
                    class="button--enter-fullscreen"
                    onClick={this.toggleFullScreen}
                    title={this.getTranslation('title.open-in-fullscreen')}
                >
                    <limel-icon name="fit_to_width" size="small" />
                </a>
                <a
                    href={this.url}
                    title={this.getTranslation('title.download')}
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
                    title={this.getTranslation('title.open-in-new-tab')}
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

    private getTranslation(key: string) {
        return translate.get(`file-viewer.${key}`, this.language);
    }
}
