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

            const buttons = root.shadowRoot.querySelectorAll('.button');
            expect(buttons.length).toEqual(3);
            expect(buttons[0].textContent).toContain('Lime');
        });

        it('emits a change event when a button is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const label = root.shadowRoot.querySelector(
                '.button label'
            ) as HTMLElement;
            label.click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
            expect(changeSpy).toHaveReceivedEventDetail({
                id: '1',
                title: 'Lime',
            });
        });
    });

    describe('button group with a disabled item', () => {
        const items = [
            { id: '1', title: 'Lime' },
            { id: '2', title: 'Apple', disabled: true },
        ];

        it('disables only the input of the disabled item', async () => {
            const { root, waitForChanges } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            await waitForChanges();

            const inputs = root.shadowRoot.querySelectorAll<HTMLInputElement>(
                'input[type="radio"]'
            );
            expect(inputs[0].disabled).toEqual(false);
            expect(inputs[1].disabled).toEqual(true);
        });

        it('does not emit a change event when the disabled item is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const labels =
                root.shadowRoot.querySelectorAll<HTMLElement>('.button label');
            labels[1].click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(0);
        });
    });
});
