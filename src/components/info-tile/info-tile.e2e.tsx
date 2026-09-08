import { render, h } from '@stencil/vitest';

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
        // Nothing to activate, so the tile must not signal that it can be.
        it('is neither focusable nor given the 3d hover effect', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="1"></limel-info-tile>
            );
            await waitForChanges();

            const anchor = root.shadowRoot!.querySelector('a');
            expect(anchor.classList.contains('is-clickable')).toBe(false);
            expect(anchor.getAttribute('tabindex')).toBeNull();
            expect(
                anchor.querySelector('limel-3d-hover-effect-glow')
            ).toBeNull();
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
});
