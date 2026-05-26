import { render, h } from '@stencil/vitest';
import { afterEach, beforeEach } from 'vitest';

// `vitest-setup.ts` mocks `fetch` globally to return an empty SVG for any
// `.svg` request — which makes the "preserves the baked-in class" test
// trivially false (there's no class to preserve). Override per suite so
// every icon load resolves to an SVG that actually carries a class.
const SVG_WITH_BAKED_IN_CLASS = '<svg class="baked-in"><path d="M0 0"/></svg>';
let originalFetch: typeof globalThis.fetch;

beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
        new Response(SVG_WITH_BAKED_IN_CLASS, {
            headers: { 'Content-Type': 'image/svg+xml' },
        });
});

afterEach(() => {
    globalThis.fetch = originalFetch;
});

describe('limel-icon svgClass', () => {
    it('applies the class to the inner SVG on initial render', async () => {
        const { root, waitForChanges } = await render(
            <limel-icon name="x" svgClass="foo bar"></limel-icon>
        );
        await waitForChanges();

        const svg = root.shadowRoot!.querySelector('svg');
        expect(svg!.getAttribute('class')).toBe('foo bar');
    });

    it("preserves the SVG file's baked-in class when svgClass is unset", async () => {
        const { root, waitForChanges } = await render(
            <limel-icon name="x"></limel-icon>
        );
        await waitForChanges();

        const svg = root.shadowRoot!.querySelector('svg');
        expect(svg!.getAttribute('class')).toBe('baked-in');
    });

    it('updates the inner SVG class when svgClass changes', async () => {
        const { root, waitForChanges } = await render(
            <limel-icon name="x" svgClass="initial"></limel-icon>
        );
        await waitForChanges();

        (root as HTMLLimelIconElement).svgClass = 'updated';
        await waitForChanges();

        const svg = root.shadowRoot!.querySelector('svg');
        expect(svg!.getAttribute('class')).toBe('updated');
    });

    it('removes the class from the inner SVG when svgClass transitions to undefined', async () => {
        const { root, waitForChanges } = await render(
            <limel-icon name="x" svgClass="foo"></limel-icon>
        );
        await waitForChanges();

        (root as HTMLLimelIconElement).svgClass = undefined;
        await waitForChanges();

        const svg = root.shadowRoot!.querySelector('svg');
        expect(svg!.hasAttribute('class')).toBe(false);
    });
});
