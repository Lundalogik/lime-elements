import { render, h } from '@stencil/vitest';
import { getAccessibleProperties } from '../../util/test/accessibility-tree';

describe('limel-date-picker readonly state', () => {
    it('is announced as read only, and not as disabled', async () => {
        const { waitForChanges } = await render(
            <limel-date-picker
                label="When"
                type="date"
                value={new Date('2026-01-02T00:00:00')}
                readonly={true}
            />
        );
        await waitForChanges();

        expect(await getAccessibleProperties('textbox')).toEqual([
            expect.objectContaining({ readonly: true, disabled: false }),
        ]);
    });
});
