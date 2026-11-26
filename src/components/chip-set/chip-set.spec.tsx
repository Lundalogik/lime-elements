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

    test('the initials are passed on to the chips it renders', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set
                value={[
                    {
                        id: 1,
                        text: 'Northwind Bikes AB',
                        initials: {
                            name: 'Northwind Bikes AB',
                            nameType: 'company',
                        },
                    },
                ]}
            />
        );
        await waitForChanges();

        const chip = root.shadowRoot.querySelector('limel-chip') as any;
        expect(chip.initials).toEqual({
            name: 'Northwind Bikes AB',
            nameType: 'company',
        });
    });

    test('the initials are passed on to the chips of an input chip set', async () => {
        const { root, waitForChanges } = await render(
            <limel-chip-set
                type="input"
                value={[
                    {
                        id: 1,
                        text: 'Elin Berg',
                        initials: { name: 'Elin Berg' },
                    },
                ]}
            />
        );
        await waitForChanges();

        const chip = root.shadowRoot.querySelector('limel-chip') as any;
        expect(chip.initials).toEqual({ name: 'Elin Berg' });
    });
});
