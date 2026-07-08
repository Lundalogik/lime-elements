import { render, h } from '@stencil/vitest';
import { FileInfo } from '../../global/shared-types/file.types';

// Browser tests: a real canvas / `createImageBitmap` is available here, so the
// actual client-side resize runs. These cover the two behaviors that cannot be
// exercised in the mock-doc `spec` environment (see file.spec.tsx): the resize
// round-trip, and cancelling a resize that is still in flight.

const RESIZE_OPTIONS = { width: 50, height: 50 };

// Draw a solid PNG of the given size so it is a genuinely decodable raster.
const makeImageFile = async (
    filename: string,
    width: number,
    height: number
): Promise<File> => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#3366cc';
    context.fillRect(0, 0, width, height);

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((result) => resolve(result), 'image/png');
    });

    return new File([blob], filename, { type: 'image/png' });
};

const asFileInfo = (file: File): FileInfo => ({
    id: 1,
    filename: file.name,
    fileContent: file,
});

const selectFile = (root: HTMLElement, file: File) => {
    const dropzone = root.shadowRoot?.querySelector('limel-file-dropzone');
    dropzone?.dispatchEvent(
        new CustomEvent('filesSelected', { detail: [asFileInfo(file)] })
    );
};

const removeChip = (root: HTMLElement) => {
    const chipSet = root.shadowRoot?.querySelector('limel-chip-set');
    chipSet?.dispatchEvent(new CustomEvent('change', { detail: [] }));
};

const captureChanges = (root: HTMLElement): FileInfo[] => {
    const changes: FileInfo[] = [];
    root.addEventListener('change', (event: Event) => {
        changes.push((event as CustomEvent<FileInfo>).detail);
    });

    return changes;
};

const setup = async () => {
    const { root, waitForChanges } = await render(
        <limel-file label="Attach a file" />
    );
    (root as any).resizeImage = RESIZE_OPTIONS;
    await waitForChanges();

    return { root, waitForChanges, changes: captureChanges(root) };
};

describe('limel-file (client-side resize)', () => {
    it('resizes and re-encodes a selected image before emitting change', async () => {
        const { root, changes } = await setup();

        selectFile(root, await makeImageFile('photo.png', 200, 120));

        await vi.waitFor(() => expect(changes).toHaveLength(1));

        const emitted = changes[0];
        // Re-encoded to the default JPEG output, with the extension updated.
        expect(emitted.filename).toBe('photo.jpg');
        expect(emitted.contentType).toBe('image/jpeg');

        // Actually downscaled to the requested box.
        const bitmap = await createImageBitmap(emitted.fileContent);
        expect(bitmap.width).toBe(50);
        expect(bitmap.height).toBe(50);
    });

    it('does not re-emit the file when the chip is removed mid-resize', async () => {
        const { root, changes } = await setup();

        // Start the resize, then remove the chip before it can finish. The
        // synchronous ordering guarantees the removal lands while the async
        // resize is still pending.
        selectFile(root, await makeImageFile('photo.png', 800, 600));
        removeChip(root);

        // Wait for the removal, then give the abandoned resize time to settle.
        await vi.waitFor(() =>
            expect(changes.length).toBeGreaterThanOrEqual(1)
        );
        await new Promise((resolve) => setTimeout(resolve, 150));

        // The stale resized image must never be emitted after removal.
        expect(
            changes.some((change) => change?.contentType === 'image/jpeg')
        ).toBe(false);
        // The last thing the consumer heard was the removal.
        expect(changes.at(-1)).toBeFalsy();
    });
});
