import { render, h } from '@stencil/vitest';
import { Chip } from './chip.types';

describe('limel-chip-set', () => {
    const value: Chip[] = [{ id: 1, text: 'Attachment.pdf' }];

    test('the language is passed on to the chips it renders', async () => {
        // The chip owns the accessible names of its remove button and its
        // action menu.
        const { root, waitForChanges } = await render(
            <limel-chip-set type="input" language="no" value={value} />
        );
        await waitForChanges();

        const chip = root.shadowRoot.querySelector('limel-chip') as any;
        expect(chip).not.toBeFalsy();
        expect(chip.language).toBe('no');
    });
});
