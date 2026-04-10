import { render, h } from '@stencil/vitest';

describe('limel-markdown', () => {
    describe('DOM morphing', () => {
        it('renders markdown content', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown value="**Hello** world"></limel-markdown>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            expect(container.querySelector('strong').textContent).toBe('Hello');
        });

        it('updates content without destroying preserved elements', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-markdown value="First paragraph"></limel-markdown>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            const firstP = container.querySelector('p');

            await setProps({ value: 'First paragraph\n\nSecond paragraph' });
            await waitForChanges();

            // The first paragraph should be the same DOM node
            expect(container.querySelector('p')).toBe(firstP);
            expect(container.querySelectorAll('p').length).toBe(2);
        });

        it('preserves a whitelisted custom element across value updates', async () => {
            const chipHtml = '<limel-chip text="Test"></limel-chip>';
            const { root, waitForChanges, setProps } = await render(
                <limel-markdown
                    value={`Before\n\n${chipHtml}`}
                ></limel-markdown>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            const chip = container.querySelector('limel-chip');
            expect(chip).not.toBeNull();

            // Update surrounding text, keep the chip
            await setProps({
                value: `Updated before\n\n${chipHtml}\n\nAfter`,
            });
            await waitForChanges();

            const updatedChip = container.querySelector('limel-chip');
            expect(updatedChip).toBe(chip);
        });

        it('renders content after clearing and setting new value', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-markdown value="Initial content"></limel-markdown>
            );
            await waitForChanges();

            await setProps({ value: '' });
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            expect(container.innerHTML).toBe('');

            await setProps({ value: 'New content' });
            await waitForChanges();

            expect(container.querySelector('p').textContent).toBe(
                'New content'
            );
        });
    });
});
