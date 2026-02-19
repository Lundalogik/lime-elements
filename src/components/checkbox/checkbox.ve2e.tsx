import { render, h } from '@stencil/vitest';

describe('limel-checkbox (events)', () => {
    async function setup(props: Record<string, any> = {}) {
        const { root, waitForChanges } = await render(
            <limel-checkbox {...props}></limel-checkbox>
        );
        await waitForChanges();
        const input: HTMLInputElement | null = root.shadowRoot?.querySelector(
            'input[type="checkbox"]'
        );

        return { root, input, waitForChanges };
    }

    it('emits change event with correct detail when toggled', async () => {
        const { root, input, waitForChanges } = await setup({ checked: false });
        const handler = vi.fn();
        root.addEventListener('change', (e: Event) =>
            handler((e as CustomEvent<boolean>).detail)
        );
        input!.checked = true;
        input!.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
        );
        await waitForChanges();
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(true);
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
