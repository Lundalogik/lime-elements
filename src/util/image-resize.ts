/**
 * Image resize utilities
 *
 * Overview
 * --------
 * This module provides a small, dependency-free utility to resize images on the client
 * (in the browser) before uploading. It works by decoding an input `File` to an
 * `ImageBitmap` (or falling back to an `HTMLImageElement`), drawing it onto a
 * `Canvas`/`OffscreenCanvas` with the requested strategy (cover/contain), and
 * then exporting the result to a new `File` with your preferred MIME type and
 * quality.
 *
 * Why resize client-side?
 * - Faster perceived uploads and lower bandwidth usage
 * - Consistent output sizes and formats (e.g., a 400x400 thumbnail)
 * - No server-side transformation required for common cases
 *
 * Fit strategies
 * - `cover`: The image is scaled to cover the target rectangle, and the excess
 *   parts are center-cropped. Good for avatars.
 * - `contain`: The image is scaled to fit entirely within the target rectangle
 *   without cropping, letterboxing if needed. Good when you must preserve the
 *   entire image.
 * - omitted: scales the whole image to fit without cropping (no pixels are
 *   discarded).
 *
 * Decoding & EXIF orientation
 * EXIF orientation is a piece of metadata stored inside image files
 * (usually JPEGs) that tells image renderer software how the image should be displayed
 * i.e., whether it should be rotated or flipped. This meta data is normally added
 * to photos by digital cameras and phones.
 * - When available, `createImageBitmap(file, { imageOrientation: 'from-image' })`
 *   is used to automatically respect EXIF orientation.
 * - If not available or it fails (e.g., unsupported format), we fall back to
 *   decoding via an `HTMLImageElement`.
 *
 * OffscreenCanvas
 * - If the environment supports `OffscreenCanvas`, it will be used for the draw
 *   and encode operations for better performance in some cases. Otherwise, a
 *   regular `HTMLCanvasElement` is used.
 *
 * HEIC/HEIF notes
 * - All major browsers except Safari lack native HEIC/HEIF decoding.
 *   In such cases the `resizeImage` function will throw when decoding fails.
 *   The caller should catch and fall back
 *   to using the original file or handle conversion on the server.
 * - If we need guaranteed client-side HEIC->JPEG conversion, we must add a small
 *   library or WASM module; this utility intentionally avoids extra dependencies.
 *
 * Output type & quality
 * - When `type` is omitted the source format is kept if the canvas can encode
 *   it: a PNG stays a PNG (preserving transparency) and everything else is
 *   encoded as `image/jpeg`. Set `type` explicitly to force a format.
 * - JPEG `quality` is optional; when omitted the browser's native encoding
 *   quality is used rather than an imposed value.
 * - The output filename extension is adjusted to match the chosen MIME type by
 *   default (e.g., `.jpg` or `.png`). You can override naming via the `rename`
 *   option.
 *
 * Error handling
 * - Throws if canvas/context cannot be created or if canvas->blob conversion fails.
 * - Decoding failures (unsupported type) will throw; caller can try/catch and
 *   fall back to the original file.
 *
 * Performance tips
 * - Keep target sizes reasonable (e.g., 256–1024 px) to avoid long processing
 *   times on modest devices.
 * - JPEG with quality 0.8–0.9 often strikes a good balance between size and
 *   perceived quality for photos/avatars.
 *
 * Usage examples
 * --------------
 * Basic usage:
 * ```ts
 * import { resizeImage } from '@limetech/lime-elements/util/image-resize';
 *
 * const processed = await resizeImage(file, {
 *   width: 400,
 *   height: 400,
 *   fit: 'cover',         // center-crops; omit to fit without cropping
 *   type: 'image/jpeg',   // omit to keep the source format
 *   quality: 0.85,        // omit to use the browser's native quality
 * });
 * // Upload `processed` instead of the original file
 * ```
 *
 * With custom naming:
 * ```ts
 * const processed = await resizeImage(file, {
 *   width: 800,
 *   height: 800,
 *   fit: 'contain',
 *   type: 'image/png',
 *   rename: (name) => name.replace(/\.[^.]+$/, '') + '_resized.png',
 * });
 * ```
 *
 * In a Stencil component (simplified):
 * ```tsx
 * private async handleFilesSelected(file: File) {
 *   try {
 *     const resized = await resizeImage(file, { width: 400, height: 400 });
 *     // build your FileInfo and emit
 *   } catch {
 *     // fall back to original
 *   }
 * }
 * ```
 */
// (Removed exported ResizeFit to avoid forcing a public symbol.)

/**
 * The image formats the canvas can reliably encode, mapped to their filename
 * extension. Single source of truth for what this util can output: both the
 * output-type resolution and the output filename extension derive from it. The
 * `ResizeOptions.type` union below mirrors these keys — keep the two in sync
 * when adding a format.
 */
const ENCODABLE_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
} as const;

/** An image MIME type the canvas can encode (a key of `ENCODABLE_TYPES`). */
type EncodableImageType = keyof typeof ENCODABLE_TYPES;

/**
 * Options for client-side image resizing.
 * @beta
 */
export type ResizeOptions = {
    /**
     * Target width in CSS pixels. Omit to derive it from `height` while
     * preserving the source aspect ratio; omit both `width` and `height` to
     * keep the source dimensions and only re-encode.
     */
    width?: number;
    /**
     * Target height in CSS pixels. Omit to derive it from `width` while
     * preserving the source aspect ratio; omit both `width` and `height` to
     * keep the source dimensions and only re-encode.
     */
    height?: number;
    /**
     * How the image is fitted into the target box when its aspect ratio
     * differs. `cover` scales to fill and center-crops the overflow; `contain`
     * scales to fit the whole image inside the box. Omit to scale the whole
     * image to fit without cropping (no pixels are discarded). Only relevant
     * when both `width` and `height` are set.
     */
    fit?: 'cover' | 'contain';
    /**
     * Output MIME type. Omit to keep the source file's format when the canvas
     * can encode it: a PNG stays a PNG (preserving transparency), otherwise
     * the output is JPEG. Set explicitly to force a format.
     */
    type?: 'image/jpeg' | 'image/png';
    /**
     * JPEG quality (0..1); used only for 'image/jpeg'. Omit to let the browser
     * use its native encoding quality rather than imposing a value.
     */
    quality?: number;
    /** Optional renaming function. Defaults to changing extension to match MIME. */
    rename?: (originalName: string) => string;
};

type SourceLike = ImageBitmap | HTMLImageElement;

/**
 * Resize an image file on the client using Canvas/OffscreenCanvas.
 * Returns a new File with the requested format and dimensions.
 *
 * Contract
 * - Input: image `File`
 * - Output: resized image as a new `File` with updated `type`, name, and size
 * - Errors: may throw on decode failure or canvas export failure
 *
 * @beta
 * @param file - The image file to resize.
 * @param options - Configuration for the resize operation.
 */
export async function resizeImage(
    file: File,
    options: ResizeOptions
): Promise<File> {
    // This shared utility carries no opinionated defaults: an omitted option
    // preserves the source file's own property rather than imposing a value.
    // Consumers that want a specific default (e.g. limel-profile-picture) apply
    // it themselves. See the `ResizeOptions` doc for the per-option behavior.
    const { fit, quality } = options;
    // When no output type is requested, keep the source file's format if the
    // canvas can encode it (PNG stays PNG, preserving transparency); anything
    // else falls back to JPEG.
    const type = resolveOutputType(file.type, options.type);
    const rename =
        options.rename ?? ((name: string) => renameWithType(name, type));

    const source = await loadSource(file);
    const sourceWidth = source.width;
    const sourceHeight = source.height;
    const { width, height } = resolveTargetSize(
        sourceWidth,
        sourceHeight,
        options.width,
        options.height
    );

    const { sx, sy, sw, sh, dx, dy, dw, dh } = computeRects(
        sourceWidth,
        sourceHeight,
        width,
        height,
        fit
    );

    const canvas = createCanvas(width, height);
    const ctx = get2dContext(canvas);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);

    const blob = await canvasToBlob(canvas, type, quality);
    const name = rename(file.name);
    return new File([blob], name, { type });
}

/**
 * Resolve the target dimensions from the requested options, falling back to the
 * source. A missing dimension is derived from the given one to preserve the
 * source aspect ratio; when both are missing the source size is kept, so the
 * image is only re-encoded. Non-positive requests are treated as missing.
 *
 * @param sourceWidth - Decoded source width
 * @param sourceHeight - Decoded source height
 * @param width - Requested target width, if any
 * @param height - Requested target height, if any
 */
function resolveTargetSize(
    sourceWidth: number,
    sourceHeight: number,
    width?: number,
    height?: number
): { width: number; height: number } {
    // A dimension counts as "requested" only when it's a positive number;
    // `undefined`, `0`, negatives and `NaN` are all treated as missing.
    const hasWidth = typeof width === 'number' && width > 0;
    const hasHeight = typeof height === 'number' && height > 0;

    // Both requested: use them as-is.
    if (hasWidth && hasHeight) {
        return { width, height };
    }

    // Only width requested: derive the height to keep the aspect ratio.
    if (hasWidth) {
        return {
            width,
            height: Math.round(width * (sourceHeight / sourceWidth)),
        };
    }

    // Only height requested: derive the width to keep the aspect ratio.
    if (hasHeight) {
        return {
            width: Math.round(height * (sourceWidth / sourceHeight)),
            height,
        };
    }

    // Neither requested: keep the source size and only re-encode.
    return { width: sourceWidth, height: sourceHeight };
}

/** Whether OffscreenCanvas is available in the current environment. */
function supportsOffscreen(): boolean {
    try {
        return typeof (globalThis as any).OffscreenCanvas === 'function';
    } catch {
        return false;
    }
}

/**
 * Create either an OffscreenCanvas or a regular canvas for drawing.
 * @param width - Target width
 * @param height - Target height
 */
function createCanvas(
    width: number,
    height: number
): HTMLCanvasElement | OffscreenCanvas {
    if (supportsOffscreen()) {
        return new (globalThis as any).OffscreenCanvas(width, height);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

/**
 * Get the 2D rendering context, throwing a descriptive error if unavailable.
 * @param canvas - The canvas to get context from
 */
function get2dContext(canvas: HTMLCanvasElement | OffscreenCanvas) {
    const ctx = (canvas as any).getContext('2d', { alpha: true });
    if (!ctx) {
        throw new Error('2D canvas context not available');
    }

    return ctx as CanvasRenderingContext2D;
}

/**
 * Convert the canvas content to a Blob, supporting both canvas types.
 * @param canvas - The source canvas
 * @param type - Output MIME type
 * @param quality - JPEG quality (0..1); omit to use the browser default
 */
function canvasToBlob(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    type: string,
    quality?: number
): Promise<Blob> {
    if ('convertToBlob' in canvas) {
        return (canvas as OffscreenCanvas).convertToBlob({ type, quality });
    }

    return new Promise((resolve, reject) => {
        (canvas as HTMLCanvasElement).toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Failed to create blob from canvas'));
                    return;
                }
                resolve(blob);
            },
            type,
            quality
        );
    });
}

/**
 * Load the image into a decodable source (ImageBitmap preferred).
 * @param file - The input file to decode
 */

async function loadSource(file: File): Promise<SourceLike> {
    if (typeof (globalThis as any).createImageBitmap === 'function') {
        try {
            return await (globalThis as any).createImageBitmap(file, {
                imageOrientation: 'from-image',
            } as any);
        } catch (error) {
            // Log for debugging in development, but continue with fallback
            const isDev =
                (globalThis as any).process?.env?.NODE_ENV !== 'production';

            if (
                isDev &&
                typeof console !== 'undefined' &&
                typeof console.debug === 'function'
            ) {
                console.debug(
                    'createImageBitmap failed, falling back to HTMLImageElement:',
                    error
                );
            }
        }
    }

    return await loadImageElement(file);
}

/**
 * Decode an image file via HTMLImageElement when ImageBitmap is unavailable.
 * @param file - The input file to decode
 */
async function loadImageElement(file: File): Promise<HTMLImageElement> {
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.decoding = 'sync';
        img.src = url;
        await img.decode?.().catch(() => undefined);
        if (!img.complete) {
            await new Promise<void>((resolve, reject) => {
                const cleanup = () => {
                    img.removeEventListener('load', onLoad);
                    img.removeEventListener('error', onError);
                };

                const onLoad = () => {
                    cleanup();
                    resolve();
                };
                const onError = (e: Event) => {
                    cleanup();
                    reject(e);
                };

                img.addEventListener('load', onLoad);
                img.addEventListener('error', onError);
            });
        }
        return img;
    } finally {
        URL.revokeObjectURL(url);
    }
}

/**
 * Compute source and destination rectangles for drawImage based on the fit mode.
 *
 * Returns sx, sy, sw, sh for the source crop/area and dx, dy, dw, dh for the
 * destination rectangle on the target canvas.
 *
 * @param sw - Source width
 * @param sh - Source height
 * @param tw - Target width
 * @param th - Target height
 * @param fit - Fit mode; `cover` center-crops, anything else (including
 * omitted) scales the whole image to fit without cropping
 */
function computeRects(
    sw: number,
    sh: number,
    tw: number,
    th: number,
    fit?: 'cover' | 'contain'
) {
    const sRatio = sw / sh;
    const tRatio = tw / th;

    if (fit === 'cover') {
        // scale source to cover target, then center-crop
        let cropW: number;
        let cropH: number;
        if (sRatio > tRatio) {
            // source is wider than target: crop width
            cropH = sh;
            cropW = sh * tRatio;
        } else {
            // source is taller than target: crop height
            cropW = sw;
            cropH = sw / tRatio;
        }
        const sx = (sw - cropW) / 2;
        const sy = (sh - cropH) / 2;
        return { sx, sy, sw: cropW, sh: cropH, dx: 0, dy: 0, dw: tw, dh: th };
    }

    // contain: fit inside, letterbox if needed
    let drawW: number;
    let drawH: number;
    if (sRatio > tRatio) {
        drawW = tw;
        drawH = tw / sRatio;
    } else {
        drawH = th;
        drawW = th * sRatio;
    }
    const dx = (tw - drawW) / 2;
    const dy = (th - drawH) / 2;

    return { sx: 0, sy: 0, sw, sh, dx, dy, dw: drawW, dh: drawH };
}

/**
 * Resolve the output MIME type. An explicit request wins; otherwise the source
 * file's format is kept when the canvas can encode it (see `ENCODABLE_TYPES`),
 * so a PNG stays a PNG (preserving transparency) while every other input
 * (WebP, HEIC, …) falls back to JPEG.
 *
 * @param sourceType - MIME type of the input file
 * @param requested - Explicitly requested output type, if any
 */
function resolveOutputType(
    sourceType: string,
    requested?: EncodableImageType
): EncodableImageType {
    if (requested) {
        return requested;
    }

    // Keep the source format when the canvas can encode it; otherwise JPEG.
    const canEncodeSource = Object.prototype.hasOwnProperty.call(
        ENCODABLE_TYPES,
        sourceType
    );

    return canEncodeSource ? (sourceType as EncodableImageType) : 'image/jpeg';
}

/**
 * Update filename extension to match the desired MIME type.
 * @param name - Original filename
 * @param type - Output MIME type
 */
function renameWithType(name: string, type: EncodableImageType): string {
    const ext = ENCODABLE_TYPES[type];
    const idx = name.lastIndexOf('.');
    const base = idx > 0 ? name.slice(0, idx) : name;
    return `${base}.${ext}`;
}
