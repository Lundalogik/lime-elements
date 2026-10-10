import { test, expect, type Page } from '@playwright/test';

// Per-component example test for limel-tab-panel, in its vertical layout.
//
// Coupling (intentional, fails loudly if broken — never silently):
//   1. `limel-example-tab-panel-vertical` has the tabs Joker, Parasite and
//      Harriet, with Joker selected;
//   2. the content of a tab says "<name> has received", once it has loaded.

const VERTICAL = 'limel-example-tab-panel-vertical';

const PLACEHOLDER_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>';

test.use({ viewport: { width: 520, height: 480 } });

const tabPanel = (page: Page) => page.locator('limel-tab-panel');
const tab = (page: Page, name: string) =>
    tabPanel(page).getByRole('tab', { name: name });
const content = (page: Page, name: string) =>
    tabPanel(page).getByText(`${name} has received`);

// Stencil flags a component as `hydrated` right before it runs
// `componentDidLoad`. A key press before then would be lost.
const open = async (page: Page) => {
    await page.goto(`/#/debug/${VERTICAL}`);
    await expect(tabPanel(page).locator('limel-tab-bar')).toHaveClass(
        /hydrated/
    );
    await expect(content(page, 'Joker')).toBeVisible();
};

test.describe('limel-tab-panel', () => {
    test.describe('a vertical tab panel', () => {
        test('shows the content of the tab that the down arrow key moves to', async ({
            page,
        }) => {
            await open(page);
            await tab(page, 'Joker').focus();

            await page.keyboard.press('ArrowDown');

            await expect(tab(page, 'Parasite')).toBeFocused();
            await expect(content(page, 'Parasite')).toBeVisible();
            await expect(content(page, 'Joker')).toBeHidden();
        });

        test('keeps the content in place when a badge is added to the widest tab', async ({
            page,
        }) => {
            await open(page);
            await tab(page, 'Parasite').click();
            await expect(content(page, 'Parasite')).toBeVisible();
            const bar = tabPanel(page).locator('limel-tab-bar');
            const before = await bar.boundingBox();

            await tabPanel(page).getByRole('button', { name: 'Vote' }).click();
            await expect(tab(page, 'Parasite')).toContainText('1');

            const after = await bar.boundingBox();
            expect(after?.width).toBe(before?.width);
        });
    });

    test.describe('visual baselines', () => {
        // Pixel comparison only runs in the pinned Playwright Docker image
        // (locally via scripts/visual-tests-docker.sh, in CI via container:),
        // because macOS and Linux render fonts and anti-aliasing differently.
        test.skip(
            !process.env.RUN_VISUAL_SNAPSHOTS,
            'visual snapshots only run in the pinned Docker/CI environment'
        );

        // The docs load their icons from a CDN. Standing in for them keeps the
        // baselines independent of the network, and of the icons themselves.
        test.beforeEach(async ({ page }) => {
            await page.route('**/lime-icons8/**', (route) =>
                route.fulfill({
                    contentType: 'image/svg+xml',
                    body: PLACEHOLDER_ICON,
                })
            );
        });

        test('vertical', async ({ page }) => {
            await open(page);

            await expect(tabPanel(page)).toHaveScreenshot(
                'tab-panel-vertical.png'
            );
        });
    });
});
