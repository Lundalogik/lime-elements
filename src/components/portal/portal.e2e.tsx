import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';

describe('limel-portal', () => {
    const getContainer = () =>
        document.querySelector('#test-portal') as HTMLElement;

    const isShown = () => getContainer().classList.contains('is-visible');

    it('says when the content is shown, also when it is shown again', async () => {
        const { root } = await render(
            <limel-portal containerId="test-portal">
                <div>Content</div>
            </limel-portal>
        );
        const portal = root as HTMLLimelPortalElement;

        portal.visible = true;
        await portal.whenShown();
        expect(isShown()).toBe(true);

        portal.visible = false;
        await vi.waitFor(() => {
            expect(isShown()).toBe(false);
        });
        portal.visible = true;
        await portal.whenShown();

        expect(isShown()).toBe(true);
    });
});
