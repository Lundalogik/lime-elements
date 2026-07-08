import translate from '../../global/translations';
import { Chip } from '../chip-set/chip.types';
import { Languages } from '../date-picker/date.types';
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
import {
    getFileBackgroundColor,
    getFileColor,
    getFileExtensionTitle,
    getFileIcon,
} from '../../util/file-metadata';
import { FileInfo } from '../../global/shared-types/file.types';
import { formatBytes } from '../../util/format-bytes';
import {
    resizeImage as resizeImageFile,
    ResizeOptions,
} from '../../util/image-resize';

const DEFAULT_FILE_CHIP: Chip = {
    id: null,
    text: null,
    removable: true,
};

/**
 * This component lets end-users select a *single* file from their device
 * storage. Regardless of the user's device or operating system, this component
 * opens up a file picker dialog that allows the user to choose a file.
 *
 * ## Using correct labels
 *
 * This file picker can be used in different contexts. The component's distinct
 * visual design including the upload icon hints end-users that this is not a
 * normal input field like other fields in the form for example.
 *
 * :::important
 * you need to use a descriptive `label` that clarifies the
 * functionality of the file picker, and/or provides users with clear
 * instructions.
 *
 * Depending on the context, you may need to avoid labels such as:
 * - File
 * - Document
 *
 * and instead consider using labels like:
 * - Attach a file
 * - Upload a file
 * - Choose a document
 * - Choose a file
 *
 * and similar phrases...
 * :::
 *
 * @exampleComponent limel-example-file-basic
 * @exampleComponent limel-example-file-custom-icon
 * @exampleComponent limel-example-file-size-badge
 * @exampleComponent limel-example-file-loading
 * @exampleComponent limel-example-file-per-file-loading
 * @exampleComponent limel-example-file-per-file-progress
 * @exampleComponent limel-example-file-per-file-invalid
 * @exampleComponent limel-example-file-per-file-status
 * @exampleComponent limel-example-file-menu-items
 * @exampleComponent limel-example-file-accepted-types
 * @exampleComponent limel-example-file-resize-image
 * @exampleComponent limel-example-file-resize-mixed
 * @exampleComponent limel-example-file-composite
 */
@Component({
    tag: 'limel-file',
    shadow: true,
    styleUrl: 'file.scss',
})
export class File {
    /**
     * The selected file.
     */
    @Prop()
    public value: FileInfo;

    /**
     * The input label.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Optional helper text to display below the component.
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Set to `true` to indicate that the field is required.
     */
    @Prop({ reflect: true })
    public required: boolean = false;

    /**
     * True if the input should be disabled
     */
    @Prop({ reflect: true })
    public disabled: boolean = false;

    /**
     * Set to `true` to disable adding and removing files, but allow interaction
     * with any already existing file.
     */
    @Prop({ reflect: true })
    public readonly: boolean = false;

    /**
     * Set to `true` to indicate that the current value of the chosen file is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Set to `true` to put the component in the `loading` state, and render an
     * indeterminate progress indicator. This does _not_ disable the
     * interactivity of the component!
     */
    @Prop({ reflect: true })
    public loading = false;

    /**
     * The [accepted file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers)
     */
    @Prop({ reflect: true })
    public accept: string = '*';

    /**
     * Optional client-side image resize, applied before the `change` event is
     * emitted: a selected image is downscaled and re-encoded on the user's
     * device. Only decodable raster images are resized; all other files pass
     * through unchanged. See the examples for details and caveats.
     * @beta
     */
    @Prop()
    public resizeImage?: ResizeOptions;

    /**
     * Defines the localisation for translations.
     */
    @Prop()
    public language: Languages = 'en';

    /**
     * Dispatched when a file is selected/deselected
     */
    @Event()
    private change: EventEmitter<FileInfo>;

    /**
     * Dispatched when clicking on a chip
     */
    @Event()
    private interact: EventEmitter<number | string>;

    /**
     * The selected file held while it is being resized, shown as a chip with a
     * loading badge so the field is not idle during the resize.
     */
    @State()
    private resizingFile?: FileInfo;

    /** The committed `value`, or the file currently being resized. */
    private get displayedFile(): FileInfo | undefined {
        return this.value ?? this.resizingFile;
    }

    // Clear the transient file once `value` reflects the selection, keeping the
    // same chip mounted across the hand-off (see file.spec.tsx) so only its
    // badge changes instead of the field flashing empty.
    @Watch('value')
    protected handleValueChange() {
        this.resizingFile = undefined;
    }

    public render() {
        return (
            <Host aria-busy={this.isBusy ? 'true' : 'false'}>
                <limel-file-dropzone
                    disabled={
                        this.disabled || this.readonly || !!this.displayedFile
                    }
                    accept={this.accept}
                    onFilesSelected={this.handleNewFiles}
                >
                    {this.renderChipset()}
                </limel-file-dropzone>
                {this.renderDragAndDropTip()}
                {this.renderSpinner()}
            </Host>
        );
    }

    private get statusText(): string {
        return this.displayedFile?.statusText?.trim() ?? '';
    }

    /**
     * The component is busy for any reason: its own `loading`, or a file that
     * is `loading` or has `progress` (including `0`). Completion is signalled
     * by the consumer clearing these — not by `progress` reaching `100`, since
     * a file at `100%` may still be finalizing (e.g. awaiting the server).
     */
    private get isBusy(): boolean {
        return (
            this.loading ||
            Boolean(this.displayedFile?.loading) ||
            this.displayedFile?.progress !== undefined
        );
    }

    private renderSpinner() {
        if (!this.isBusy) {
            return;
        }

        return <limel-spinner />;
    }

    private renderDragAndDropTip() {
        if (
            this.displayedFile ||
            this.disabled ||
            this.readonly ||
            this.isBusy
        ) {
            return;
        }

        return (
            <div class="drag-and-drop-tip">
                <span class="invisible-label-mock" role="presentation">
                    {this.label}
                </span>
                <span class="tip">{this.dropZoneTip()}</span>
            </div>
        );
    }

    private dropZoneTip = (): string => {
        return this.getTranslation('file.drag-and-drop-tips');
    };

    private handleNewFiles = async (event: CustomEvent<FileInfo[]>) => {
        this.preventAndStop(event);

        const file = event.detail[0];
        let out = file;
        const content = file?.fileContent;

        // `instanceof Blob` (not `File`) guards against a value with no real
        // binary and narrows to the DOM file type; `File` here is the class.
        if (
            this.resizeImage &&
            content instanceof Blob &&
            this.isResizableImage(content)
        ) {
            // Show the selected file with a loading badge while it resizes.
            // This object doubles as the in-flight token: if it is cleared or
            // replaced during the await (e.g. the file is removed), the resize
            // result is stale and must be dropped.
            const pending: FileInfo = {
                ...file,
                loading: true,
                statusText: this.getTranslation('file.optimizing'),
            };
            this.resizingFile = pending;

            try {
                const processed = await resizeImageFile(
                    content,
                    this.resizeImage
                );
                out = {
                    ...file,
                    filename: processed.name,
                    size: processed.size,
                    contentType: processed.type,
                    fileContent: processed,
                };
            } catch {
                // Best-effort: on any decode or encode failure emit the
                // original file unchanged.
            }

            // Bail if the selection changed while we were resizing, so a
            // removed or superseded file is neither re-shown nor re-emitted.
            if (this.resizingFile !== pending) {
                return;
            }

            // Keep the result on the same chip until `value` catches up.
            this.resizingFile = out;
        }

        this.change.emit(out);
    };

    // Cheap pre-filter; the decode inside `resizeImage` is the authoritative
    // check and throws (caught above) for anything that does not decode.
    private isResizableImage(file: Blob): boolean {
        return (
            Boolean(file.type?.startsWith('image/')) &&
            file.type !== 'image/svg+xml'
        );
    }

    private getChipArray(): Chip[] {
        const file = this.displayedFile;
        if (!file) {
            return [];
        }

        return [
            {
                ...DEFAULT_FILE_CHIP,
                text: file.filename,
                id: file.id,
                icon: {
                    name: getFileIcon(file),
                    title: getFileExtensionTitle(file),
                    color: getFileColor(file),
                    backgroundColor: getFileBackgroundColor(file),
                },
                badge: this.getBadge(),
                href: file.href,
                menuItems: file.menuItems,
                loading: file.loading,
                progress: file.progress,
                invalid: file.invalid,
            },
        ];
    }

    private getBadge(): string | undefined {
        if (this.statusText) {
            return this.statusText;
        }

        if (typeof this.displayedFile?.size === 'number') {
            return formatBytes(this.displayedFile.size);
        }

        return undefined;
    }

    private renderChipset() {
        const chipset = (
            <limel-chip-set
                disabled={this.disabled}
                readonly={this.readonly}
                invalid={this.invalid}
                clearAllButton={false}
                label={this.label}
                helperText={this.helperText}
                leadingIcon="upload_to_cloud"
                language={this.language}
                onChange={this.handleChipSetChange}
                onInteract={this.handleChipInteract}
                required={this.required}
                type="input"
                value={this.getChipArray()}
            />
        );

        if (this.value) {
            return chipset;
        }

        return (
            <limel-file-input
                accept={this.accept}
                disabled={this.disabled || this.readonly}
            >
                {chipset}
            </limel-file-input>
        );
    }

    private handleChipSetChange = (event: CustomEvent) => {
        event.stopPropagation();
        const file = event.detail.length === 0 ? event.detail[0] : null;
        if (!file) {
            // Removing the chip cancels any in-flight resize: drop the
            // transient so the chip disappears immediately, and the token
            // guard in `handleNewFiles` discards the resize result instead of
            // re-emitting the removed file once it finishes. Without this, a
            // removal during resize is swallowed, because `value` is already
            // `undefined` so the `@Watch('value')` clear never fires.
            this.resizingFile = undefined;
            this.change.emit(file);
        }
    };

    private handleChipInteract = (event: CustomEvent<Chip>) => {
        this.preventAndStop(event);
        this.interact.emit(event.detail.id);
    };

    private preventAndStop(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    private getTranslation(key: string) {
        return translate.get(key, this.language);
    }
}
