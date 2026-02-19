import { render, h } from '@stencil/vitest';

describe('limel-icon-button', () => {
    describe('smoke test', () => {
        it('displays the correct label on the tooltip', async () => {
            const { root, waitForChanges } = await render(
                <limel-icon-button
                    icon="unit-test"
                    label="Add favorite"
                ></limel-icon-button>
            );
            await waitForChanges();

            const tooltip = root.shadowRoot!.querySelector('limel-tooltip');
            expect(tooltip).not.toBeNull();
            expect(tooltip.getAttribute('label')).toEqual('Add favorite');
        });
    });
});
