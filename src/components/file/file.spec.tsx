import { render, h } from '@stencil/vitest';
import { FileInfo } from '../../global/shared-types/file.types';

// These tests run in the mock-doc `spec` environment, which has no canvas or
// `createImageBitmap` and renders `limel-file` from the built bundle (so its
// `resizeImage` utility cannot be mocked). They therefore cover the parts of
// the resize feature that don't need a working decoder: which selections are
// eligible for resizing, and the single-file chrome. The successful resize
// round-trip and cancelling a resize mid-flight need a real browser and are
// covered by e2e tests.

const fileWith = (filename: string, type: string): FileInfo => ({
    id: 1,
    filename,
    fileContent: new File([new Blob(['data'])], filename, { type }),
});

const selectFile = async (
    root: HTMLElement,
    waitForChanges: () => Promise<void>,
    file: FileInfo
) => {
    const dropzone = root.shadowRoot?.querySelector('limel-file-dropzone');
    dropzone?.dispatchEvent(
        new CustomEvent('filesSelected', { detail: [file] })
    );
    await waitForChanges();
};

const setup = async (props: Record<string, unknown> = {}) => {
    const { root, waitForChanges } = await render(
        <limel-file label="Attach a file" {...props} />
    );
    await waitForChanges();

    const changes: FileInfo[] = [];
    root.addEventListener('change', (event: Event) => {
        changes.push((event as CustomEvent<FileInfo>).detail);
    });

    return { root, waitForChanges, changes };
};

test('disables the chip set clear-all button (single-file picker)', async () => {
    const { root } = await setup();

    const chipSet = root.shadowRoot?.querySelector('limel-chip-set') as any;
    expect(chipSet).toBeTruthy();
    expect(chipSet.clearAllButton).toBe(false);
});

test('emits a non-image file unchanged when resizeImage is set', async () => {
    const { root, waitForChanges, changes } = await setup({
        resizeImage: { width: 100, height: 100 },
    });

    await selectFile(
        root,
        waitForChanges,
        fileWith('report.pdf', 'application/pdf')
    );

    // Not a raster image, so it is passed through untouched.
    expect(changes.at(-1)?.filename).toBe('report.pdf');
    expect(changes.at(-1)?.contentType).toBeUndefined();
});

test('emits an SVG unchanged when resizeImage is set', async () => {
    const { root, waitForChanges, changes } = await setup({
        resizeImage: { width: 100, height: 100 },
    });

    await selectFile(
        root,
        waitForChanges,
        fileWith('icon.svg', 'image/svg+xml')
    );

    // SVG is excluded from resizing.
    expect(changes.at(-1)?.filename).toBe('icon.svg');
    expect(changes.at(-1)?.contentType).toBeUndefined();
});

test('emits an image unchanged when resizeImage is not set', async () => {
    const { root, waitForChanges, changes } = await setup();

    await selectFile(root, waitForChanges, fileWith('photo.png', 'image/png'));

    expect(changes.at(-1)?.filename).toBe('photo.png');
    expect(changes.at(-1)?.contentType).toBeUndefined();
});
