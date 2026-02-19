import { render, h } from '@stencil/vitest';

describe('limel-info-tile', () => {
    describe('smoke test', () => {
        it('displays the correct value', async () => {
            const { root, waitForChanges } = await render(
                <limel-info-tile value="Test value"></limel-info-tile>
            );
            await waitForChanges();

            const valueGroup = root.shadowRoot!.querySelector('.value-group');
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
            expect(label.textContent).toEqual('Test label');
        });
    });
});
