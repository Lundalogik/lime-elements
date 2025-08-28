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
 * @exampleComponent limel-example-profile-picture-basic
 * @exampleComponent limel-example-profile-picture-icon
 * @exampleComponent limel-example-profile-picture-with-value
 * @exampleComponent limel-example-profile-picture-composite
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
     * Helper text shown on drag overlay.
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
     * Accepted file types.
     */
    @Prop({ reflect: true })
    public accept: string =
        'image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic';

    /**
     * Optional client-side resize before emitting the file.
     * If provided, the selected image will be resized on the client device.
     * Note: HEIC may not decode in all browsers; when decoding fails, the original
     * file will be emitted.
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

    private removeButtonId = createRandomString();

    public disconnectedCallback() {
        this.revokeObjectUrl();
    }

    @Watch('value')
    protected handleValueChange() {
        // Clear previously created object URL when value changes
        this.revokeObjectUrl();
    }

    public render() {
        const hostClassNames = {
            'has-value': this.hasValue,
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
                    >
                        {this.renderBrowseButton()}
                    </limel-file-input>
                </limel-file-dropzone>
                {this.renderClearButton()}
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
                class="avatar"
                disabled={this.disabled}
                type="button"
                aria-label={this.label}
                aria-required={this.required ? true : undefined}
                aria-invalid={this.invalid ? true : undefined}
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
                id={this.removeButtonId}
                onClick={this.handleClear}
            />,
            <limel-tooltip
                label={this.getTranslation('profile-picture.remove')}
                elementId={this.removeButtonId}
            />,
        ];
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
            if (!this.objectUrl) {
                this.objectUrl = URL.createObjectURL(this.value.fileContent);
            }

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
        this.value = undefined;
        this.change.emit(undefined);
    };

    private getTranslation = (key: string) => {
        return translate.get(key, this.language);
    };
}
