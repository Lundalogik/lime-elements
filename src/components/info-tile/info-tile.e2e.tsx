import { render, h } from '@stencil/vitest';

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
                <limel-info-tile value="Test value"></limel-info-tile>
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
});
