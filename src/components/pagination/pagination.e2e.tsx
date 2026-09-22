import { render, h } from '@stencil/vitest';
import { GoToPageEvent } from './pagination.types';

// A popover carries the field it holds into a container of its own on the
// page, so that it can escape anything that clips. That only happens in a
// real browser, which is why these live here rather than beside the other
// specs. What the field itself does is covered in
// `jump/pagination-jump.e2e.tsx`, where it is rendered on its own and needs
// no popover at all.
describe('limel-pagination, jumping to a page', () => {
    const PAGE_SIZE = 20;
    const TOTAL_ITEMS = 9840;
    const LAST_PAGE = 492;

    let rendered: { unmount: () => void } | undefined;

    // Left standing, a component keeps whatever it put on the document, and a
    // popover leaves behind the container it moved its content into. The next
    // test then finds this one's, and can pass on what it left behind.
    afterEach(() => {
        rendered?.unmount();
        rendered = undefined;

        for (const container of document.querySelectorAll(
            '.limel-portal--container'
        )) {
            container.remove();
        }
    });

    async function open(index = 0) {
        const pages: GoToPageEvent[] = [];
        const result = await render(
            <limel-pagination
                page={50}
                pageSize={PAGE_SIZE}
                totalItems={TOTAL_ITEMS}
                onGoToPage={(event: CustomEvent) => pages.push(event.detail)}
            ></limel-pagination>
        );
        rendered = result;

        const { root, waitForChanges } = result;
        await waitForChanges();

        gaps(root)[index]?.click();
        await waitForChanges();
        await waitForChanges();

        return { root, waitForChanges, pages };
    }

    type Root = HTMLLimelPaginationElement;

    const gaps = (root: Root): NodeListOf<HTMLElement> =>
        root.shadowRoot.querySelectorAll<HTMLElement>('.gap');
    const jumpField = (): HTMLLimelPaginationJumpElement =>
        document
            .querySelector('limel-popover-surface')
            ?.shadowRoot?.querySelector('limel-pagination-jump');
    const askFor = (page: number) => {
        jumpField()?.dispatchEvent(new CustomEvent('jump', { detail: page }));
    };
    const openPopovers = (root: Root): HTMLLimelPopoverElement[] =>
        [
            ...root.shadowRoot.querySelectorAll<HTMLLimelPopoverElement>(
                'limel-popover'
            ),
        ].filter((popover) => popover.open);

    test('hands the open gap a field to jump from', async () => {
        await open();

        expect(jumpField()).toBeTruthy();
        expect(jumpField().pageCount).toBe(LAST_PAGE);
        expect(jumpField().page).toBe(50);
    });

    test('carries a page typed in the popover out as a page to go to', async () => {
        // Every other test here hands the pagination a synthetic `jump`. This
        // one drives the field itself, through the popover that moved it into
        // another shadow root — the seam this feature actually rests on.
        const { pages, waitForChanges } = await open();

        const input = jumpField()
            ?.shadowRoot?.querySelector('limel-input-field')
            ?.shadowRoot?.querySelector('input');
        input.value = '300';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await waitForChanges();

        jumpField()
            ?.shadowRoot?.querySelector<HTMLElement>('limel-button')
            ?.click();

        expect(pages[0]?.page).toBe(300);
    });

    test('puts the field away when its gap stops being one', async () => {
        // The open gap is remembered by the slot it sits in, and a page set
        // from outside can put a page number there. Left open, the popover
        // would come back by itself the next time a gap landed on that slot.
        const { root, waitForChanges } = await open();

        // Page 2 puts a page number where the open gap was.
        root.page = 2;
        await waitForChanges();
        expect(openPopovers(root)).toHaveLength(0);

        // Page 50 puts a gap back in that same slot. Forgetting to let the
        // open one go is only visible here: it springs open on its own.
        root.page = 50;
        await waitForChanges();
        expect(openPopovers(root)).toHaveLength(0);
    });

    test('keeps the popover close inside the control', async () => {
        // `limel-dialog` closes on a `close` it receives, so a composed one
        // from the field's popover would take down a dialog the pagination
        // sits in.
        const { root, waitForChanges } = await open();
        const escaped: Event[] = [];
        root.addEventListener('close', (event: Event) => escaped.push(event));

        openPopovers(root)[0].dispatchEvent(
            new CustomEvent('close', { bubbles: true, composed: true })
        );
        await waitForChanges();

        expect(escaped).toHaveLength(0);
        expect(openPopovers(root)).toHaveLength(0);
    });

    test('shows which gap is holding the open field', async () => {
        // What the pressed look hangs off, so that one of two identical
        // markers can be seen to be the one that is open.
        const { root } = await open();

        expect(gaps(root)[0].getAttribute('aria-expanded')).toBe('true');
        expect(gaps(root)[1].getAttribute('aria-expanded')).toBe('false');
    });

    test('asks for the page the field reports', async () => {
        const { pages } = await open();

        askFor(300);

        expect(pages).toEqual([
            {
                page: 300,
                reason: 'user',
                pageSize: PAGE_SIZE,
                offset: 5980,
            },
        ]);
    });

    test('reaches a page on the other side of the gap that was opened', async () => {
        // The two gaps are one control. Scoping each to the pages it happens
        // to hide would make them behave differently while looking identical,
        // and turn away someone who wanted page 3.
        const { pages } = await open(1);

        askFor(3);

        expect(pages[0].page).toBe(3);
    });

    test('puts the field away once it has been used', async () => {
        const { root, waitForChanges } = await open();

        askFor(300);
        await waitForChanges();

        expect(openPopovers(root)).toHaveLength(0);
    });

    test('puts the keyboard back on the gap while the page loads', async () => {
        // The field is taken down with the popover, so focus has to go
        // somewhere; the marker it came out of is still on screen, and is
        // where it stays if the consumer declines to show the page.
        const { root, waitForChanges } = await open();

        askFor(300);
        await waitForChanges();

        expect(root.shadowRoot.activeElement).toBe(gaps(root)[0]);
    });

    test('puts the keyboard on the page it asked for, once it arrives', async () => {
        // The control is told what to show, so committing only asks. Focus
        // waits on the gap and follows when the page lands.
        const { root, waitForChanges } = await open();

        askFor(300);
        await waitForChanges();

        root.page = 300;
        await waitForChanges();

        expect(
            root.shadowRoot.activeElement?.getAttribute('aria-current')
        ).toBe('page');
    });

    test('still follows the page when the gap it came from is gone', async () => {
        // Jumping from the left gap to page 3 turns that slot into a page
        // number, so the marker holding the keyboard is taken away with it.
        // Both other focus tests jump 50 -> 300, where the gap survives.
        const { root, waitForChanges } = await open();

        askFor(3);
        await waitForChanges();

        root.page = 3;
        await waitForChanges();

        expect(
            root.shadowRoot.activeElement?.getAttribute('aria-current')
        ).toBe('page');
        expect(root.shadowRoot.activeElement?.textContent).toContain('3');
    });

    test('stops waiting when the consumer answers with a different page', async () => {
        // Showing something else is an answer too. Going on waiting would
        // mean a later, unrelated arrival at the page once asked for moved
        // the keyboard as though it were the reply.
        const { root, waitForChanges } = await open();

        askFor(300);
        await waitForChanges();

        // The keyboard stays on the marker throughout: page 7 and page 300
        // both keep a gap in that slot, so nothing takes it away.
        root.page = 7;
        await waitForChanges();
        root.page = 300;
        await waitForChanges();

        expect(root.shadowRoot.activeElement).toBe(gaps(root)[0]);
    });

    test('leaves the keyboard alone if the user has moved it themselves', async () => {
        const { root, waitForChanges } = await open();

        askFor(300);
        await waitForChanges();

        const previous = root.shadowRoot.querySelector<HTMLElement>(
            'button.arrow.previous'
        );
        previous.focus();
        root.page = 300;
        await waitForChanges();

        expect(root.shadowRoot.activeElement).toBe(previous);
    });
});
