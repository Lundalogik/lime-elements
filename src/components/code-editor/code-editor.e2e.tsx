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
});
