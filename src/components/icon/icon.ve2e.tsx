import { render, h } from '@stencil/vitest';

describe('limel-icon', () => {
    // Note: SVG rendering tests (renders correctly, updates icon) require
    // fetch mocking for the icon CDN and belong in spec environment.
    // The old e2e tests relied on Puppeteer serving static assets.

    it('does not render an icon when name is not provided', async () => {
        const { root, waitForChanges } = await render(
            <limel-icon></limel-icon>
        );
        await waitForChanges();

        const svgElement = root.shadowRoot!.querySelector('svg');
        expect(svgElement).toBeFalsy();
    });

    it('renders with a badge when the badge and size props are provided', async () => {
        const { root, waitForChanges } = await render(
            <limel-icon name="unit-test" size="small" badge></limel-icon>
        );
        await waitForChanges();

        expect(root.hasAttribute('badge')).toBe(true);
    });
});
