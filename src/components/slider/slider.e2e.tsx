import { render, h } from '@stencil/vitest';
import {
    getAccessibleNames,
    getAccessibleNodes,
    getInvalidStates,
} from '../../util/test/accessibility-tree';

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

describe('limel-slider accessible description', () => {
    it('is the helper text', async () => {
        const { waitForChanges } = await render(
            <limel-slider
                label="Volume"
                helperText="Between 0 and 100"
                value={30}
            />
        );
        await waitForChanges();

        expect(await getAccessibleNodes('slider')).toEqual([
            { name: 'Volume', description: 'Between 0 and 100' },
        ]);
    });
});

describe('limel-slider invalid state', () => {
    it('is not invalid by default', async () => {
        const { waitForChanges } = await render(
            <limel-slider label="Volume" value={30} />
        );
        await waitForChanges();

        expect(await getInvalidStates('slider')).toEqual([false]);
    });

    it('is invalid when the slider is', async () => {
        const { waitForChanges } = await render(
            <limel-slider label="Volume" value={30} invalid={true} />
        );
        await waitForChanges();

        expect(await getInvalidStates('slider')).toEqual([true]);
    });

    it('follows a change of the invalid state', async () => {
        const { root, waitForChanges } = await render(
            <limel-slider label="Volume" value={30} invalid={true} />
        );
        await waitForChanges();

        (root as HTMLLimelSliderElement).invalid = false;
        await waitForChanges();

        expect(await getInvalidStates('slider')).toEqual([false]);
    });
});
