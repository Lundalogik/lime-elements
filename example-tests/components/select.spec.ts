import { test, expect, type Page } from '@playwright/test';

// Per-component example test for limel-select. Unlike the generic runtime/
// accessibility suites (which iterate every documented example), interaction
// tests must know the component, so they live in their own file under
// example-tests/components/.
//
// This file covers keyboard navigation of the dropdown — the typeahead, and
// where focus lands after picking an option. Both need real key events and real
// focus, which is why they are tested here rather than in select.e2e.tsx.
//
// Coupling (intentional, fails loudly if broken — never silently):
//   1. drives the docs examples `limel-example-select-basic` (heroes Luke
//      Skywalker / Han Solo (disabled) / Leia Organo),
//      `limel-example-select-with-separators` (US states grouped by separators)
//      and `limel-example-select-multiple`, each of which renders a
//      `limel-example-value` reflecting the current value;
//   2. the dropdown renders as a portal on document.body (a sibling of the
//      example), so it is located via a top-level `limel-menu-surface` locator,
//      not as a descendant of the example.

const trigger = (page: Page) =>
    page.locator('limel-select button.limel-select-trigger');

const surface = (page: Page) => page.locator('limel-menu-surface');

// Types on the trigger rather than through `page.keyboard`, so that Playwright
// waits for the trigger to be actionable and focuses it first. Pressing through
// the keyboard directly races the focus, and the key is then lost.
//
// The whole sequence goes through a single `pressSequentially`, without an
// `await` between the characters. Anything awaited mid-sequence — a visibility
// assertion, a poll — is a round trip to the browser, and enough of them would
// outlast `TYPEAHEAD_BUFFER_TIMEOUT` on a loaded runner, so the characters would
// no longer be treated as one word.
const openByTyping = async (page: Page, characters: string) => {
    await expect(trigger(page)).toBeVisible();
    await trigger(page).pressSequentially(characters);
    await expect(surface(page)).toBeVisible();
};

const openByClick = async (page: Page) => {
    await expect(trigger(page)).toBeVisible();
    await trigger(page).click();
    await expect(surface(page)).toBeVisible();
};

/**
 * The label of the option that currently has focus.
 *
 * Read through `evaluate` rather than a locator, because focus lives on a row
 * inside `limel-list`'s shadow root and there is no selector for "the focused
 * element".
 *
 * @param page - the page the example is rendered on
 */
const focusedOption = (page: Page) =>
    page.evaluate(() => {
        const list = document.querySelector('limel-menu-surface limel-list');
        const row = list?.shadowRoot?.activeElement;

        return row?.querySelector('.label')?.textContent ?? null;
    });

test.describe('limel-select keyboard navigation', () => {
    test.describe('with a plain list of options', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/#/debug/limel-example-select-basic');
        });

        test('opens and highlights the match, without changing the value', async ({
            page,
        }) => {
            await openByTyping(page, 'l');

            await expect.poll(() => focusedOption(page)).toBe('Luke Skywalker');
            // The primary contract: typing highlights, it does not select.
            await expect(page.locator('limel-example-value')).not.toContainText(
                'luke'
            );
        });

        test('cycles past disabled options when the same character is repeated', async ({
            page,
        }) => {
            await openByTyping(page, 'l');
            await expect.poll(() => focusedOption(page)).toBe('Luke Skywalker');

            // Deliberately pressed after the assertion above, so the buffer may
            // well have been discarded by now. A lone character has to keep
            // cycling from the highlighted row either way — a user pausing
            // between presses expects to keep moving, not to start over.
            await page.keyboard.press('l');

            // Skips the disabled "Han Solo", which also starts with an "L"
            // in its value but not its text — the text is what matters.
            await expect.poll(() => focusedOption(page)).toBe('Leia Organo');
        });

        test('matches all the typed characters, not just the first', async ({
            page,
        }) => {
            await openByTyping(page, 'le');

            await expect.poll(() => focusedOption(page)).toBe('Leia Organo');
        });

        test('still selects the highlighted option with Enter', async ({
            page,
        }) => {
            await openByTyping(page, 'le');
            await expect.poll(() => focusedOption(page)).toBe('Leia Organo');

            await page.keyboard.press('Enter');

            await expect(page.locator('limel-example-value')).toContainText(
                'leia'
            );
            await expect(surface(page)).toBeHidden();
        });

        test('starts over after the dropdown is dismissed', async ({
            page,
        }) => {
            await openByTyping(page, 'le');
            await expect.poll(() => focusedOption(page)).toBe('Leia Organo');

            await page.keyboard.press('Escape');
            await expect(surface(page)).toBeHidden();

            // A discarded buffer is the only way this can match: "l" appended
            // to the previous "le" would be "lel", which matches no option, so
            // the dropdown would not even reopen.
            await openByTyping(page, 'l');

            await expect.poll(() => focusedOption(page)).toBe('Luke Skywalker');
        });
    });

    test.describe('with separators between the options', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/#/debug/limel-example-select-with-separators');
        });

        test('counts separators when addressing an option by index', async ({
            page,
        }) => {
            // "Alaska" sits after a separator, and "Arizona" after two more.
            // Landing on either proves the indexing accounts for them.
            await openByTyping(page, 'a');
            await expect.poll(() => focusedOption(page)).toBe('Alaska');

            await page.keyboard.press('a');
            await expect.poll(() => focusedOption(page)).toBe('Arizona');
        });

        test('matches text containing a space', async ({ page }) => {
            // There are four states starting with "New", so getting to
            // "New York" is only possible if the space is matched rather than
            // treated as a selection.
            await openByTyping(page, 'new y');

            await expect.poll(() => focusedOption(page)).toBe('New York');
        });
    });

    test.describe('when several options can be selected', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/#/debug/limel-example-select-multiple');
        });

        test('still selects the highlighted option with the space bar', async ({
            page,
        }) => {
            // Opened without typing, so that the space bar keeps its usual
            // meaning rather than continuing a typeahead.
            await openByClick(page);
            await expect.poll(() => focusedOption(page)).toBe('Luke Skywalker');

            await page.keyboard.press(' ');

            await expect(page.locator('limel-example-value')).toContainText(
                'luke'
            );
        });

        test('keeps the picked option focused, so the next one is a key away', async ({
            page,
        }) => {
            await openByClick(page);
            await expect.poll(() => focusedOption(page)).toBe('Luke Skywalker');

            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await expect.poll(() => focusedOption(page)).toBe('Obi-Wan Kenobi');

            await page.keyboard.press(' ');
            await expect(page.locator('limel-example-value')).toContainText(
                'Obi-Wan'
            );

            // Asserted after the value has landed, so the re-render that
            // picking triggers has already happened. Focus must survive it:
            // picking several options in a row is the point of a multiple
            // select, and starting over from the top after each one makes that
            // unusable.
            await expect.poll(() => focusedOption(page)).toBe('Obi-Wan Kenobi');

            // Navigation continues from where it left off.
            await page.keyboard.press('ArrowDown');
            await expect.poll(() => focusedOption(page)).toBe('Yoda');

            await page.keyboard.press(' ');
            await expect(page.locator('limel-example-value')).toContainText(
                'Yoda'
            );
        });
    });
});
