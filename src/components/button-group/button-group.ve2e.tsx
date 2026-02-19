import { render, h } from '@stencil/vitest';

describe('limel-button-group', () => {
    describe('basic button group', () => {
        const items = [
            { id: '1', title: 'Lime' },
            { id: '2', title: 'Apple', icon: 'unit-test' },
            { id: '3', title: 'Tasks', badge: 10 },
        ];

        it('renders the buttons', async () => {
            const { root, waitForChanges } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            await waitForChanges();

            const buttons = root.shadowRoot.querySelectorAll('.mdc-chip');
            expect(buttons.length).toEqual(3);
            expect(buttons[0].textContent).toContain('Lime');
        });

        it('emits a change event when a button is clicked', async () => {
            const handleChange = vi.fn();
            const { root, waitForChanges } = await render(
                <limel-button-group
                    value={items}
                    onChange={handleChange}
                ></limel-button-group>
            );
            await waitForChanges();

            const label = root.shadowRoot.querySelector(
                '.mdc-chip label'
            ) as HTMLElement;
            label.click();
            await waitForChanges();

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].detail).toEqual({
                id: '1',
                title: 'Lime',
            });
        });
    });
});
