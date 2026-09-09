import { render, h } from '@stencil/vitest';
import { Button } from '../button/button.types';

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
        const items: Button[] = [
            { id: '1', title: 'Lime' },
            { id: '2', title: 'Apple', disabled: true },
            { id: '3', title: 'Tasks' },
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

            // Positive control, so the assertion above cannot pass just
            // because the click never reached anything.
            labels[0].click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(1);
        });

        it('marks the disabled item with aria-disabled', async () => {
            const { root, waitForChanges } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            await waitForChanges();

            const inputs = root.shadowRoot.querySelectorAll<HTMLInputElement>(
                'input[type="radio"]'
            );
            expect(inputs[0].getAttribute('aria-disabled')).toEqual('false');
            expect(inputs[1].getAttribute('aria-disabled')).toEqual('true');
        });

        it('dims the disabled item without dimming its divider', async () => {
            const { root, waitForChanges } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            await waitForChanges();

            const buttons =
                root.shadowRoot.querySelectorAll<HTMLElement>('.button');
            const label = buttons[1].querySelector('label');

            expect(getComputedStyle(label).opacity).toEqual('0.4');
            expect(getComputedStyle(label).cursor).toEqual('not-allowed');

            // The divider is a pseudo-element of the button, so dimming the
            // button itself would compound with its own opacity.
            expect(getComputedStyle(buttons[1], '::after').opacity).toEqual(
                '0.1'
            );
            expect(getComputedStyle(buttons[0]).opacity).toEqual('1');
        });

        it('ignores a change event dispatched on the disabled input', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const inputs = root.shadowRoot.querySelectorAll<HTMLInputElement>(
                'input[type="radio"]'
            );
            inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(0);
        });

        it('ignores a click after the disabled attribute is removed', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-button-group value={items}></limel-button-group>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const inputs = root.shadowRoot.querySelectorAll<HTMLInputElement>(
                'input[type="radio"]'
            );
            inputs[1].removeAttribute('disabled');
            inputs[1].click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(0);
        });
    });

    describe('disabled button group', () => {
        const items: Button[] = [
            { id: '1', title: 'Lime' },
            { id: '2', title: 'Apple', disabled: true },
            { id: '3', title: 'Tasks' },
        ];

        it('disables every input', async () => {
            const { root, waitForChanges } = await render(
                <limel-button-group value={items} disabled></limel-button-group>
            );
            await waitForChanges();

            const inputs = root.shadowRoot.querySelectorAll<HTMLInputElement>(
                'input[type="radio"]'
            );
            expect([...inputs].map((input) => input.disabled)).toEqual([
                true,
                true,
                true,
            ]);
        });

        it('dims every button without dimming the dividers', async () => {
            const { root, waitForChanges } = await render(
                <limel-button-group value={items} disabled></limel-button-group>
            );
            await waitForChanges();

            const buttons =
                root.shadowRoot.querySelectorAll<HTMLElement>('.button');

            expect(
                [...buttons].map(
                    (button) =>
                        getComputedStyle(button.querySelector('label')).cursor
                )
            ).toEqual(['not-allowed', 'not-allowed', 'not-allowed']);
            expect(
                getComputedStyle(buttons[0].querySelector('label')).opacity
            ).toEqual('0.4');
            expect(getComputedStyle(buttons[0], '::after').opacity).toEqual(
                '0.1'
            );
        });

        it('does not emit a change event when a button is clicked', async () => {
            const { root, waitForChanges, spyOnEvent } = await render(
                <limel-button-group value={items} disabled></limel-button-group>
            );
            const changeSpy = spyOnEvent('change');
            await waitForChanges();

            const labels =
                root.shadowRoot.querySelectorAll<HTMLElement>('.button label');
            labels[0].click();
            await waitForChanges();

            expect(changeSpy).toHaveReceivedEventTimes(0);
        });
    });
});
