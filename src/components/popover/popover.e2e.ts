import { newE2EPage } from '@stencil/core/testing';

const waitForCondition = async (
    condition: () => Promise<boolean>,
    errorMessage: string
) => {
    const timeoutMs = 2000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        if (await condition()) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
    }

    throw new Error(errorMessage);
};

const waitForActiveElementId = async (page: any, id: string) => {
    await waitForCondition(async () => {
        const activeId = await page.evaluate(() => document.activeElement?.id);
        return activeId === id;
    }, `Timed out waiting for focus on #${id}`);
};

const waitForPopoverOpenState = async (page: any, isOpen: boolean) => {
    await waitForCondition(
        async () => {
            const open = await page.evaluate(() => {
                const popover = document.querySelector('limel-popover') as any;
                return Boolean(popover?.open);
            });
            return open === isOpen;
        },
        `Timed out waiting for popover open=${String(isOpen)}`
    );
};

describe('limel-popover', () => {
    it('restores focus to the trigger on Escape dismiss', async () => {
        const page = await newE2EPage();
        await page.setContent(`
            <button id="outside">Outside</button>
            <limel-popover open>
                <button slot="trigger" id="trigger">Trigger</button>
                <button id="inside">Inside</button>
            </limel-popover>
            <script>
                const popover = document.querySelector('limel-popover');
                popover.addEventListener('close', () => {
                    popover.open = false;
                });
            </script>
        `);

        await page.waitForChanges();
        await waitForPopoverOpenState(page, true);

        await page.focus('#outside');
        await page.keyboard.press('Escape');

        await waitForPopoverOpenState(page, false);
        await waitForActiveElementId(page, 'trigger');
    });

    it('restores focus to the trigger on outside click dismiss', async () => {
        const page = await newE2EPage();
        await page.setContent(`
            <button id="outside">Outside</button>
            <limel-popover open>
                <button slot="trigger" id="trigger">Trigger</button>
                <button id="inside">Inside</button>
            </limel-popover>
            <script>
                const popover = document.querySelector('limel-popover');
                popover.addEventListener('close', () => {
                    popover.open = false;
                });
            </script>
        `);

        await page.waitForChanges();
        await waitForPopoverOpenState(page, true);

        await page.focus('#outside');
        await page.click('#outside');

        await waitForPopoverOpenState(page, false);
        await waitForActiveElementId(page, 'trigger');
    });

    it('does not restore focus on programmatic close', async () => {
        const page = await newE2EPage();
        await page.setContent(`
            <input id="elsewhere" />
            <limel-popover open>
                <button slot="trigger" id="trigger">Trigger</button>
                <button id="inside">Inside</button>
            </limel-popover>
        `);

        await page.waitForChanges();
        await waitForPopoverOpenState(page, true);

        await page.focus('#elsewhere');

        await page.evaluate(() => {
            const popover = document.querySelector('limel-popover') as any;
            popover.open = false;
        });
        await page.waitForChanges();

        await waitForPopoverOpenState(page, false);
        await waitForActiveElementId(page, 'elsewhere');
    });
});
