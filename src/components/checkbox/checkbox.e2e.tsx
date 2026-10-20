import { render, h } from '@stencil/vitest';
import {
    getAccessibleNodes,
    getInvalidStates,
} from '../../util/test/accessibility-tree';

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

describe('limel-checkbox accessible description', () => {
    it('is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-checkbox
                label="Accept the terms"
                helperText="Needed to continue"
            />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('checkbox')).toEqual([
            { name: 'Accept the terms', description: 'Needed to continue' },
        ]);
    });
});

describe('limel-checkbox aria-controls', () => {
    it('does not point at the helper text', async () => {
        const { root, waitForChanges } = await render(
            <limel-checkbox
                label="Accept the terms"
                helperText="Needed to continue"
            />
        );
        await waitForChanges();

        const input = root.shadowRoot.querySelector('input');
        expect(input.hasAttribute('aria-controls')).toBe(false);
    });
});

describe('limel-checkbox invalid state', () => {
    it('is not invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-checkbox label="Accept" />
        );
        await waitForChanges();

        expect(await getInvalidStates('checkbox')).toEqual([false]);
    });

    it('is invalid when the checkbox is', async () => {
        const { waitForChanges } = await render(
            <limel-checkbox label="Accept" invalid={true} />
        );
        await waitForChanges();

        expect(await getInvalidStates('checkbox')).toEqual([true]);
    });

    it('is marked invalid when a required checkbox has been used and is unchecked again', async () => {
        // Chromium reports a required, unchecked checkbox as invalid by
        // itself, so the attribute is what shows that the component marks it.
        const { root, waitForChanges } = await render(
            <limel-checkbox label="Accept" required={true} />
        );
        await waitForChanges();
        const input = root.shadowRoot.querySelector('input');
        expect(input.hasAttribute('aria-invalid')).toBe(false);

        input.click();
        (root as HTMLLimelCheckboxElement).checked = true;
        await waitForChanges();
        expect(input.hasAttribute('aria-invalid')).toBe(false);

        (root as HTMLLimelCheckboxElement).checked = false;
        await waitForChanges();
        expect(input.getAttribute('aria-invalid')).toBe('true');
    });
});
