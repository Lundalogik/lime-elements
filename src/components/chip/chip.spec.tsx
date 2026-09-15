import { render, h } from '@stencil/vitest';

describe('limel-chip', () => {
    test('the language is passed on to the loading indicator', async () => {
        // The progress bar owns its own accessible name and its "Loading…"
        // value text.
        const { root, waitForChanges } = await render(
            <limel-chip text="Attachment.pdf" language="no" loading={true} />
        );
        await waitForChanges();

        const progress = root.shadowRoot.querySelector(
            'limel-linear-progress'
        ) as any;
        expect(progress).not.toBeFalsy();
        expect(progress.language).toBe('no');
    });
});
