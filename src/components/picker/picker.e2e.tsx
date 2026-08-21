import { render, h } from '@stencil/vitest';
import { PickerItem } from './picker-item.types';

const allItems = [
    { text: 'Apple', value: 1 },
    { text: 'Banana', value: 2 },
];

const berries = [
    { text: 'Blueberry', value: 1 },
    { text: 'Blackberry', value: 2 },
    { text: 'Cherry', value: 3 },
];

const POLL_TIMEOUT = 500;
const POLL_INTERVAL = 20;

/**
 * Flushes renders until `isSettled` holds, or the timeout runs out. The
 * number of passes between "the searcher resolved" and "the suggestion
 * text is in the DOM" varies with machine load, so it cannot be fixed.
 *
 * @param isSettled - what the caller is waiting for
 * @param waitForChanges - flushes pending renders
 */
async function pollUntil(
    isSettled: () => boolean,
    waitForChanges: () => Promise<void>
) {
    const deadline = Date.now() + POLL_TIMEOUT;
    await waitForChanges();

    while (!isSettled() && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        await waitForChanges();
    }
}

/**
 * Waits for the suggestion list to render, texts included.
 *
 * @param waitForChanges - flushes pending renders
 */
async function waitForSuggestions(waitForChanges: () => Promise<void>) {
    await pollUntil(
        () =>
            getSuggestions().length > 0 &&
            getSuggestions().every((item) => !!item.textContent?.trim()),
        waitForChanges
    );
}

/**
 * Waits for text to show up in the dropdown.
 *
 * @param text - the text to wait for
 * @param waitForChanges - flushes pending renders
 */
async function waitForText(text: string, waitForChanges: () => Promise<void>) {
    await pollUntil(
        () => !!document.body.textContent?.includes(text),
        waitForChanges
    );
}

/**
 * Outlives the search debounce. Only for asserting that a search did *not*
 * happen — there is nothing to poll for then.
 *
 * @param waitForChanges - flushes pending renders
 */
async function waitOutDebounce(waitForChanges: () => Promise<void>) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await waitForChanges();
    await waitForChanges();
}

/**
 * Mirrors emitted values back onto the picker, the way a consumer does.
 * Without it the picker never learns what has been picked.
 *
 * @param root - the picker under test
 */
function echoValueChanges(root: HTMLLimelPickerElement) {
    root.addEventListener('change', (event: Event) => {
        root.value = (event as CustomEvent).detail;
    });
}

/**
 * A searcher that records every query it is asked for.
 *
 * @returns the recorded queries, and the searcher to hand to the picker
 */
function recordingSearcher() {
    const queries: string[] = [];
    const searcher = async (query: string) => {
        queries.push(query);

        return berries.filter((berry) =>
            berry.text.toLowerCase().includes(query.toLowerCase())
        );
    };

    return { queries: queries, searcher: searcher };
}

function getSearchInput(root: HTMLLimelPickerElement) {
    const chipSet = root.shadowRoot!.querySelector('limel-chip-set')!;

    return chipSet.shadowRoot!.querySelector('input')!;
}

async function focusAndType(
    root: HTMLLimelPickerElement,
    text: string,
    waitForChanges: () => Promise<void>
) {
    const input = getSearchInput(root);
    input.focus();
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitForChanges();
}

function getSuggestions(): HTMLElement[] {
    const list = document.querySelector(
        'limel-menu-surface limel-list:not(.static-actions-list)'
    );

    return [...(list?.shadowRoot?.querySelectorAll('limel-list-item') ?? [])];
}

/**
 * The text of the separators in the suggestion list. A `ListSeparator`
 * renders as a `<li role="separator">` in `limel-list`'s shadow root, not
 * as a `limel-list-item`, so neither `getSuggestions` nor
 * `document.body.textContent` can see it.
 *
 * @returns the separator texts
 */
function getSuggestionSeparatorTexts(): string[] {
    const list = document.querySelector(
        'limel-menu-surface limel-list:not(.static-actions-list)'
    );
    const separators =
        list?.shadowRoot?.querySelectorAll('[role="separator"]') ?? [];

    return [...separators].map((item) => item.textContent ?? '');
}

function getSuggestionTexts(): string[] {
    return getSuggestions().map((item) => item.textContent ?? '');
}

function findSuggestion(text: string): HTMLElement | undefined {
    return getSuggestions().find((item) => item.textContent?.includes(text));
}

/**
 * Waits for a suggestion to be present and carrying its text.
 *
 * @param text - the text of the suggestion to wait for
 * @param waitForChanges - flushes pending renders
 * @returns the suggestion element
 */
async function getSuggestion(
    text: string,
    waitForChanges: () => Promise<void>
): Promise<HTMLElement> {
    await pollUntil(() => !!findSuggestion(text), waitForChanges);

    const suggestion = findSuggestion(text);
    if (!suggestion) {
        throw new Error(
            `No suggestion matching "${text}". Found: ${JSON.stringify(
                getSuggestionTexts()
            )}`
        );
    }

    return suggestion;
}

async function pickSuggestion(
    text: string,
    waitForChanges: () => Promise<void>
) {
    const suggestion = await getSuggestion(text, waitForChanges);

    suggestion.click();
    await waitForChanges();
}

/**
 * Picks a suggestion with <kbd>Enter</kbd>. MDC turns that into the list's
 * `change` event and the same keydown keeps bubbling to the `limel-list`
 * host — a sequence `click()` never produces.
 *
 * @param text - the text of the suggestion to pick
 * @param waitForChanges - flushes pending renders
 */
async function pickSuggestionWithKeyboard(
    text: string,
    waitForChanges: () => Promise<void>
) {
    const suggestion = await getSuggestion(text, waitForChanges);

    suggestion.focus();
    suggestion.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            composed: true,
        })
    );
    await waitForChanges();
}

/**
 * Removes the first chip by mouse: pressing the remove button focuses it,
 * which blurs the search input. `click()` alone moves no focus.
 *
 * @param root - the picker under test
 * @param waitForChanges - flushes pending renders
 */
async function removeFirstChipByMouse(
    root: HTMLLimelPickerElement,
    waitForChanges: () => Promise<void>
) {
    const chipSet = root.shadowRoot!.querySelector('limel-chip-set')!;
    const chip = chipSet.shadowRoot!.querySelector('limel-chip')!;
    const removeButton =
        chip.shadowRoot!.querySelector<HTMLElement>('.remove-button')!;
    removeButton.focus();
    removeButton.click();
    await waitForChanges();
}

async function removeFirstChip(
    root: HTMLLimelPickerElement,
    waitForChanges: () => Promise<void>
) {
    const chipSet = root.shadowRoot!.querySelector('limel-chip-set')!;
    const chip = chipSet.shadowRoot!.querySelector('limel-chip')!;
    const removeButton =
        chip.shadowRoot!.querySelector<HTMLElement>('.remove-button')!;
    removeButton.click();
    await waitForChanges();
}

describe('limel-picker', () => {
    describe('when no items match the typed query', () => {
        it('shows the default translated empty-result message', async () => {
            const { root, waitForChanges } = await render(
                <limel-picker label="Pick" allItems={allItems}></limel-picker>
            );
            await waitForChanges();
            await focusAndType(root, 'xyz', waitForChanges);
            await waitForText('No results matching "xyz"', waitForChanges);

            expect(document.body.textContent).toContain(
                'No results matching "xyz"'
            );
        });

        it('shows the consumer override when `emptyResultMessage` is set, and the default text is gone', async () => {
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    allItems={allItems}
                    emptyResultMessage="No participants found"
                ></limel-picker>
            );
            await waitForChanges();
            await focusAndType(root, 'xyz', waitForChanges);
            await waitForText('No participants found', waitForChanges);

            expect(document.body.textContent).toContain(
                'No participants found'
            );
            expect(document.body.textContent).not.toContain(
                'No results matching'
            );
        });
    });

    describe('when more items exist than the default searcher returns', () => {
        it('does not spend the cap on already picked items', async () => {
            const many = Array.from({ length: 25 }, (_, index) => ({
                text: `Item ${index}`,
                value: index,
            }));
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    multiple={true}
                    value={many.slice(0, 20)}
                    allItems={many}
                ></limel-picker>
            );
            echoValueChanges(root);
            await waitForChanges();

            const chipSet = root.shadowRoot!.querySelector('limel-chip-set')!;
            await chipSet.setFocus();
            await waitForSuggestions(waitForChanges);

            expect(getSuggestionTexts()).toEqual([
                expect.stringContaining('Item 20'),
                expect.stringContaining('Item 21'),
                expect.stringContaining('Item 22'),
                expect.stringContaining('Item 23'),
                expect.stringContaining('Item 24'),
            ]);
        });
    });

    describe('when the searcher fails', () => {
        it('shows the empty-result message instead of a spinner', async () => {
            const failingSearcher = async () => {
                throw new Error('the backend is down');
            };
            const rejections: unknown[] = [];
            const recordRejection = (event: PromiseRejectionEvent) => {
                rejections.push(event.reason);
            };
            window.addEventListener('unhandledrejection', recordRejection);
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    searcher={failingSearcher}
                ></limel-picker>
            );
            await waitForChanges();
            await focusAndType(root, 'xyz', waitForChanges);
            await waitForText('No results matching "xyz"', waitForChanges);
            await waitOutDebounce(waitForChanges);
            window.removeEventListener('unhandledrejection', recordRejection);

            expect(document.body.textContent).toContain(
                'No results matching "xyz"'
            );
            expect(document.querySelector('limel-spinner')).toBeNull();
            expect(rejections).toEqual([]);
        });
    });

    describe('when picking an item from a multi-pick list', () => {
        describe('by default', () => {
            it('clears the typed query', async () => {
                const { root, waitForChanges } = await render(
                    <limel-picker
                        label="Pick"
                        multiple={true}
                        allItems={berries}
                    ></limel-picker>
                );
                echoValueChanges(root);
                await waitForChanges();
                await focusAndType(root, 'black', waitForChanges);

                await pickSuggestion('Blackberry', waitForChanges);
                await waitForSuggestions(waitForChanges);

                expect(getSearchInput(root).value).toEqual('');
            });

            it('repopulates the dropdown with the default suggestions', async () => {
                const { root, waitForChanges } = await render(
                    <limel-picker
                        label="Pick"
                        multiple={true}
                        allItems={berries}
                    ></limel-picker>
                );
                echoValueChanges(root);
                await waitForChanges();
                await focusAndType(root, 'black', waitForChanges);

                await pickSuggestion('Blackberry', waitForChanges);
                await waitForSuggestions(waitForChanges);

                const suggestions = getSuggestionTexts();
                expect(
                    suggestions.some((text) => text.includes('Blueberry'))
                ).toBe(true);
                expect(
                    suggestions.some((text) => text.includes('Cherry'))
                ).toBe(true);
                expect(
                    suggestions.some((text) => text.includes('Blackberry'))
                ).toBe(false);
            });

            it('asks the searcher for the default suggestions only once', async () => {
                const { queries, searcher } = recordingSearcher();
                const { root, waitForChanges } = await render(
                    <limel-picker
                        label="Pick"
                        multiple={true}
                        searcher={searcher}
                    ></limel-picker>
                );
                echoValueChanges(root);
                await waitForChanges();
                await focusAndType(root, 'black', waitForChanges);
                await waitOutDebounce(waitForChanges);
                expect(queries).toEqual(['black']);

                await pickSuggestion('Blackberry', waitForChanges);
                await waitOutDebounce(waitForChanges);

                expect(queries).toEqual(['black', '']);
            });

            it('asks the searcher for the default suggestions only once when picking with the keyboard', async () => {
                const { queries, searcher } = recordingSearcher();
                const { root, waitForChanges } = await render(
                    <limel-picker
                        label="Pick"
                        multiple={true}
                        searcher={searcher}
                    ></limel-picker>
                );
                echoValueChanges(root);
                await waitForChanges();
                await focusAndType(root, 'black', waitForChanges);
                await waitOutDebounce(waitForChanges);
                expect(queries).toEqual(['black']);

                await pickSuggestionWithKeyboard('Blackberry', waitForChanges);
                await waitOutDebounce(waitForChanges);

                expect(queries).toEqual(['black', '']);
            });
        });
    });

    describe('when two items share a chip id', () => {
        it('keeps every remaining chip exactly once', async () => {
            const one: PickerItem = { text: 'One', value: 1 };
            const uno: PickerItem = { text: 'Uno', value: '1' };
            const two: PickerItem = { text: 'Two', value: 2 };
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    multiple={true}
                    value={[one, uno, two]}
                    allItems={[one, uno, two]}
                ></limel-picker>
            );
            const emitted: PickerItem[][] = [];
            root.addEventListener('change', (event: Event) => {
                emitted.push((event as CustomEvent).detail);
            });
            await waitForChanges();

            const chipSet = root.shadowRoot!.querySelector('limel-chip-set')!;
            const chips = [
                ...chipSet.shadowRoot!.querySelectorAll('limel-chip'),
            ];
            const removeTwo =
                chips[2]!.shadowRoot!.querySelector<HTMLElement>(
                    '.remove-button'
                )!;
            removeTwo.click();
            await waitForChanges();

            expect(emitted.at(-1)!.map((item) => item.text)).toEqual([
                'One',
                'Uno',
            ]);
        });
    });

    describe('when a chip is removed while searching', () => {
        it('clears the typed query', async () => {
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    multiple={true}
                    value={[berries[2]]}
                    allItems={berries}
                ></limel-picker>
            );
            echoValueChanges(root);
            await waitForChanges();
            await focusAndType(root, 'black', waitForChanges);
            await waitForSuggestions(waitForChanges);
            expect(getSearchInput(root).value).toEqual('black');

            await removeFirstChip(root, waitForChanges);
            await waitForSuggestions(waitForChanges);

            expect(getSearchInput(root).value).toEqual('');
        });

        it('goes back to the default suggestions, with the removed item pickable again', async () => {
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    multiple={true}
                    value={[berries[2]]}
                    allItems={berries}
                ></limel-picker>
            );
            echoValueChanges(root);
            await waitForChanges();
            await focusAndType(root, 'black', waitForChanges);
            await waitForSuggestions(waitForChanges);
            expect(getSuggestionTexts()).toEqual([
                expect.stringContaining('Blackberry'),
            ]);

            await removeFirstChip(root, waitForChanges);
            await waitForSuggestions(waitForChanges);

            const suggestions = getSuggestionTexts();
            expect(suggestions.some((text) => text.includes('Cherry'))).toBe(
                true
            );
            expect(suggestions.some((text) => text.includes('Blueberry'))).toBe(
                true
            );
            expect(getSuggestionSeparatorTexts()).toEqual([]);
        });

        it('does not refresh the suggestions when the removal moved focus out of the input', async () => {
            const { queries, searcher } = recordingSearcher();
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    multiple={true}
                    value={[berries[2]]}
                    searcher={searcher}
                ></limel-picker>
            );
            echoValueChanges(root);
            await waitForChanges();
            await focusAndType(root, 'black', waitForChanges);
            await waitOutDebounce(waitForChanges);
            expect(queries).toEqual(['black']);

            await removeFirstChipByMouse(root, waitForChanges);
            await waitOutDebounce(waitForChanges);

            expect(queries).toEqual(['black']);
        });

        it('does not search when the dropdown was never opened', async () => {
            const { queries, searcher } = recordingSearcher();
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    multiple={true}
                    value={[berries[2]]}
                    searcher={searcher}
                ></limel-picker>
            );
            echoValueChanges(root);
            await waitForChanges();

            await removeFirstChip(root, waitForChanges);
            await waitOutDebounce(waitForChanges);

            expect(queries).toEqual([]);
        });

        it('does not search when a single-pick picker is emptied', async () => {
            const { queries, searcher } = recordingSearcher();
            const { root, waitForChanges } = await render(
                <limel-picker
                    label="Pick"
                    value={berries[2]}
                    searcher={searcher}
                ></limel-picker>
            );
            echoValueChanges(root);
            await waitForChanges();

            await removeFirstChip(root, waitForChanges);
            await waitOutDebounce(waitForChanges);

            expect(queries).toEqual([]);
        });
    });
});
