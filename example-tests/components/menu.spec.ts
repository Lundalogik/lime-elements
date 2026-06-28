import { test, expect, type Page } from '@playwright/test';

// Per-component example test for limel-menu. Unlike the generic runtime/
// accessibility suites (which iterate every documented example), interaction
// tests must know the component, so they live in their own file under
// example-tests/components/.
//
// Coupling (intentional, fails loudly if broken — never silently):
//   1. drives the docs example `limel-example-menu-basic`, whose markup is a
//      `limel-menu` (trigger button labelled "Menu", items Copy/Cut/Paste) plus
//      a `limel-example-value` that reflects the last selected item;
//   2. the menu surface renders as a portal on document.body (a sibling of the
//      example), so it is located via a top-level `limel-menu-surface` locator,
//      not as a descendant of the example.

const EXAMPLE = 'limel-example-menu-basic';

// The trigger is a `limel-button`, which both reflects role="button" on its
// host AND renders an inner native <button> — so an unscoped
// getByRole('button', { name: 'Menu' }) matches two elements and fails (or
// races on hydration). Scope to the inner button of the trigger host: it is
// unambiguous and is the focusable element the keyboard path needs.
const triggerButton = (page: Page) =>
    page
        .locator('limel-button[slot="trigger"]')
        .getByRole('button', { name: 'Menu' });

const openMenuByClick = async (page: Page) => {
    const trigger = triggerButton(page);
    await expect(trigger).toBeVisible();
    await trigger.click();
    const surface = page.locator('limel-menu-surface');
    await expect(surface).toBeVisible();

    return surface;
};

test.describe('limel-menu', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`/#/debug/${EXAMPLE}`);
    });

    test('opens on click and emits the selected item to the consumer', async ({
        page,
    }) => {
        const surface = await openMenuByClick(page);

        // All three items render (separator is not an item).
        for (const name of ['Copy', 'Cut', 'Paste']) {
            await expect(
                surface.getByText(name, { exact: true })
            ).toBeVisible();
        }

        await surface.getByText('Copy', { exact: true }).click();

        // Primary contract: the `select` event crossed the component boundary
        // with the right payload and reached the consumer (the example value).
        await expect(page.locator('limel-example-value')).toContainText('Copy');
        // Corroborating: the menu closed after selection.
        await expect(surface).toBeHidden();
    });

    test('opens via keyboard (Enter on the focused trigger)', async ({
        page,
    }) => {
        const trigger = triggerButton(page);
        await expect(trigger).toBeVisible();
        await trigger.focus();
        await page.keyboard.press('Enter');

        await expect(page.locator('limel-menu-surface')).toBeVisible();
    });

    test('open menu matches the visual baseline', async ({ page }) => {
        // Pixel comparison only runs in the pinned Playwright Docker image
        // (locally via scripts/visual-tests-docker.sh, in CI via container:),
        // because macOS and Linux render fonts/anti-aliasing differently. On a
        // bare host this test is skipped rather than failing on a pixel mismatch.
        test.skip(
            !process.env.RUN_VISUAL_SNAPSHOTS,
            'visual snapshots only run in the pinned Docker/CI environment'
        );

        await openMenuByClick(page);

        // Capture the whole component — the trigger button and the menu surface
        // together — so the baseline verifies the menu's position relative to the
        // button, not just the surface in isolation. The surface is a body portal
        // (rendered outside the example's subtree), so a full-viewport capture is
        // what spans both; scoping to the surface alone would drop the positioning.
        await expect(page).toHaveScreenshot('menu-open.png');
    });
});
