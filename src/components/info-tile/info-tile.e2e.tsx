import { render, h } from '@stencil/vitest';
import { afterEach, vi } from 'vitest';

const TILT = '--limel-3d-hover-effect-rotate3d';

const moveMouse = () => {
    document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 20, clientY: 30 })
    );
};

describe('limel-info-tile', () => {
    describe('smoke test', () => {
        it('displays the correct value', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="Test value"></limel-info-tile>
            );
            await waitForChanges();

            const valueGroup = root.shadowRoot!.querySelector('.value-group');
            expect(valueGroup).not.toBeNull();
            expect(valueGroup.textContent).toEqual('Test value');
        });
    });

    describe('when a link is supplied', () => {
        it('is a link, and carries the 3d hover effect', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            const anchor = root.shadowRoot!.querySelector('a');
            expect(anchor.classList.contains('is-clickable')).toBe(true);
            expect(anchor.getAttribute('tabindex')).toEqual('0');
            expect(
                anchor.querySelector('limel-3d-hover-effect-glow')
            ).not.toBeNull();
        });
    });

    describe('when no link is supplied', () => {
        it('is a plain element, not a link', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1"></limel-info-tile>
            );
            await waitForChanges();

            const tile = root.shadowRoot!.querySelector('.tile');
            expect(tile.tagName).toEqual('DIV');
            expect(tile.getAttribute('role')).toBeNull();
            expect(tile.getAttribute('aria-label')).toBeNull();
        });

        it('is neither focusable nor given the 3d hover effect', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1"></limel-info-tile>
            );
            await waitForChanges();

            const tile = root.shadowRoot!.querySelector('.tile');
            expect(tile.classList.contains('is-clickable')).toBe(false);
            expect(tile.getAttribute('tabindex')).toBeNull();
            expect(tile.querySelector('limel-3d-hover-effect-glow')).toBeNull();
        });
    });

    describe('when a link is supplied but the tile is disabled', () => {
        it('is neither focusable nor given the 3d hover effect', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    disabled={true}
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            const anchor = root.shadowRoot!.querySelector('a');
            expect(anchor.classList.contains('is-clickable')).toBe(false);
            expect(anchor.getAttribute('tabindex')).toBeNull();
            expect(
                anchor.querySelector('limel-3d-hover-effect-glow')
            ).toBeNull();
        });

        it('has no href, so it cannot be tabbed to or followed', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    disabled={true}
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            const anchor = root.shadowRoot!.querySelector('a');
            expect(anchor.hasAttribute('href')).toBe(false);
        });

        it('is announced as a disabled link', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    disabled={true}
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            const anchor = root.shadowRoot!.querySelector('a');
            expect(anchor.getAttribute('role')).toEqual('link');
            expect(anchor.getAttribute('aria-disabled')).toEqual('true');
        });

        it('does not pass a click on to the host', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    disabled={true}
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();
            let clicks = 0;
            root.addEventListener('click', () => clicks++);

            root.shadowRoot!.querySelector('a').dispatchEvent(
                new MouseEvent('click', { bubbles: true, composed: true })
            );

            expect(clicks).toBe(0);
        });
    });

    describe('when clickable but no link is supplied', () => {
        it('is focusable, a button, and given the 3d hover effect', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1" clickable={true}></limel-info-tile>
            );
            await waitForChanges();

            const tile = root.shadowRoot!.querySelector('.tile');
            expect(tile.tagName).toEqual('DIV');
            expect(tile.classList.contains('is-clickable')).toBe(true);
            expect(tile.getAttribute('tabindex')).toEqual('0');
            expect(tile.getAttribute('role')).toEqual('button');
            expect(
                tile.querySelector('limel-3d-hover-effect-glow')
            ).not.toBeNull();
        });

        it.each([['Enter'], [' ']])('is clicked by the %j key', async (key) => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1" clickable={true}></limel-info-tile>
            );
            await waitForChanges();
            let clicks = 0;
            root.addEventListener('click', () => clicks++);

            root.shadowRoot!.querySelector('.tile').dispatchEvent(
                new KeyboardEvent('keydown', { key, bubbles: true })
            );

            expect(clicks).toBe(1);
        });

        it('is not clicked by other keys', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1" clickable={true}></limel-info-tile>
            );
            await waitForChanges();
            let clicks = 0;
            root.addEventListener('click', () => clicks++);

            root.shadowRoot!.querySelector('.tile').dispatchEvent(
                new KeyboardEvent('keydown', { key: 'a', bubbles: true })
            );

            expect(clicks).toBe(0);
        });
    });

    describe('when clickable but the tile is disabled', () => {
        it('is a disabled button, neither focusable nor given the 3d hover effect', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    clickable={true}
                    disabled={true}
                ></limel-info-tile>
            );
            await waitForChanges();

            const tile = root.shadowRoot!.querySelector('.tile');
            expect(tile.getAttribute('role')).toEqual('button');
            expect(tile.getAttribute('aria-disabled')).toEqual('true');
            expect(tile.classList.contains('is-clickable')).toBe(false);
            expect(tile.getAttribute('tabindex')).toBeNull();
            expect(tile.querySelector('limel-3d-hover-effect-glow')).toBeNull();
        });

        it('does not pass a click on to the host', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    clickable={true}
                    disabled={true}
                ></limel-info-tile>
            );
            await waitForChanges();
            let clicks = 0;
            root.addEventListener('click', () => clicks++);

            root.shadowRoot!.querySelector('.tile').dispatchEvent(
                new MouseEvent('click', { bubbles: true, composed: true })
            );

            expect(clicks).toBe(0);
        });

        it('does not pass a click on the badge to the host', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    badge={3}
                    clickable={true}
                    disabled={true}
                ></limel-info-tile>
            );
            await waitForChanges();
            let clicks = 0;
            root.addEventListener('click', () => clicks++);

            root.shadowRoot!.querySelector('limel-badge').dispatchEvent(
                new MouseEvent('click', { bubbles: true, composed: true })
            );

            expect(clicks).toBe(0);
        });
    });

    describe('when both a link and clickable are supplied', () => {
        it('stays a link and is not announced as a button', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    clickable={true}
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            const anchor = root.shadowRoot!.querySelector('a');
            expect(anchor.getAttribute('href')).toEqual('https://example.com');
            expect(anchor.getAttribute('role')).toBeNull();
        });
    });

    describe('when the href of the link can run a script', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it.each([
            ['javascript:alert(1)'],
            [' JavaScript:alert(1)'],
            ['data:text/html,x'],
        ])('is not a link for %j', async (href) => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1" link={{ href }}></limel-info-tile>
            );
            await waitForChanges();

            const tile = root.shadowRoot!.querySelector('.tile');
            expect(tile.tagName).toEqual('DIV');
            expect(tile.hasAttribute('href')).toBe(false);
            expect(tile.classList.contains('is-clickable')).toBe(false);
        });

        it('warns once about it', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    link={{ href: 'javascript:alert(1)' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            expect(warn).toHaveBeenCalledTimes(1);
        });
    });

    describe('when value is empty', () => {
        it('does not crash and renders the label', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile label="Test label"></limel-info-tile>
            );
            await waitForChanges();

            const label = root.shadowRoot!.querySelector('.label');
            expect(label).not.toBeNull();
            expect(label.textContent).toEqual('Test label');
        });
    });

    describe('when the tile is removed while it is still hovered', () => {
        // `mouseleave` never fires in this case, so the 3d tilt effect's
        // `document` level `mousemove` listener has to be removed by the
        // tile's `disconnectedCallback` instead.
        it('stops tilting', async () => {
            const { root, waitForChanges, unmount } = await render(
                <limel-info-tile
                    value="Test value"
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();

            root.dispatchEvent(new MouseEvent('mouseenter'));
            moveMouse();

            expect(root.style.getPropertyValue(TILT)).not.toBe('');

            unmount();
            moveMouse();

            expect(root.style.getPropertyValue(TILT)).toBe('');
        });
    });

    describe('when the tile is disabled while it is hovered', () => {
        it('stops tilting once the pointer leaves', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile
                    value="1"
                    link={{ href: 'https://example.com' }}
                ></limel-info-tile>
            );
            await waitForChanges();
            root.dispatchEvent(new MouseEvent('mouseenter'));

            root.disabled = true;
            await waitForChanges();
            root.dispatchEvent(new MouseEvent('mouseleave'));
            moveMouse();

            expect(root.style.getPropertyValue(TILT)).toBe('');
        });
    });
});
