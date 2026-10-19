import { render, h } from '@stencil/vitest';
import { getAccessibleNames } from '../../util/test/accessibility-tree';

describe('limel-slider', () => {
    describe('accessible name', () => {
        it('is the label', async () => {
            const { waitForChanges } = await render(
                <limel-slider label="Volume" value={30} />
            );
            await waitForChanges();

            expect(await getAccessibleNames('slider')).toEqual(['Volume']);
        });

        it('is still the label when a helper text is shown', async () => {
            const { waitForChanges } = await render(
                <limel-slider
                    label="Volume"
                    helperText="Between 0 and 100"
                    value={30}
                />
            );
            await waitForChanges();

            expect(await getAccessibleNames('slider')).toEqual(['Volume']);
        });
    });
});
