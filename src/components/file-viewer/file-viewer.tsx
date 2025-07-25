import {
    Component,
    Element,
    h,
    Prop,
    State,
    Event,
    EventEmitter,
    Watch,
} from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import { ListItem } from '../list/list-item.types';
import translate from '../../global/translations';
import { detectExtension } from './extension-mapping';
import { Fullscreen } from './fullscreen';
import { FileType, OfficeViewer } from './file-viewer.types';
import { LimelMenuCustomEvent } from '../../components';

/**
 * This is a smart component that automatically detects
 * the most common file types such as image, audio, video, and text,
 * and properly displays them in the browser.
 * The component is also capable to render the most common office files.
 *
 * :::note
 * Image files will always be contained in their containers, which means
 * they automatically increase or decrease in size to fill their containing box
 * whilst preserving their aspect-ratio.
 *
 * Text and PDF files will also always respect the width and height of the
 * container in which the `limel-file-viewer` is loaded.
 * :::
 *
 * For some file types such as text and images, the component will display a
 * download button and a button to open the file in a new browser tab.
 * This will allow users to preview the file in a fullscreen mode with the
 * browser and take advantage of for example native zooming and panning
 * functionalities.
 *
 * @exampleComponent limel-example-file-viewer-basic
 * @exampleComponent limel-example-file-viewer-office
 * @exampleComponent limel-example-file-viewer-filename
 * @exampleComponent limel-example-file-viewer-inbuilt-actions
 * @exampleComponent limel-example-file-viewer-custom-actions
 * @exampleComponent limel-example-file-viewer-with-picker
 *
 * @beta
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
     * The name of the file that must also contains its extension.
     * This overrides the filename that the `url` ends with.
     * Useful when the `url` does not contain the filename.
     * When specified, the `filename` will be used as filename of
     * the downloaded file.
     */
    @Prop({ reflect: true })
    public filename?: string;

    /**
     * An optional alternative text, mainly for assistive technologies and screen readers.
     * It is used for only image files, as an `alt` attribute.
     * Should optimally hold a description of the image,
     * which is also displayed on the page if the image can't be loaded for some reason.
     */
    @Prop({ reflect: true })
    public alt?: string;

    /**
     * Displays a button that allows the user to view the file
     * in fullscreen mode.
     * Not displayed for office files!
     */
    @Prop({ reflect: true })
    public allowFullscreen?: boolean = false;

    /**
     * Displays a button that allows the user to open the file
     * in a new browser tab.
     * Not displayed for office files!
     */
    @Prop({ reflect: true })
    public allowOpenInNewTab?: boolean = false;

    /**
     * Displays a button that allows the user to download the file.
     * Note that due to the browser's security policies,
     * the file should be hosted on the same domain
     * for the download button to work properly.
     * Not displayed for office files!
     */
    @Prop({ reflect: true })
    public allowDownload?: boolean = false;

    /**
     * Defines the localization for translations.
     */
    @Prop()
    public language: Languages = 'en';

    /**
     * Defines the third-party viewer that should be used to render
     * the content of office files, such as word processing documents,
     * presentations, or spreadsheets.
     */
    @Prop({ reflect: true })
    public officeViewer: OfficeViewer = 'microsoft-office';

    /**
     * An array of custom actions that can be displayed
     * as an action menu on the file which is being displayed.
     */
    @Prop()
    public actions: ListItem[];

    /**
     * Emitted when a custom action is selected from the action menu.
     */
    @Event()
    public action: EventEmitter<ListItem>;

    @Element()
    public HostElement: HTMLLimelFileViewerElement;

    private fullscreen: Fullscreen;

    @State()
    private isFullscreen: boolean = false;

    @State()
    private fileType: FileType;

    /**
     * True while the file is being loaded.
     */
    @State()
    private loading: boolean = true;

    @State()
    private fileUrl: string = '';

    constructor() {
        this.fullscreen = new Fullscreen(this.HostElement);
    }

    public async componentWillLoad() {
        this.fileType = detectExtension(this.filename, this.url);
        await this.createURL(this.fileType);
    }

    public render() {
        if (!this.isOfficeFileAccessibleViaURL) {
            return this.renderNoFileSupportMessage();
        }

        if (this.loading) {
            return <limel-spinner size="x-small" limeBranded={false} />;
        }

        return this.renderFileViewer();
    }

    @Watch('url')
    protected async watchUrl(newUrl: string, oldUrl: string) {
        if (newUrl === oldUrl) {
            return;
        }

        this.loading = true;
        this.fileType = detectExtension(this.filename, this.fileUrl);
        await this.createURL(this.fileType);
    }

    private renderFileViewer() {
        const fileViewerFunctions = {
            pdf: this.renderPdf,
            image: this.renderImage,
            video: this.renderVideo,
            audio: this.renderAudio,
            text: this.renderText,
            office: this.renderOffice,
        };
        const fileViewerFunction =
            fileViewerFunctions[this.fileType] ||
            this.renderNoFileSupportMessage;

        return fileViewerFunction();
    }

    private renderPdf = () => {
        return [
            <div class="action-menu-for-pdf-files">
                {this.renderActionMenu()}
            </div>,
            <iframe src={this.fileUrl} loading="lazy" />,
        ];
    };

    private renderImage = () => {
        return [
            this.renderButtons(),
            <img src={this.fileUrl} alt={this.alt} loading="lazy" />,
        ];
    };

    private renderVideo = () => {
        return (
            <video controls>
                <source src={this.fileUrl} />
            </video>
        );
    };

    private renderAudio = () => {
        return (
            <audio controls>
                <source src={this.fileUrl} />
            </audio>
        );
    };

    private renderText = () => {
        return [
            this.renderButtons(),
            <object data={this.fileUrl} type="text/plain">
                {`Text content from: ${this.filename || this.url}`}
                <a
                    href={this.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open text file in new tab
                </a>
            </object>,
        ];
    };

    private renderOffice = () => {
        return [
            <div class="action-menu-for-office-files">
                {this.renderActionMenu()}
            </div>,
            <iframe
                src={
                    this.getOfficeViewerUrl() + this.fileUrl + '&embedded=true'
                }
                loading="lazy"
            />,
        ];
    };

    private isOfficeFileAccessibleViaURL = () => {
        return (
            this.fileType === 'office' &&
            !(
                this.fileUrl.startsWith('http://') ||
                this.fileUrl.startsWith('https://')
            )
        );
    };

    private getOfficeViewerUrl = () => {
        const officeViewers = {
            'microsoft-office':
                'https://view.officeapps.live.com/op/embed.aspx?src=',
            'google-drive': 'https://docs.google.com/gview?url=',
        };

        return officeViewers[this.officeViewer];
    };

    private renderNoFileSupportMessage = () => {
        return (
            <div class="no-support" role="alert">
                <limel-icon
                    class="icon--warning"
                    name="brake_warning"
                    size="large"
                    role="presentation"
                />
                <p>
                    {this.getTranslation(
                        'file-viewer.message.unsupported-filetype'
                    )}
                </p>
                {this.renderDownloadButton()}
            </div>
        );
    };

    private renderButtons = () => {
        return (
            <div class="buttons">
                {this.renderActionMenu()}
                {this.renderToggleFullscreenButton()}
                {this.renderDownloadButton()}
                {this.renderOpenInNewTabButton()}
            </div>
        );
    };

    private renderToggleFullscreenButton = () => {
        if (!this.allowFullscreen || !this.fullscreen.isSupported()) {
            return;
        }

        const icon = this.isFullscreen ? 'multiply' : 'fit_to_width';

        const label = this.isFullscreen
            ? this.getTranslation('file-viewer.exit-fullscreen')
            : this.getTranslation('file-viewer.open-in-fullscreen');

        return [
            <button
                class="button--toggle-fullscreen"
                id="tooltip-toggle-fullscreen"
                role="button"
                onClick={this.handleToggleFullscreen}
            >
                <limel-icon name={icon} />
                <limel-tooltip
                    label={label}
                    elementId="tooltip-toggle-fullscreen"
                    openDirection="left"
                />
            </button>,
        ];
    };

    private renderDownloadButton = () => {
        if (!this.allowDownload || this.isFullscreen) {
            return;
        }

        return (
            <a
                class="button--download"
                id="tooltip-download"
                role="button"
                download={this.filename ?? ''}
                href={this.fileUrl}
                target="_blank"
            >
                <limel-icon name="download_2" />
                <limel-tooltip
                    label={this.getTranslation('file-viewer.download')}
                    elementId="tooltip-download"
                    openDirection="left"
                />
            </a>
        );
    };

    private renderOpenInNewTabButton = () => {
        if (!this.allowOpenInNewTab || this.isFullscreen) {
            return;
        }

        return (
            <a
                class="button--new-tab"
                id="tooltip-new-tab"
                role="button"
                href={this.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <limel-icon name="external_link" />
                <limel-tooltip
                    label={this.getTranslation('file-viewer.open-in-new-tab')}
                    elementId="tooltip-new-tab"
                    openDirection="left"
                />
            </a>
        );
    };

    private renderActionMenu = () => {
        if (!this.actions || this.isFullscreen) {
            return;
        }

        return (
            <limel-menu
                class="action-menu"
                items={this.actions}
                onSelect={this.emitOnAction}
                open-direction="left"
            >
                <button
                    class="button--action"
                    id="tooltip-more"
                    role="button"
                    slot="trigger"
                >
                    <limel-icon name="menu_2" />
                    <limel-tooltip
                        label={this.getTranslation('file-viewer.more-actions')}
                        elementId="tooltip-more"
                        openDirection="left"
                    />
                </button>
            </limel-menu>
        );
    };

    private createURL = async (fileType: string) => {
        if (['pdf'].includes(fileType)) {
            const response = await fetch(this.url);
            const blob = await response.blob();

            this.fileUrl = URL.createObjectURL(blob);
        } else {
            this.fileUrl = this.url;
        }

        this.loading = false;
    };

    private handleToggleFullscreen = () => {
        if (this.fullscreen.isSupported()) {
            this.fullscreen.toggle();
            this.isFullscreen = !this.isFullscreen;
        }
    };

    private emitOnAction = (event: LimelMenuCustomEvent<ListItem>) => {
        event.stopPropagation();
        this.action.emit(event.detail);
    };

    private getTranslation(key: string) {
        return translate.get(key, this.language);
    }
}
