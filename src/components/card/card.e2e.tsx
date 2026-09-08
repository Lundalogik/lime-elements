import { render, h } from '@stencil/vitest';

const TILT = '--limel-3d-hover-effect-rotate3d';

const moveMouse = () => {
    document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 20, clientY: 30 })
    );
};

describe('limel-card', () => {
    describe('when the card is removed while it is still hovered', () => {
        // `mouseleave` never fires in this case, so the 3d tilt effect's
        // `document` level `mousemove` listener has to be removed by the
        // card's `disconnectedCallback` instead.
        it('stops tilting', async () => {
            const { root, waitForChanges, unmount } = await render(
                <limel-card></limel-card>
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
