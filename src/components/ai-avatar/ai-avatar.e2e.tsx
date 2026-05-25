import { render, h } from '@stencil/vitest';

describe('limel-ai-avatar', () => {
    describe('mode and variant', () => {
        it('renders the default mode and variant', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg).toBeTruthy();
            expect(svg!.classList.contains('mode-idle')).toBe(true);
            expect(svg!.classList.contains('variant-minimal')).toBe(true);
        });

        it('reflects mode to the inner SVG class', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar mode="thinking"></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('mode-thinking')).toBe(true);
        });

        it('reflects variant to the inner SVG class', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar variant="solid"></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('variant-solid')).toBe(true);
        });

        it('updates the mode class when mode changes at runtime', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar mode="idle"></limel-ai-avatar>
            );
            await waitForChanges();

            (root as HTMLLimelAiAvatarElement).mode = 'active';
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('mode-active')).toBe(true);
            expect(svg!.classList.contains('mode-idle')).toBe(false);
        });

        it('updates the variant class when variant changes at runtime', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar variant="minimal"></limel-ai-avatar>
            );
            await waitForChanges();

            (root as HTMLLimelAiAvatarElement).variant = 'solid';
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('variant-solid')).toBe(true);
            expect(svg!.classList.contains('variant-minimal')).toBe(false);
        });
    });

    describe('isThinking deprecation shim', () => {
        let warn: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            warn.mockRestore();
        });

        it('bridges isThinking=true to mode=thinking when mode is default', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar isThinking></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('mode-thinking')).toBe(true);
            expect(svg!.classList.contains('mode-idle')).toBe(false);
        });

        it('does not override an explicitly set mode', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar mode="active" isThinking></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('mode-active')).toBe(true);
            expect(svg!.classList.contains('mode-thinking')).toBe(false);
        });

        it('leaves the avatar idle when isThinking is unset', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('mode-idle')).toBe(true);
        });

        it('warns when isThinking is set at mount', async () => {
            const { waitForChanges } = await render(
                <limel-ai-avatar isThinking></limel-ai-avatar>
            );
            await waitForChanges();

            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('`isThinking` prop is deprecated')
            );
        });

        it('does not warn when isThinking is unset', async () => {
            const { waitForChanges } = await render(
                <limel-ai-avatar></limel-ai-avatar>
            );
            await waitForChanges();

            expect(warn).not.toHaveBeenCalled();
        });
    });

    describe('variant fallback', () => {
        it('falls back to "minimal" and warns when given an unsupported variant', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const { root, waitForChanges } = await render(
                <limel-ai-avatar variant={'minmal' as never}></limel-ai-avatar>
            );
            await waitForChanges();

            const svg = root.shadowRoot!.querySelector('svg');
            expect(svg!.classList.contains('variant-minimal')).toBe(true);
            expect(svg!.classList.contains('variant-minmal')).toBe(false);
            expect(warn).toHaveBeenCalled();

            warn.mockRestore();
        });
    });

    describe('aria-label', () => {
        it('uses the base label without a mode suffix when idle', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar></limel-ai-avatar>
            );
            await waitForChanges();

            const label = root.getAttribute('aria-label')!;
            expect(label).not.toMatch(/\(/);
        });

        it('includes the mode in the aria-label for non-idle modes', async () => {
            const { root, waitForChanges } = await render(
                <limel-ai-avatar mode="thinking"></limel-ai-avatar>
            );
            await waitForChanges();

            const label = root.getAttribute('aria-label')!;
            expect(label).toMatch(/\([^()]+\)$/);
            expect(label).toContain('thinking');
        });

        it('falls back to the base label and warns when no translation exists for the mode', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const { root, waitForChanges } = await render(
                <limel-ai-avatar mode={'busy' as never}></limel-ai-avatar>
            );
            await waitForChanges();

            const label = root.getAttribute('aria-label')!;
            expect(label).not.toMatch(/ai-avatar\.mode\.busy/);
            expect(warn).toHaveBeenCalled();

            warn.mockRestore();
        });
    });

    // Any change to the rendered SVG requires regenerating
    // `@lundalogik/lime-icons8/-lime-ai-avatar`. Use the
    // *Download SVG for updating `@lundalogik/lime-icons8`* button in the
    // `limel-example-ai-avatar-export` example to produce the file, then
    // update the snapshot here together with the icons8 asset.
    it('exported SVG markup for the `solid` variant is unchanged', async () => {
        const { root, waitForChanges } = await render(
            <limel-ai-avatar variant="solid"></limel-ai-avatar>
        );
        await waitForChanges();

        const svg = root.shadowRoot!.querySelector('svg');
        expect(svg!.outerHTML).toMatchSnapshot();
    });
});
