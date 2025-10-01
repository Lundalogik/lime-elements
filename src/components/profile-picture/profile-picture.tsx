import {
    Component,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { FileInfo } from '../../global/shared-types/file.types';
import { isTypeAccepted } from '../../util/files';
import { Icon } from '../../global/shared-types/icon.types';
import { getIconName } from '../icon/get-icon-props';
import translate from '../../global/translations';
import { Languages } from '../date-picker/date.types';
import { createRandomString } from '../../util/random-string';
import { resizeImage, ResizeOptions } from '../../util/image-resize';

/**
 * This component displays a profile picture, while allowing the user
 * to change it via a file input or drag-and-drop.
 *
 * It supports client-side image resizing and conversion,
 * as well as a simple lazy-loading mechanism.
 *
 * @exampleComponent limel-example-profile-picture-basic
 * @exampleComponent limel-example-profile-picture-helper-text
 * @exampleComponent limel-example-profile-picture-icon
 * @exampleComponent limel-example-profile-picture-with-value
 * @exampleComponent limel-example-profile-picture-loading
 * @exampleComponent limel-example-profile-picture-image-fit
 * @exampleComponent limel-example-profile-picture-composite
 * @exampleComponent limel-example-profile-picture-resize-contain
 * @exampleComponent limel-example-profile-picture-resize-cover
 * @exampleComponent limel-example-profile-picture-resize-fallback
 * @exampleComponent limel-example-profile-picture-styling
 * @beta
 */
@Component({
    tag: 'limel-profile-picture',
    shadow: true,
    styleUrl: 'profile-picture.scss',
})
export class ProfilePicture {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Accessible label for the the browse button.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Placeholder icon of the component, displayed when no image is present.
     */
    @Prop()
    public icon: string | Icon = 'user';

    /**
     * Helper text shown as a tooltip on hover or focus.
     */
    @Prop()
    public helperText?: string;

    /**
     * Disables user interaction.
     * Prevents uploading new pictures or removing existing ones.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Readonly prevents changing the value but allows interaction like focus.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Marks the control as required.
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * Marks the control as invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Set to `true` to put the component in the `loading` state,
     * and render an indeterminate progress indicator inside.
     * This does _not_ disable the interactivity of the component!
     */
    @Prop({ reflect: true })
    public loading = false;

    /**
     * Current image to display. Either a URL string or a `FileInfo` with an href.
     */
    @Prop()
    public value?: string | FileInfo;

    /**
     * How the image should fit within the container.
     * - `cover` will fill the container and crop excess parts.
     * - `contain` will scale the image to fit within the container without cropping.
     */
    @Prop({ reflect: true })
    public imageFit: 'cover' | 'contain' = 'cover';

    /**
     * A comma-separated list of accepted file types.
     */
    @Prop({ reflect: true })
    public accept: string =
        'image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic';

    /**
     * Optional client-side resize before emitting the file.
     * If provided, the selected image will be resized on the client device.
     * :::note
     * HEIC may not decode in all browsers; when decoding fails, the original
     * file will be emitted. See the examples for more info.
     * :::
     */
    @Prop()
    public resize?: ResizeOptions;

    /**
     * Emitted when the picture changes (first FileInfo only).
     */
    @Event()
    public change: EventEmitter<FileInfo | undefined>;

    /**
     * Emitted when a file is rejected by accept filter.
     */
    @Event()
    public filesRejected: EventEmitter<FileInfo[]>;

    @State()
    private objectUrl?: string;

    @State()
    private imageError = false;

    @State()
    private isErrorMessagePopoverOpen = false;

    private removeButtonId = createRandomString();
    private browseButtonId = createRandomString();

    public disconnectedCallback() {
        this.revokeObjectUrl();
    }

    @Watch('value')
    protected handleValueChange() {
        // Clear previously created object URL when value changes
        this.revokeObjectUrl();
        this.imageError = false;

        // If a new File without href is provided, create an object URL for preview
        const currentValue = this.value;
        if (
            currentValue &&
            typeof currentValue !== 'string' &&
            !currentValue.href &&
            currentValue.fileContent instanceof File
        ) {
            this.objectUrl = URL.createObjectURL(currentValue.fileContent);
        }
    }

    public render() {
        const hostClassNames = {
            'has-image-error': this.imageError,
        };

        if (this.readonly) {
            return <Host class={hostClassNames}>{this.renderAvatar()}</Host>;
        }

        return (
            <Host class={hostClassNames}>
                <limel-file-dropzone
                    disabled={this.disabled}
                    accept={this.accept}
                    onFilesSelected={this.handleNewFiles}
                    onFilesRejected={this.handleRejectedFiles}
                >
                    <limel-file-input
                        accept={this.accept}
                        disabled={this.disabled}
                        aria-required={this.required ? 'true' : undefined}
                        aria-invalid={this.invalid ? 'true' : undefined}
                    >
                        {this.renderBrowseButton()}
                    </limel-file-input>
                </limel-file-dropzone>
                {this.renderClearButton()}
                {this.renderSpinner()}
                {this.renderErrorMessage()}
                {this.renderHelperText()}
            </Host>
        );
    }

    private get hasValue(): boolean {
        if (typeof this.value === 'string') {
            return !!this.value;
        }

        if (this.value && (this.value.href || this.value.fileContent)) {
            return true;
        }

        return !!this.objectUrl;
    }

    private renderBrowseButton() {
        return (
            <button
                id={this.browseButtonId}
                type="button"
                class="avatar"
                disabled={this.disabled}
                aria-label={this.label}
                aria-busy={this.loading ? 'true' : 'false'}
                aria-live="polite"
            >
                {this.renderAvatar()}
            </button>
        );
    }

    private renderAvatar() {
        const src = this.getImageSrc();

        if (src) {
            return (
                <img
                    src={src}
                    alt=""
                    style={{
                        '--limel-profile-picture-object-fit': this.imageFit,
                    }}
                    loading="lazy"
                    onError={this.onImageError}
                />
            );
        }

        return this.renderIcon();
    }

    private renderIcon() {
        const icon = getIconName(this.icon);

        return (
            <limel-icon
                name={icon}
                style={{
                    color: `${(this.icon as Icon)?.color}`,
                    'background-color': `${
                        (this.icon as Icon)?.backgroundColor
                    }`,
                }}
            />
        );
    }

    private renderClearButton() {
        if (!this.hasValue || this.disabled) {
            return;
        }

        return [
            <button
                class="remove"
                type="button"
                id={this.removeButtonId}
                onClick={this.handleClear}
            />,
            <limel-tooltip
                label={this.getTranslation('profile-picture.remove')}
                elementId={this.removeButtonId}
            />,
        ];
    }

    private renderSpinner() {
        if (!this.loading) {
            return;
        }

        return <limel-spinner />;
    }

    private renderHelperText = () => {
        if (!this.helperText) {
            return;
        }

        return (
            <limel-tooltip
                elementId={this.browseButtonId}
                label={this.helperText}
            />
        );
    };

    // Collects derived flags used for deciding whether to show the unsupported preview message
    private getUnsupportedPreviewContext() {
        const currentValue = this.value;
        const hasNoSrc = !this.getImageSrc();
        const hasLocalFile = !!(
            currentValue &&
            typeof currentValue !== 'string' &&
            currentValue.fileContent instanceof File &&
            !currentValue.href
        );
        const isResizeConfigured = !!this.resize;

        return { hasNoSrc, hasLocalFile, isResizeConfigured };
    }

    private shouldShowErrorMessage(): boolean {
        const { hasNoSrc, hasLocalFile, isResizeConfigured } =
            this.getUnsupportedPreviewContext();

        return (
            (hasNoSrc || this.imageError) && hasLocalFile && isResizeConfigured
        );
    }

    // Shows a non-intrusive note when there is a File without href and no object URL, which
    // can happen if the browser failed to decode the source (e.g., HEIC in Chromium).
    private renderErrorMessage() {
        if (!this.shouldShowErrorMessage()) {
            return;
        }

        const errorIcon = {
            name: 'error',
            color: 'rgb(var(--color-orange-dark))',
        };
        const errorMessageStyles = {
            maxWidth: '20rem',
            borderRadius: '0.75rem',
        };
        return (
            <limel-popover
                open={this.isErrorMessagePopoverOpen}
                onClick={this.openPopover}
                onClose={this.onPopoverClose}
            >
                <limel-icon-button
                    slot="trigger"
                    elevated={true}
                    icon={errorIcon}
                    aria-live="polite"
                    label={this.getTranslation(
                        'profile-picture.unsupported-preview.title'
                    )}
                />
                <limel-callout
                    type="warning"
                    style={errorMessageStyles}
                    heading={this.getTranslation(
                        'profile-picture.unsupported-preview.title'
                    )}
                >
                    {this.getTranslation(
                        'profile-picture.unsupported-preview.description'
                    )}
                </limel-callout>
            </limel-popover>
        );
    }

    private handleNewFiles = async (event: CustomEvent<FileInfo[]>) => {
        event.stopPropagation();
        if (this.disabled) {
            return;
        }

        const file = event.detail?.[0];
        if (!file) {
            return;
        }

        if (!isTypeAccepted(file, this.accept)) {
            this.filesRejected.emit([file]);
            return;
        }

        this.revokeObjectUrl();
        this.imageError = false;

        let out = file;

        // Optional client-side resize
        if (this.resize && file.fileContent instanceof File) {
            try {
                const processed = await resizeImage(file.fileContent, {
                    ...this.resize,
                    fit: this.resize.fit ?? this.imageFit,
                });
                out = {
                    ...file,
                    filename: processed.name,
                    size: processed.size,
                    contentType: processed.type,
                    fileContent: processed,
                };
            } catch {
                // Fall back to original file if resize fails
                out = file;
            }
        }
        // Create an object URL for immediate preview if no href present
        if (!out.href && out.fileContent instanceof File) {
            this.objectUrl = URL.createObjectURL(out.fileContent);
        }
        this.change.emit(out);
    };

    private handleRejectedFiles = (event: CustomEvent<FileInfo[]>) => {
        event.stopPropagation();
        this.filesRejected.emit(event.detail);
    };

    private getImageSrc(): string | undefined {
        if (!this.value) {
            return this.objectUrl; // Could be set from last selection before parent consumes
        }

        if (typeof this.value === 'string') {
            return this.value;
        }

        if (this.value.href) {
            return this.value.href;
        }

        if (this.value.fileContent instanceof File) {
            return this.objectUrl;
        }

        return undefined;
    }

    private revokeObjectUrl() {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = undefined;
        }
    }

    private handleClear = (event: Event) => {
        event.stopPropagation();
        this.revokeObjectUrl();
        this.imageError = false;
        this.change.emit(undefined);
    };

    private onImageError = () => {
        this.imageError = true;
    };

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.isErrorMessagePopoverOpen = true;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        this.isErrorMessagePopoverOpen = false;
    };

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };
}
