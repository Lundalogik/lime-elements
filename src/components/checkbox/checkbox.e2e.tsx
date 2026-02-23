import { render, h } from '@stencil/vitest';

describe('limel-checkbox (events)', () => {
    async function setup(props: Record<string, any> = {}) {
        const { root, waitForChanges, spyOnEvent } = await render(
            <limel-checkbox {...props}></limel-checkbox>
        );
        await waitForChanges();
        const input: HTMLInputElement | null = root.shadowRoot?.querySelector(
            'input[type="checkbox"]'
        );

        return { root, input, waitForChanges, spyOnEvent };
    }

    it('emits change event with correct detail when toggled', async () => {
        const { input, waitForChanges, spyOnEvent } = await setup({
            checked: false,
        });
        const changeSpy = spyOnEvent('change');
        input!.checked = true;
        input!.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
        );
        await waitForChanges();
        expect(changeSpy).toHaveReceivedEventTimes(1);
        expect(changeSpy).toHaveReceivedEventDetail(true);
    });

    it('renders the input as disabled when the disabled prop is set', async () => {
        const { input } = await setup({ disabled: true, checked: false });
        expect(input!.disabled).toBe(true);
    });

    it('marks invalid when required and unchecked after interaction', async () => {
        const { root, input, waitForChanges } = await setup({
            required: true,
            checked: false,
        });
        // Simulate user interaction (toggle true then false) to set modified
        input!.checked = true;
        input!.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
        );
        await waitForChanges();
        input!.checked = false;
        input!.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
        );
        await waitForChanges();
        // invalid state applied to wrapper div
        const wrapper = root.shadowRoot?.querySelector('.checkbox');
        expect(wrapper?.classList.contains('invalid')).toBe(true);
    });
});
