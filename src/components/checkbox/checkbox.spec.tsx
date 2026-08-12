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

describe('limel-checkbox (host element id handling)', () => {
    async function setup(props: Record<string, any> = {}) {
        const { root, waitForChanges } = await render(
            <limel-checkbox {...props}></limel-checkbox>
        );
        await waitForChanges();

        return { root, waitForChanges };
    }

    // Regression test for the internal id token colliding with the native
    // `HTMLElement.id` property. Previously the component held a private field
    // named `id`, whose initializer ran in the constructor as `this.id = …`,
    // invoking the native `id` setter and stamping an attribute onto the host.
    // That both polluted the host's `id` and made the element non-pristine after
    // construction, which throws `NotSupportedError: The result must not have
    // attributes` when a framework creates it synchronously via
    // `document.createElement()` (e.g. Vue).
    it('does not stamp a generated id onto the host element', async () => {
        const { root } = await setup();
        expect(root.getAttribute('id')).toBeNull();
    });

    it('leaves a consumer-provided host id untouched', async () => {
        const { root } = await setup({ id: 'my-checkbox' });
        expect(root.getAttribute('id')).toBe('my-checkbox');
    });

    it('still associates the internal input with its label', async () => {
        const { root } = await setup();
        const input = root.shadowRoot?.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;
        const label = root.shadowRoot?.querySelector('label');
        expect(input.id).toBeTruthy();
        expect(label?.getAttribute('for')).toBe(input.id);
    });
});
