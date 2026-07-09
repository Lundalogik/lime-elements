import {
    FileInfo,
    LimelSelectCustomEvent,
    Option,
    type ResizeOptions,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Client-side image resize
 *
 * When `resizeImage` is set, a selected image is downscaled and re-encoded on the
 * user's device *before* the `change` event fires — reducing upload size and
 * normalizing its dimensions and format. The emitted file's `filename`,
 * `contentType` and `size` reflect the resized file, so its extension may
 * change (for example `.png` → `.jpg`).
 *
 * The options passed to `resizeImage` are:
 *
 * - `width` / `height`: the target box, in pixels, to fit the image into.
 *   Clear one to derive it from the other and keep the aspect ratio; clear
 *   both to keep the source dimensions and only re-encode.
 * - `fit`: only matters when both `width` and `height` are set. `cover` fills
 *   the box and center-crops the overflow; `contain` fits the whole image
 *   inside the box, letterboxing it. Omit it to scale the whole image to fit
 *   without cropping.
 * - `type`: the output format. Omit it to keep the source format when the
 *   canvas can encode it (PNG stays PNG; everything else becomes JPEG).
 * - `quality`: JPEG compression, `0`–`1`. Ignored for `image/png`, which is
 *   lossless. The control below is disabled when PNG is selected.
 *
 * Because resize re-encodes the image, do not enable it where the original
 * bytes must be preserved — for example security scanning, checksums, or
 * signatures.
 *
 * Resize completes before `change` fires; reflect any subsequent upload with
 * the file's `loading`, `statusText` and `progress` fields.
 *
 * :::note
 * `limel-file` is a general-purpose file picker, so pair `resizeImage` with an
 * image-restricted `accept`, as this example does. Resize only touches
 * decodable raster images; see the next example for what happens to everything
 * else.
 * :::
 *
 * :::tip
 * If you are specifically building an image or avatar picker, look at
 * [limel-profile-picture](#/component/limel-profile-picture/) instead. It
 * shares the same resize options, but additionally renders a preview of the
 * chosen image inline, and its examples explore the `fit` strategies and
 * fallback behavior in more depth.
 * :::
 *
 * @beta
 */
@Component({
    tag: 'limel-example-file-resize-image',
    shadow: true,
    styleUrl: 'file-resize-image.scss',
})
export class FileResizeImageExample {
    @State()
    private value?: FileInfo;

    @State()
    private previewUrl = '';

    @State()
    // Every field is optional, and the util imposes no defaults of its own:
    // when omitted, `type` keeps the source format when the canvas can encode
    // it (PNG stays PNG, otherwise JPEG); `fit` scales the whole image to fit
    // without cropping; `quality` (JPEG only) uses the browser's native
    // quality; `width`/`height` fall back to the source dimensions (a missing
    // one preserves the aspect ratio).
    private options: ResizeOptions = {
        width: 800,
        height: 600,
        fit: 'contain',
        type: 'image/jpeg',
        quality: 0.85,
    };

    private fitOptions: Option[] = [
        { text: 'cover', value: 'cover' },
        { text: 'contain', value: 'contain' },
    ];

    private typeOptions: Option[] = [
        { text: 'image/jpeg', value: 'image/jpeg' },
        { text: 'image/png', value: 'image/png' },
    ];

    public render() {
        return (
            <Host>
                <h4>
                    1. Set <code>ResizeOptions</code>
                </h4>
                <limel-example-controls>
                    <limel-input-field
                        label="Width"
                        type="number"
                        value={this.options.width?.toString() ?? ''}
                        onChange={this.handleWidthChange}
                    />
                    <limel-input-field
                        label="Height"
                        type="number"
                        value={this.options.height?.toString() ?? ''}
                        onChange={this.handleHeightChange}
                    />
                    <limel-select
                        label="Fit"
                        value={this.getSelectedFit()}
                        options={this.fitOptions}
                        disabled={!this.options.width || !this.options.height}
                        onChange={this.handleFitChange}
                    />
                    <limel-select
                        label="Type"
                        value={this.getSelectedType()}
                        options={this.typeOptions}
                        onChange={this.handleTypeChange}
                    />
                    <limel-slider
                        label="JPEG quality"
                        value={Math.round((this.options.quality ?? 0) * 100)}
                        valuemin={1}
                        valuemax={100}
                        step={1}
                        unit="%"
                        disabled={this.options.type === 'image/png'}
                        onChange={this.handleQualityChange}
                    />
                </limel-example-controls>
                <h4>2. Select an image file</h4>
                <limel-file
                    label="Upload an image"
                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                    value={this.value}
                    resizeImage={this.options}
                    onChange={this.handleChange}
                />
                <h4>3. See your resized image</h4>
                <div class="preview">{this.renderPreview()}</div>
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    private renderPreview() {
        if (!this.previewUrl) {
            return <span>No image selected yet.</span>;
        }

        return <img src={this.previewUrl} alt="Preview of the resized image" />;
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;

        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
            this.previewUrl = '';
        }

        if (!this.value?.fileContent) {
            return;
        }

        this.previewUrl = URL.createObjectURL(this.value.fileContent);
    };

    private getSelectedFit = (): Option | undefined => {
        return this.fitOptions.find(
            (option) => option.value === this.options.fit
        );
    };

    private getSelectedType = (): Option | undefined => {
        return this.typeOptions.find(
            (option) => option.value === this.options.type
        );
    };

    private handleWidthChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.updateNumericOption('width', event.detail);
    };

    private handleHeightChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.updateNumericOption('height', event.detail);
    };

    private handleQualityChange = (event: CustomEvent<number>) => {
        event.stopPropagation();
        const quality = Math.max(0, Math.min(1, event.detail / 100));
        this.updateOption('quality', quality);
    };

    private handleFitChange = (event: LimelSelectCustomEvent<Option>) => {
        event.stopPropagation();
        this.updateOption('fit', event.detail.value as 'cover' | 'contain');
    };

    private handleTypeChange = (event: LimelSelectCustomEvent<Option>) => {
        event.stopPropagation();
        this.updateOption(
            'type',
            event.detail.value as 'image/jpeg' | 'image/png'
        );
    };

    private updateNumericOption = (
        key: 'width' | 'height' | 'quality',
        value: string
    ) => {
        // A cleared field means "not set": leave the dimension out so the
        // resize keeps the source's own value. `Number('')` is `0`, so guard
        // the empty string explicitly rather than relying on the parse.
        const trimmed = value.trim();
        const parsed = Number(trimmed);
        const isSet = trimmed !== '' && Number.isFinite(parsed);

        this.updateOption(key, isSet ? parsed : undefined);
    };

    private updateOption = <K extends keyof ResizeOptions>(
        key: K,
        value: ResizeOptions[K]
    ) => {
        this.options = {
            ...this.options,
            [key]: value,
        };
    };

    public componentWillUnload() {
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
        }
    }
}
