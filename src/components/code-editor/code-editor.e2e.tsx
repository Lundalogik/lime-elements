import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';
import { getAccessibleNodes } from '../../util/test/accessibility-tree';

describe('limel-code-editor accessible description', () => {
    it('is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-code-editor label="Query" helperText="Written in SQL" />
        );
        await waitForChanges();

        await vi.waitFor(async () => {
            expect(await getAccessibleNodes('textbox')).toEqual([
                { name: 'Query', description: 'Written in SQL' },
            ]);
        });
    });

    it('is not pointed at by aria-controls', async () => {
        const { root, waitForChanges } = await render(
            <limel-code-editor label="Query" helperText="Written in SQL" />
        );
        await waitForChanges();

        await vi.waitFor(() => {
            const input = root.shadowRoot.querySelector('.editor textarea');
            expect(input.getAttribute('aria-describedby')).not.toBeNull();
            expect(input.hasAttribute('aria-controls')).toBe(false);
        });
    });
});
