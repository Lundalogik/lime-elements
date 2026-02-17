import {
    Component,
    Event,
    EventEmitter,
    Prop,
    State,
    Watch,
    h,
    Host,
} from '@stencil/core';
import translate from '../../global/translations';
import { Languages } from '../date-picker/date.types';
import { Email, EmailAttachment, EmailHeaderType } from './email-viewer.types';
import { applyRemoteImagesPolicy, containsRemoteImages } from './remote-images';
import { splitEmailAddressList } from './split-email-address-list';
import { formatBytes } from '../../util/format-bytes';

/**
 * This is a private component, used to render `.eml` files inside
 * `limel-file-viewer`.
 *
 * :::note
 * If `bodyHtml` is provided, it will be rendered using `innerHTML`.
 * Consumers should pre-sanitize `bodyHtml` before passing it to the component.
 * :::
 *
 * @exampleComponent limel-example-email-viewer-plain-text
 * @exampleComponent limel-example-email-viewer-inline-image
 * @exampleComponent limel-example-email-viewer-remote-image-policy
 *
 * @private
 */
@Component({
    tag: 'limel-email-viewer',
    styleUrl: 'email-viewer.scss',
    shadow: true,
})
export class EmailViewer {
    /**
     * The email message to display.
     *
     * If `email.bodyHtml` is set directly, consumers must provide sanitized
     * HTML.
     */
    @Prop()
    public email?: Email;

    /**
     * Optional URL to render as a final fallback using an `<object type="text/plain">`.
     */
    @Prop({ reflect: true })
    public fallbackUrl?: string;

    /**
     * Defines the localization for translations.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Controls whether remote images (http/https) are loaded.
     *
     * If omitted, the component treats this as a per-email setting.
     * Consumers that want to remember the choice (per session/global) can
     * provide this prop and listen for `allowRemoteImagesChange`.
     */
    @Prop()
    public allowRemoteImages?: boolean;

    @State()
    private allowRemoteImagesState = false;

    /**
     * Emitted when the user requests remote images to be loaded.
     *
     * @internal
     */
    @Event()
    public allowRemoteImagesChange: EventEmitter<boolean>;

    @Watch('email')
    protected resetAllowRemoteImages(newEmail?: Email, oldEmail?: Email) {
        if (!newEmail) {
            this.allowRemoteImagesState = false;
            return;
        }

        if (newEmail.from !== oldEmail?.from) {
            this.allowRemoteImagesState = false;
        }
    }

    public render() {
        return (
            <Host>
                <div class="email" part="email">
                    {this.renderHeaders()}
                    {this.renderRemoteImageBanner()}
                    <section>
                        {this.renderAttachments()}
                        {this.renderBody()}
                    </section>
                </div>
            </Host>
        );
    }

    private renderHeaders() {
        const headerFields: EmailHeaderType[] = [
            'subject',
            'from',
            'to',
            'cc',
            'date',
        ];

        return (
            <div class="email-headers" part="email-headers">
                {headerFields.map((type) =>
                    this.renderEmailHeader(
                        type,
                        this.getTranslation(`file-viewer.email.${type}`),
                        this.email?.[type]
                    )
                )}
            </div>
        );
    }

    private renderBody() {
        return (
            this.renderBodyHtml() ||
            this.renderBodyText() ||
            this.renderFallbackUrl() || <slot name="fallback" />
        );
    }

    private renderBodyHtml() {
        const bodyHtml = this.email?.bodyHtml;
        if (!bodyHtml) {
            return;
        }

        const innerHtml = applyRemoteImagesPolicy(
            bodyHtml,
            this.getAllowRemoteImages()
        );

        return <div class="body" innerHTML={innerHtml} part="email-body" />;
    }

    private renderBodyText() {
        const bodyText = this.email?.bodyText;
        if (!bodyText) {
            return;
        }

        return (
            <pre class="body plain-text" part="email-body">
                {bodyText}
            </pre>
        );
    }

    private renderFallbackUrl() {
        if (!this.fallbackUrl) {
            return;
        }

        return (
            <object data={this.fallbackUrl} type="text/plain">
                <slot name="fallback" />
            </object>
        );
    }

    private renderEmailHeader(
        type: EmailHeaderType,
        label: string,
        value?: string
    ) {
        if (!value) {
            return;
        }

        const values = this.getHeaderValues(type, value);

        return (
            <dl class={`headers ${type}`}>
                <dt>{label}</dt>
                {values.map((headerValue, index) => (
                    <dd key={`${type}-${index}`}>{headerValue}</dd>
                ))}
            </dl>
        );
    }

    private getHeaderValues(type: EmailHeaderType, value: string): string[] {
        if (type === 'to' || type === 'cc') {
            return splitEmailAddressList(value);
        }

        return [value];
    }

    private renderAttachments() {
        const attachments = this.email?.attachments;
        if (!attachments?.length) {
            return;
        }

        const label = this.getTranslation('file-viewer.email.attachments');

        return (
            <div class="attachments">
                <span>{label}</span>
                <ul>
                    {attachments.map((attachment, index) =>
                        this.renderAttachment(attachment, index)
                    )}
                </ul>
            </div>
        );
    }

    private renderAttachment = (attachment: EmailAttachment, index: number) => {
        const filename =
            attachment.filename?.trim() ||
            this.getTranslation('file-viewer.email.attachment.unnamed');
        const mimeType = attachment.mimeType?.trim() || '';
        return (
            <li key={`attachment-${index}`}>
                <span class="attachment-filename">{filename}</span>
                <span class="attachment-mime-type"> {mimeType}</span>
                {this.renderSizeBadge(attachment.size)}
            </li>
        );
    };

    private renderSizeBadge = (size?: number) => {
        if (typeof size !== 'number') {
            return;
        }
        return (
            <limel-badge class="attachment-size" label={formatBytes(size)} />
        );
    };

    private getTranslation(key: string) {
        return translate.get(key, this.language);
    }

    private shouldShowRemoteImagesBanner(): boolean {
        const bodyHtml = this.email?.bodyHtml;
        if (!bodyHtml || this.getAllowRemoteImages()) {
            return false;
        }

        return containsRemoteImages(bodyHtml);
    }

    private renderRemoteImageBanner() {
        if (!this.shouldShowRemoteImagesBanner()) {
            return;
        }
        const icon = {
            name: 'warning_shield',
            color: 'rgb(var(--color-orange-default))',
        };
        const heading = this.getTranslation(
            'file-viewer.email.remote-images.warning'
        );
        const description = this.getTranslation(
            'file-viewer.email.remote-images.warning.description'
        );
        const buttonLabel = this.getTranslation(
            'file-viewer.email.remote-images.load'
        );

        return (
            <limel-collapsible-section
                header={heading}
                icon={icon}
                language={this.language}
            >
                <button
                    type="button"
                    class="load-images"
                    slot="header"
                    onClick={this.onEnableRemoteImagesClick}
                >
                    {buttonLabel}
                </button>
                <limel-markdown value={description} />
            </limel-collapsible-section>
        );
    }

    private onEnableRemoteImagesClick = (event?: Event) => {
        event?.stopPropagation?.();
        this.enableRemoteImages();
    };

    private enableRemoteImages = () => {
        if (this.allowRemoteImages !== undefined) {
            this.allowRemoteImagesChange.emit(true);
            return;
        }

        this.allowRemoteImagesState = true;
    };

    private getAllowRemoteImages(): boolean {
        return this.allowRemoteImages ?? this.allowRemoteImagesState;
    }
}
