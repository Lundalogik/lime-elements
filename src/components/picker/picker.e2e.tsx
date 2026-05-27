import { render, h } from '@stencil/vitest';

const allItems = [
    { text: 'Apple', value: 1 },
    { text: 'Banana', value: 2 },
];

async function focusAndType(
    root: HTMLLimelPickerElement,
    text: string,
    waitForChanges: () => Promise<void>
) {
    const chipSet = root.shadowRoot!.querySelector('limel-chip-set')!;
    const input = chipSet.shadowRoot!.querySelector('input')!;
    input.focus();
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    // Wait for the picker's 300ms search debounce plus a small margin.
    await new Promise((resolve) => setTimeout(resolve, 400));
    await waitForChanges();
}

describe('limel-picker', () => {
    describe('when no items match the typed query', () => {
        it('shows the default translated empty-result message', async () => {
            const { root, waitForChanges } = await render(
                <limel-picker label="Pick" allItems={allItems}></limel-picker>
            );
            await waitForChanges();
            await focusAndType(root, 'xyz', waitForChanges);

            expect(document.body.textContent).toContain(
                'No results matching "xyz"'
            );
        });

        it('shows the consumer override when `emptyResultMessage` is set, and the default text is gone', async () => {
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    allItems={allItems}
                    emptyResultMessage="No participants found"
                ></limel-picker>
            );
            await waitForChanges();
            await focusAndType(root, 'xyz', waitForChanges);

            expect(document.body.textContent).toContain(
                'No participants found'
            );
            expect(document.body.textContent).not.toContain(
                'No results matching'
            );
        });
    });
});
