import { render, h } from '@stencil/vitest';

describe('limel-checkbox (aria semantics)', () => {
    async function setup(props: Record<string, any> = {}) {
        const { root, waitForChanges } = await render(
            <limel-checkbox {...props}></limel-checkbox>
        );
        await waitForChanges();

        return { root, waitForChanges };
    }

    it('sets aria-checked="false" when unchecked', async () => {
        const { root } = await setup({ checked: false });
        const input = root.shadowRoot?.querySelector('input[type="checkbox"]');
        expect(input?.getAttribute('aria-checked')).toBe('false');
    });

    it('sets aria-checked="true" when checked', async () => {
        const { root, waitForChanges } = await setup({ checked: false });
        (root as any).checked = true;
        await waitForChanges();
        const input = root.shadowRoot?.querySelector('input[type="checkbox"]');
        expect(input?.getAttribute('aria-checked')).toBe('true');
    });

    it('sets aria-checked="mixed" and checked property true when indeterminate', async () => {
        const { root, waitForChanges } = await setup({ checked: false });
        (root as any).indeterminate = true;
        await waitForChanges();
        const input = root.shadowRoot?.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;
        expect(input.getAttribute('aria-checked')).toBe('mixed');
        expect(input.checked).toBe(true);
        expect(input.indeterminate).toBe(true);
    });

    it('returns to aria-checked="false" when indeterminate cleared and still unchecked', async () => {
        const { root, waitForChanges } = await setup({
            checked: false,
            indeterminate: true,
        });
        (root as any).indeterminate = false;
        await waitForChanges();
        const input = root.shadowRoot?.querySelector('input[type="checkbox"]');
        expect(input?.getAttribute('aria-checked')).toBe('false');
    });

    it('renders dynamic-label instead of native input when readonly', async () => {
        const { root } = await setup({ readonly: true, checked: true });
        const input = root.shadowRoot?.querySelector('input[type="checkbox"]');
        const dyn = root.shadowRoot?.querySelector('limel-dynamic-label');
        expect(input).toBeNull();
        expect(dyn).not.toBeNull();
    });

    it('clears indeterminate state properties when toggled from mixed to checked', async () => {
        const { root, waitForChanges } = await setup({
            indeterminate: true,
            checked: false,
        });
        (root as any).checked = true;
        (root as any).indeterminate = false;
        await waitForChanges();
        const input = root.shadowRoot?.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;
        expect(input.indeterminate).toBe(false);
        expect(input.checked).toBe(true);
        expect(input.getAttribute('aria-checked')).toBe('true');
    });
});
