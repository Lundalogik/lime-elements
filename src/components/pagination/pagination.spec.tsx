import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';
import { GoToPageEvent } from './pagination.types';

describe('limel-pagination', () => {
    async function setup(props: Record<string, any> = {}) {
        // The handler is bound before the component loads, because the
        // component can emit while loading — when the page it was given does
        // not exist. A listener added after `render` would miss that.
        const pages: GoToPageEvent[] = [];
        const { root, waitForChanges } = await render(
            <limel-pagination
                {...props}
                onGoToPage={(event: CustomEvent) => pages.push(event.detail)}
            ></limel-pagination>
        );
        await waitForChanges();

        return { root, waitForChanges, pages };
    }

    type Root = HTMLLimelPaginationElement;

    const pageButton = (root: Root, page: number): HTMLButtonElement =>
        root.shadowRoot?.querySelector(`button.page[data-page="${page}"]`);
    const arrow = (root: Root, direction: string): HTMLButtonElement =>
        root.shadowRoot?.querySelector(`button.arrow.${direction}`);
    const currentPage = (root: Root): string =>
        root.shadowRoot?.querySelector('[aria-current="page"]')?.textContent;
    const liveRegion = (root: Root): string =>
        root.shadowRoot?.querySelector('.live-region')?.textContent;
    const nav = (root: Root): HTMLElement =>
        root.shadowRoot?.querySelector('nav');

    describe('the event', () => {
        it('carries everything a fetch needs', async () => {
            const { root, pages } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            pageButton(root, 2).click();

            expect(pages).toEqual([
                {
                    page: 2,
                    reason: 'user',
                    pageSize: 20,
                    offset: 20,
                },
            ]);
        });

        it('counts the offset from the start of the set', async () => {
            const { root, pages } = await setup({
                page: 1,
                pageSize: 25,
                totalItems: 500,
            });

            pageButton(root, 20).click();

            expect(pages[0].offset).toBe(475);
        });

        it('does not move itself, so a refused load needs no undoing', async () => {
            // The control asks and waits. A consumer that cannot honour the
            // request simply never sets `page`, and nothing on screen has to
            // be put back.
            const { root, waitForChanges, pages } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            pageButton(root, 2).click();
            await waitForChanges();

            expect(pages[0].page).toBe(2);
            expect(currentPage(root)).toBe('1');
        });

        it('says nothing when the user clicks the page they are on', async () => {
            const { root, pages } = await setup({
                page: 3,
                pageSize: 20,
                totalItems: 248,
            });

            pageButton(root, 3).click();

            expect(pages).toEqual([]);
        });

        it('bubbles, so a container can listen for it', async () => {
            const { root } = await setup({ pageSize: 20, totalItems: 248 });
            const onDocument = vi.fn();
            document.addEventListener('goToPage', onDocument);

            pageButton(root, 2).click();

            expect(onDocument).toHaveBeenCalled();
            document.removeEventListener('goToPage', onDocument);
        });
    });

    describe('moving', () => {
        it('marks the page it is showing', async () => {
            const { root } = await setup({
                page: 4,
                pageSize: 20,
                totalItems: 248,
            });

            expect(currentPage(root)).toBe('4');
        });

        it('steps forward', async () => {
            const { root, pages } = await setup({
                page: 4,
                pageSize: 20,
                totalItems: 248,
            });

            arrow(root, 'next').click();

            expect(pages[0].page).toBe(5);
        });

        it('refuses to step past the end', async () => {
            const { root, pages } = await setup({
                page: 13,
                pageSize: 20,
                totalItems: 248,
            });

            arrow(root, 'next').click();

            expect(pages).toEqual([]);
        });

        it('says nothing when the consumer moves the page themselves', async () => {
            // They asked for page 5 and got page 5, so there is nothing to
            // report — the same as when `page` starts out at 5.
            const { root, waitForChanges, pages } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            root.page = 5;
            await waitForChanges();

            expect(currentPage(root)).toBe('5');
            expect(pages).toEqual([]);
        });

        it('ignores clicks while a page is loading', async () => {
            const { root, pages } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
                loading: true,
            });

            pageButton(root, 2).click();

            expect(pages).toEqual([]);
        });

        it('shows and says that it is busy while a page loads', async () => {
            // `aria-disabled` rather than the `disabled` attribute, so an
            // unusable button keeps its place in the tab order instead of
            // vanishing from under someone navigating by keyboard. Swapping it
            // for the real attribute would leave every other test green,
            // because the clicks are guarded separately.
            const { root } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
                loading: true,
            });

            expect(nav(root).getAttribute('aria-busy')).toBe('true');
            expect(pageButton(root, 3).getAttribute('aria-disabled')).toBe(
                'true'
            );
            expect(pageButton(root, 3).hasAttribute('disabled')).toBe(false);
            expect(
                pageButton(root, 2).querySelector('limel-spinner')
            ).toBeTruthy();
        });

        it('is neither busy nor disabled once the page has landed', async () => {
            const { root } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            expect(nav(root).hasAttribute('aria-busy')).toBe(false);
            expect(pageButton(root, 3).hasAttribute('aria-disabled')).toBe(
                false
            );
            expect(
                pageButton(root, 2).querySelector('limel-spinner')
            ).toBeFalsy();
        });
    });

    describe('what it describes', () => {
        it('gives every page button a tooltip of its own', async () => {
            // The tooltip is nested inside the button it describes and points
            // at it by id. `limel-tooltip` resolves that owner once, when it
            // connects, so a tooltip that found the wrong id would silently
            // describe nothing for the life of the component.
            const { root } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            const button = pageButton(root, 3);
            const tooltip: HTMLLimelTooltipElement =
                button.querySelector('limel-tooltip');

            expect(button.id).toBeTruthy();
            expect(tooltip.elementId).toBe(button.id);
        });

        it('names every button for a screen reader', async () => {
            const { root } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            expect(pageButton(root, 3).getAttribute('aria-label')).toBe(
                'Go to page 3'
            );
            expect(pageButton(root, 2).getAttribute('aria-label')).toBe(
                'Page 2, current page'
            );
            expect(arrow(root, 'next').getAttribute('aria-label')).toBe(
                'Next page'
            );
            expect(nav(root).getAttribute('aria-label')).toBe('Pagination');
        });
    });

    describe('a page that does not exist', () => {
        it('shows the last one that does, and says so', async () => {
            const { root, pages } = await setup({
                page: 99,
                pageSize: 20,
                totalItems: 60,
            });

            expect(currentPage(root)).toBe('3');
            expect(pages).toEqual([
                {
                    page: 3,
                    reason: 'clamped',
                    pageSize: 20,
                    offset: 40,
                },
            ]);
        });

        it('pulls the user back when the set shrinks under them', async () => {
            const { root, waitForChanges, pages } = await setup({
                page: 9,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = 30;
            await waitForChanges();

            expect(currentPage(root)).toBe('2');
            expect(pages).toEqual([
                {
                    page: 2,
                    reason: 'clamped',
                    pageSize: 20,
                    offset: 20,
                },
            ]);
        });

        it('says so when it refuses a page it cannot move to', async () => {
            // Already on the last page, and asked for one past the end. The
            // component cannot honour that and does not move — but the
            // consumer now believes it is on page 99, and the page it actually
            // settled on is private, so silence would leave the two out of
            // step for good.
            const { root, waitForChanges, pages } = await setup({
                page: 3,
                pageSize: 20,
                totalItems: 60,
            });

            root.page = 99;
            await waitForChanges();

            expect(currentPage(root)).toBe('3');
            expect(pages).toEqual([
                {
                    page: 3,
                    reason: 'clamped',
                    pageSize: 20,
                    offset: 40,
                },
            ]);
        });

        it('still marks a page when one is set out of range after loading', async () => {
            // Clamping used to happen only on load, so a `page` set later — the
            // documented way to restore one from a URL — left no button marked.
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 60,
            });

            root.page = 999;
            await waitForChanges();

            expect(currentPage(root)).toBe('3');
        });
    });

    describe('two props that change together', () => {
        // Settling used to happen once per property assignment, against
        // whatever the other properties still held, so the order of these two
        // lines decided where the component landed.
        async function narrowTheSet(set: (root: Root) => void) {
            const { root, waitForChanges, pages } = await setup({
                page: 9,
                pageSize: 20,
                totalItems: 248,
            });

            set(root);
            await waitForChanges();

            return { page: currentPage(root), pages: pages };
        }

        it('lands on the same page when the count is set first', async () => {
            const { page, pages } = await narrowTheSet((root) => {
                root.totalItems = 30;
                root.page = 1;
            });

            expect(page).toBe('1');
            expect(pages).toEqual([]);
        });

        it('lands on the same page when the page is set first', async () => {
            const { page, pages } = await narrowTheSet((root) => {
                root.page = 1;
                root.totalItems = 30;
            });

            expect(page).toBe('1');
            expect(pages).toEqual([]);
        });
    });

    describe('while the count is being fetched', () => {
        it('keeps the set it last knew about', async () => {
            const { root, waitForChanges } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = null;
            await waitForChanges();

            expect(pageButton(root, 13)).toBeTruthy();
        });

        it('re-derives that set from a new page size', async () => {
            // The last count is remembered, not the page count it implied — so
            // a page size that changes while the count is away still lands on
            // the right number of pages.
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = null;
            root.pageSize = 100;
            await waitForChanges();

            expect(pageButton(root, 3)).toBeTruthy();
            expect(pageButton(root, 13)).toBeFalsy();
        });
    });

    describe('while the count is unknown', () => {
        it('draws the shape it knew but does not report against it', async () => {
            // The shape is what we last saw; it is not evidence about the set
            // now being loaded. Clamping page 9 away against it would destroy a
            // restored page that is about to turn out perfectly valid, and the
            // real count arriving later cannot undo that.
            const { root, waitForChanges, pages } = await setup({
                page: 1,
                pageSize: 100,
                totalItems: 248,
            });

            root.totalItems = null;
            root.page = 9;
            await waitForChanges();

            // It still draws page 3, because holding the old shape is what
            // stops the control resizing on every fetch. What it does not do
            // is tell the consumer their page was wrong on that evidence.
            expect(currentPage(root)).toBe('3');
            expect(pages).toEqual([]);
        });

        it('acts on it again once a count arrives', async () => {
            const { root, waitForChanges, pages } = await setup({
                page: 1,
                pageSize: 100,
                totalItems: 248,
            });

            root.totalItems = null;
            root.page = 9;
            await waitForChanges();
            root.totalItems = 248;
            await waitForChanges();

            expect(pages).toEqual([
                {
                    page: 3,
                    reason: 'clamped',
                    pageSize: 100,
                    offset: 200,
                },
            ]);
        });

        it('does not report the same correction twice across a refresh', async () => {
            // The clamp is reported, the count goes away while the next one
            // loads, and comes back the same. Nothing changed, so there is
            // nothing to say a second time.
            const { root, waitForChanges, pages } = await setup({
                page: 99,
                pageSize: 20,
                totalItems: 60,
            });

            root.totalItems = null;
            await waitForChanges();
            root.totalItems = 60;
            await waitForChanges();

            expect(pages).toHaveLength(1);
        });

        it('still shows which page it is on', async () => {
            // Arrows with no number between them say less than they look like
            // they do: there is nothing to tell the user where they are.
            const { root } = await setup({
                page: 9,
                pageSize: 20,
                totalItems: null,
            });

            expect(currentPage(root)).toBe('9');
        });
    });

    describe('what it announces', () => {
        it('says nothing before the user has moved', async () => {
            const { root } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            expect(liveRegion(root)).toBe('');
        });

        it('reads out the range after a move', async () => {
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            pageButton(root, 2).click();
            root.page = 2;
            await waitForChanges();

            expect(liveRegion(root)).toBe('21–40 (of 248)');
        });

        it('reads out a move the user did not ask for', async () => {
            // The set shrinks under them. Being moved in silence is worse than
            // being moved, so this announces like any other move.
            const { root, waitForChanges } = await setup({
                page: 9,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = 30;
            await waitForChanges();

            expect(liveRegion(root)).toBe('21–30 (of 30)');
        });

        it('says nothing when the count merely goes away', async () => {
            // Losing the count rewrites the sentence from a range to a page
            // number, but the user has not moved and the page holds what it
            // held. Announcing it would talk over every fetch.
            const { root, waitForChanges } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = null;
            await waitForChanges();

            expect(liveRegion(root)).toBe('');
        });

        it('says nothing when only the language changes', async () => {
            const { root, waitForChanges } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
            });

            root.language = 'sv';
            await waitForChanges();

            expect(liveRegion(root)).toBe('');
        });

        it('reads out a page whose contents changed under it', async () => {
            // The page number is still 3, but page 3 now holds items 101-150
            // instead of 41-60. Someone who cannot see the screen is owed that
            // as much as they are owed a change of number.
            const { root, waitForChanges } = await setup({
                page: 3,
                pageSize: 20,
                totalItems: 248,
            });

            root.pageSize = 50;
            await waitForChanges();

            expect(currentPage(root)).toBe('3');
            expect(liveRegion(root)).toBe('101–150 (of 248)');
        });

        it('falls back to the page when there is no count to read out', async () => {
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = null;
            await waitForChanges();
            pageButton(root, 2).click();
            root.page = 2;
            await waitForChanges();

            expect(liveRegion(root)).toBe('Page 2, current page');
        });
    });

    describe('language', () => {
        it('writes numbers the way the language does', async () => {
            const { root } = await setup({
                page: 1,
                pageSize: 1,
                totalItems: 9840,
                language: 'sv',
            });

            // A non-breaking space, which is what Swedish groups with. It
            // looks exactly like a plain one, hence the escape.
            expect(pageButton(root, 9840).textContent).toBe('9\u00A0840');
        });

        it('still renders when the language cannot be used', async () => {
            // `Intl.NumberFormat` throws on a tag it cannot parse, and this is
            // called during render — an empty control is the one state a user
            // cannot click their way out of.
            const warn = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => undefined);

            const { root } = await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
                language: 'en_US',
            });

            expect(currentPage(root)).toBe('2');
            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('`language`')
            );
            warn.mockRestore();
        });

        it('says so when a language it cannot write numbers in is given', async () => {
            // `zz` is well formed, so nothing throws — it quietly resolves to
            // whatever locale the machine runs in, which is the one case a
            // try/catch alone would let through in silence.
            const warn = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => undefined);

            await setup({
                page: 2,
                pageSize: 20,
                totalItems: 248,
                language: 'zz',
            });

            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('`language`')
            );
            warn.mockRestore();
        });

        it('rewrites them when the language changes', async () => {
            // The formatter is cached, so this is really a test that the cache
            // is thrown away when it stops being right.
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 1,
                totalItems: 9840,
                language: 'sv',
            });

            root.language = 'en';
            await waitForChanges();

            expect(pageButton(root, 9840).textContent).toBe('9,840');
        });
    });

    describe('input it cannot use', () => {
        let warn: any;

        beforeEach(() => {
            warn = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => undefined);
        });

        afterEach(() => warn.mockRestore());

        it('never asks the consumer to fetch a page that is not a number', async () => {
            // The count has to go bad *after* a good one, so that the pages it
            // knew about are still on screen and there is something to click.
            const { root, waitForChanges, pages } = await setup({
                page: 1,
                pageSize: 20,
                totalItems: 248,
            });

            root.totalItems = Number('no count header');
            await waitForChanges();
            pageButton(root, 2).click();

            expect(pages).toEqual([
                {
                    page: 2,
                    reason: 'user',
                    pageSize: 20,
                    offset: 20,
                },
            ]);
            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('`totalItems`')
            );
        });

        it('falls back to the default page size, not to one', async () => {
            const { root, pages } = await setup({
                page: 1,
                pageSize: 0,
                totalItems: 248,
            });

            pageButton(root, 2).click();

            expect(pages[0]).toEqual({
                page: 2,
                reason: 'user',
                pageSize: 100,
                offset: 100,
            });
            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('`pageSize`')
            );
        });

        it('shows the first page when given one it cannot read', async () => {
            const { root } = await setup({
                page: Number('last'),
                pageSize: 20,
                totalItems: 248,
            });

            expect(currentPage(root)).toBe('1');
            expect(warn).toHaveBeenCalledWith(
                expect.stringContaining('`page`')
            );
        });

        it('asks for a page it cannot read only once', async () => {
            // `NaN` never equals itself, so a careless comparison leaves the
            // component convinced it has never answered, and it re-asks on
            // every render for the life of the component.
            const { root, waitForChanges, pages } = await setup({
                page: Number('last'),
                pageSize: 20,
                totalItems: 248,
            });

            root.loading = true;
            await waitForChanges();
            root.loading = false;
            await waitForChanges();

            expect(pages).toHaveLength(1);
        });

        it('says so again when a fault comes back after being fixed', async () => {
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 0,
                totalItems: 248,
            });

            root.pageSize = 20;
            await waitForChanges();
            root.pageSize = 0;
            await waitForChanges();

            expect(warn).toHaveBeenCalledTimes(2);
        });

        it('mentions each prop once, however often it renders', async () => {
            const { root, waitForChanges } = await setup({
                page: 1,
                pageSize: 0,
                totalItems: 3,
            });

            root.totalItems = 4;
            await waitForChanges();
            root.totalItems = 5;
            await waitForChanges();

            expect(warn).toHaveBeenCalledTimes(1);
        });
    });
});
