import { render, h } from '@stencil/vitest';
import { cdp } from 'vitest/browser';

const SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><g><path d="M0 0h10v10z"/></g></svg>';

/**
 * The icons cannot be downloaded in the tests, so the markup that they
 * would have rendered is put into them, to see how it is exposed.
 *
 * @param vnode - what to render
 */
async function renderWithSvg(vnode: any) {
    const result = await render(vnode);
    await result.waitForChanges();
    for (const icon of document.querySelectorAll('limel-icon')) {
        icon.shadowRoot!.querySelector('.container')!.innerHTML = SVG;
    }

    return result;
}

async function getAccessibleNodes(role: string): Promise<string[]> {
    const session = cdp();
    await session.send('Accessibility.enable');
    const { frameTree } = await session.send('Page.getFrameTree');
    const frameId = frameTree.childFrames![0].frame.id;
    const { nodes } = await session.send('Accessibility.getFullAXTree', {
        frameId,
    });

    return nodes
        .filter((node) => !node.ignored && node.role?.value === role)
        .map((node) => String(node.name?.value ?? ''));
}

describe('limel-icon', () => {
    // Note: SVG rendering tests (renders correctly, updates icon) require
    // fetch mocking for the icon CDN and belong in spec environment.

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

    it('reflects svgClass to the host as the `svg-class` attribute', async () => {
        const { root, waitForChanges } = await render(
            <limel-icon name="x" svgClass="foo"></limel-icon>
        );
        await waitForChanges();

        expect(root.getAttribute('svg-class')).toBe('foo');
    });

    describe('accessibility', () => {
        async function getNames(role: string) {
            const names = await getAccessibleNodes(role);

            return names.filter(Boolean);
        }

        it('is an image that is named by its aria-label', async () => {
            await renderWithSvg(<limel-icon name="x" aria-label="Search" />);

            expect(await getNames('image')).toEqual(['Search']);
        });

        it('is an image that is named by the element its aria-labelledby points to', async () => {
            await renderWithSvg(
                <div>
                    <span id="icon-name">Close</span>
                    <limel-icon name="x" aria-labelledby="icon-name" />
                </div>
            );

            expect(await getNames('image')).toEqual(['Close']);
        });

        it('is an image that is named by its title', async () => {
            await renderWithSvg(<limel-icon name="x" title="Fruit" />);

            expect(await getNames('image')).toEqual(['Fruit']);
        });

        it('is hidden when it has no name', async () => {
            await renderWithSvg(<limel-icon name="x" />);

            expect(await getAccessibleNodes('image')).toEqual([]);
        });

        it('is hidden when its aria-label is blank', async () => {
            await renderWithSvg(<limel-icon name="x" aria-label="  " />);

            expect(await getAccessibleNodes('image')).toEqual([]);
        });

        it('becomes an image when an aria-label is added, and is hidden again when it is removed', async () => {
            const { root } = await renderWithSvg(<limel-icon name="x" />);

            root.setAttribute('aria-label', 'Added');
            await vi.waitFor(async () => {
                expect(await getNames('image')).toEqual(['Added']);
            });

            root.removeAttribute('aria-label');
            await vi.waitFor(async () => {
                expect(await getAccessibleNodes('image')).toEqual([]);
            });
        });

        it('becomes an image when a title is added, and is hidden again when it is removed', async () => {
            const { root } = await renderWithSvg(<limel-icon name="x" />);

            root.setAttribute('title', 'Added');
            await vi.waitFor(async () => {
                expect(await getNames('image')).toEqual(['Added']);
            });

            root.removeAttribute('title');
            await vi.waitFor(async () => {
                expect(await getAccessibleNodes('image')).toEqual([]);
            });
        });

        it('keeps a role that the consumer sets', async () => {
            await renderWithSvg(
                <limel-icon name="x" role="button" aria-label="Go" />
            );

            expect(await getNames('button')).toEqual(['Go']);
            expect(await getNames('image')).toEqual([]);
        });

        it('keeps a role that the consumer sets when the title is the only name', async () => {
            await renderWithSvg(
                <limel-icon name="x" role="button" title="Go" />
            );

            expect(await getNames('button')).toEqual(['Go']);
            expect(await getNames('image')).toEqual([]);
        });

        it('is not hidden when the consumer sets a role and there is no name', async () => {
            await renderWithSvg(<limel-icon name="x" role="img" />);

            expect(await getAccessibleNodes('image')).not.toEqual([]);
        });

        it('is hidden again when the role of an icon without a name is removed', async () => {
            const { root } = await renderWithSvg(
                <limel-icon name="x" role="img" />
            );

            root.removeAttribute('role');
            await vi.waitFor(async () => {
                expect(await getAccessibleNodes('image')).toEqual([]);
            });
        });

        it('stays hidden when the consumer hides it', async () => {
            await renderWithSvg(
                <limel-icon name="x" aria-label="Search" aria-hidden="true" />
            );

            expect(await getAccessibleNodes('image')).toEqual([]);
        });

        it('still renders in a browser without attachInternals', async () => {
            const { attachInternals } = HTMLElement.prototype;
            delete (HTMLElement.prototype as any).attachInternals;

            try {
                const { root, waitForChanges } = await render(
                    <limel-icon name="x" aria-label="Search" />
                );
                await waitForChanges();

                expect(
                    root.shadowRoot!.querySelector('.container')
                ).not.toBeNull();
            } finally {
                HTMLElement.prototype.attachInternals = attachInternals;
            }
        });
    });
});
