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
import { EmailAttachment } from '../../util/email';
import { formatBytes } from '../../util/format-bytes';

/**
 * This is a private component, used to render `.eml` files inside
 * `limel-file-viewer`.
 *
 * :::note
 * If `bodyHtml` is provided, it will be rendered using `innerHTML`.
 * :::
 *
 * @exampleComponent limel-example-email-viewer-plain-text
 * @exampleComponent limel-example-email-viewer-inline-image
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
     * RFC 5322 Date header.
     */
    @Prop({ reflect: true })
    public date?: string;

    /**
     * From header.
     */
    @Prop({ reflect: true })
    public from?: string;

    /**
     * To header.
     *
     * If multiple recipients are provided, they should be separated by commas.
     * When rendering, this component splits the list on commas that are
     * outside quoted strings and outside angle-bracketed address parts.
     *
     * If a display name contains a comma, it should be quoted, e.g.
     * `"Doe, Jane" <jane.doe@example.com>`.
     */
    @Prop({ reflect: true })
    public to?: string;

    /**
     * Cc header.
     *
     * Behaves like `to`: multiple recipients can be provided as a comma-separated
     * list, and the list is split on commas outside quotes and outside `<...>`.
     */
    @Prop({ reflect: true })
    public cc?: string;

    /**
     * Subject header.
     */
    @Prop({ reflect: true })
    public subject?: string;

    /**
     * HTML email body.
     */
    @Prop()
    public bodyHtml?: string;

    /**
     * Plain text email body.
     */
    @Prop()
    public bodyText?: string;

    /**
     * List of non-inline attachments.
     */
    @Prop()
    public attachments?: EmailAttachment[];

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
     */
    @Event()
    public allowRemoteImagesChange: EventEmitter<boolean>;

    @Watch('bodyHtml')
    public onBodyHtmlChange() {
        if (this.allowRemoteImages === undefined) {
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
        return (
            <div class="email-headers" part="email-headers">
                {this.renderEmailHeader(
                    'subject',
                    this.getTranslation('file-viewer.email.subject'),
                    this.subject
                )}
                {this.renderEmailHeader(
                    'from',
                    this.getTranslation('file-viewer.email.from'),
                    this.from
                )}
                {this.renderEmailHeader(
                    'to',
                    this.getTranslation('file-viewer.email.to'),
                    this.to
                )}
                {this.renderEmailHeader(
                    'cc',
                    this.getTranslation('file-viewer.email.cc'),
                    this.cc
                )}
                {this.renderEmailHeader(
                    'date',
                    this.getTranslation('file-viewer.email.date'),
                    this.date
                )}
            </div>
        );
    }

    private renderBody() {
        if (this.bodyHtml) {
            const bodyHtml = applyRemoteImagesPolicy(
                this.bodyHtml,
                this.getAllowRemoteImages()
            );

            return <div class="body" innerHTML={bodyHtml} part="email-body" />;
        }

        if (this.bodyText) {
            return (
                <pre class="body plain-text" part="email-body">
                    {this.bodyText}
                </pre>
            );
        }

        if (this.fallbackUrl) {
            return (
                <object data={this.fallbackUrl} type="text/plain">
                    <slot name="fallback" />
                </object>
            );
        }

        return <slot name="fallback" />;
    }

    private renderEmailHeader(
        type: 'subject' | 'from' | 'to' | 'cc' | 'date',
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

    private getHeaderValues(
        type: 'subject' | 'from' | 'to' | 'cc' | 'date',
        value: string
    ): string[] {
        if (type === 'to' || type === 'cc') {
            return splitEmailAddressList(value);
        }

        return [value];
    }

    private renderAttachments() {
        if (!this.attachments || this.attachments.length === 0) {
            return;
        }

        const label = this.getTranslation('file-viewer.email.attachments');

        return (
            <div class="attachments">
                <span>{label}</span>
                <ul>
                    {this.attachments.map((attachment, index) => (
                        <li key={`attachment-${index}`}>
                            <span class="attachment-filename">
                                {attachment.filename?.trim() ||
                                    this.getTranslation(
                                        'file-viewer.email.attachment.unnamed'
                                    )}
                            </span>
                            <span class="attachment-mime-type">
                                {attachment.mimeType?.trim()}
                            </span>
                            {this.renderSizeBadge(attachment.size)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private renderSizeBadge(size: number) {
        if (typeof size !== 'number') {
            return;
        }
        return (
            <limel-badge class="attachment-size" label={formatBytes(size)} />
        );
    }

    private getTranslation(key: string) {
        return translate.get(key, this.language);
    }

    private shouldShowRemoteImagesBanner(): boolean {
        return Boolean(
            this.bodyHtml &&
                containsRemoteImages(this.bodyHtml) &&
                !this.getAllowRemoteImages()
        );
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

function containsRemoteImages(html: string): boolean {
    return html.includes('data-remote-src');
}

function applyRemoteImagesPolicy(html: string, allowRemoteImages: boolean) {
    if (!allowRemoteImages) {
        return html;
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    const images = document.querySelectorAll(
        'img[data-remote-src]'
    ) as NodeListOf<HTMLImageElement>;

    for (const image of images) {
        const remoteSrc = image.dataset.remoteSrc;
        if (!remoteSrc || !isAllowedRemoteImageUrl(remoteSrc)) {
            delete image.dataset.remoteSrc;
            continue;
        }

        image.setAttribute('src', remoteSrc);
        delete image.dataset.remoteSrc;
    }

    return document.body.innerHTML;
}

function isAllowedRemoteImageUrl(url: string): boolean {
    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();
    return lower.startsWith('https://') || lower.startsWith('http://');
}

interface AddressListSplitState {
    inQuotes: boolean;
    escapeNext: boolean;
    angleDepth: number;
}

/**
 * Splits a comma-separated email address list (e.g. `To:` / `Cc:`) into individual
 * recipient strings.
 *
 * In RFC 5322, address lists are comma-separated. However, commas can also appear
 * inside quoted display names (quoted-string) and must then be ignored as separators.
 * This splitter only treats a comma as a separator when it is outside quoted strings
 * and outside angle-bracketed address parts (`<...>`).
 *
 * Notes:
 * - If a display name contains a comma, it should be quoted or encoded to be
 *   unambiguous, e.g. `"Doe, Jane" <jane.doe@example.com>` or
 *   `=?UTF-8?Q?Doe,_Jane?= <jane.doe@example.com>`.
 * - Real-world `.eml` files are usually RFC-ish but not always perfectly compliant.
 *   Malformed input with unquoted commas in display names may be split incorrectly.
 *
 * @param value - A comma-separated list of recipients.
 * @returns An array of trimmed recipient strings.
 *
 * @example
 * splitEmailAddressList('"Doe, Jane" <jane@example.com>, Team <team@example.com>');
 * // => ['"Doe, Jane" <jane@example.com>', 'Team <team@example.com>']
 */
function splitEmailAddressList(value: string): string[] {
    const parts: string[] = [];
    let current = '';
    const state: AddressListSplitState = {
        inQuotes: false,
        escapeNext: false,
        angleDepth: 0,
    };

    const append = (character: string) => {
        current += character;
    };

    const flush = () => {
        const trimmed = current.trim();
        if (trimmed) {
            parts.push(trimmed);
        }
        current = '';
    };

    for (const character of value) {
        if (consumeEscaped(character, state, append)) {
            continue;
        }

        if (beginEscape(character, state, append)) {
            continue;
        }

        if (toggleQuote(character, state, append)) {
            continue;
        }

        if (adjustAngleDepth(character, state, append)) {
            continue;
        }

        if (isAddressSeparator(character, state)) {
            flush();
            continue;
        }

        append(character);
    }

    flush();
    return parts;
}

function consumeEscaped(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (!state.escapeNext) {
        return false;
    }

    append(character);
    state.escapeNext = false;
    return true;
}

function beginEscape(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (!state.inQuotes || character !== '\\') {
        return false;
    }

    append(character);
    state.escapeNext = true;
    return true;
}

function toggleQuote(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (character !== '"' || state.angleDepth !== 0) {
        return false;
    }

    append(character);
    state.inQuotes = !state.inQuotes;
    return true;
}

function adjustAngleDepth(
    character: string,
    state: AddressListSplitState,
    append: (character: string) => void
): boolean {
    if (state.inQuotes) {
        return false;
    }

    if (character === '<') {
        append(character);
        state.angleDepth += 1;
        return true;
    }

    if (character !== '>' || state.angleDepth === 0) {
        return false;
    }

    append(character);
    state.angleDepth -= 1;
    return true;
}

function isAddressSeparator(
    character: string,
    state: AddressListSplitState
): boolean {
    return character === ',' && !state.inQuotes && state.angleDepth === 0;
}
