import { render, h } from '@stencil/vitest';
import { afterEach, expect, test, vi } from 'vitest';
import { ESCAPE } from '../../util/keycodes';
import type { SidePanelEntry } from './side-panel.types';

const OWN_EVENTS = ['close', 'changeWidth'];

type Page = Awaited<ReturnType<typeof render>>;

// A list instead of a `let`, because the lint rules do not allow reassignment of
// top-level variables in functions.
const pages: Page[] = [];

// Listeners on `document` are not removed by `unmount`, so they are aborted after
// each test.
const listeners: AbortController[] = [];

afterEach(() => {
    for (const listener of listeners.splice(0)) {
        listener.abort();
    }

    for (const page of pages.splice(0)) {
        page.unmount();
    }
});

test('limel-side-panel: renders the content in the default slot', async () => {
    await renderPanel();

    expect(getContentSlot().assignedElements()).toEqual([getGivenContent()]);
});

test('limel-side-panel: emits close when the close button is clicked', async () => {
    await renderPanel();
    const closed = listenFor('close');

    await pressCloseButton();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: uses closeLabel as the label of the close button', async () => {
    await renderPanel({ closeLabel: 'Stäng' });

    expect(getCloseButton().getAttribute('aria-label')).toBe('Stäng');
    expect(getCloseButton().querySelector('limel-tooltip')!.label).toBe(
        'Stäng'
    );
});

test('limel-side-panel: shows the heading of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Start page' }, { heading: 'Sales pipe' }],
    });

    expect(getHeader().querySelector('.heading')!.textContent).toBe(
        'Sales pipe'
    );
});

test('limel-side-panel: shows the subheading of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', subheading: 'Start page widget' }],
    });

    expect(getHeader().querySelector('.subheading')!.textContent).toBe(
        'Start page widget'
    );
});

test('limel-side-panel: shows the icon of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', icon: 'sales_performance' }],
    });

    expect(getHeader().querySelector('limel-icon')!.name).toBe(
        'sales_performance'
    );
});

test('limel-side-panel: uses the colors of the icon of the last stack entry', async () => {
    await renderPanel({
        stack: [
            {
                heading: 'Sales pipe',
                icon: {
                    name: 'sales_performance',
                    color: 'rgb(255, 0, 0)',
                    backgroundColor: 'rgb(0, 0, 255)',
                },
            },
        ],
    });

    const icon = getHeader().querySelector('limel-icon')!;

    expect(icon.name).toBe('sales_performance');
    expect(icon.style.color).toBe('rgb(255, 0, 0)');
    expect(icon.style.backgroundColor).toBe('rgb(0, 0, 255)');
});

test('limel-side-panel: paints the header with the color of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', color: 'rgb(0, 128, 128)' }],
    });

    expect(getComputedStyle(getHeader()).backgroundColor).toBe(
        'rgb(0, 128, 128)'
    );
});

// The test page does not load the theme, which defines `--color-black`.
test('limel-side-panel: adds a text shadow to the headings on a painted header', async () => {
    await renderPanel({
        style: { '--color-black': '0, 0, 0' },
        stack: [
            {
                heading: 'Sales pipe',
                subheading: 'Start page widget',
                color: 'rgb(0, 128, 128)',
            },
        ],
    });

    for (const heading of getHeader().querySelectorAll('h1, h2')) {
        expect(getComputedStyle(heading).textShadow).not.toBe('none');
    }
});

test('limel-side-panel: shows the headings in white on a painted header', async () => {
    await renderPanel({
        style: { '--color-white': '255, 255, 255' },
        stack: [
            {
                heading: 'Sales pipe',
                subheading: 'Start page widget',
                color: 'rgb(0, 128, 128)',
            },
        ],
    });

    for (const heading of getHeader().querySelectorAll('h1, h2')) {
        expect(getComputedStyle(heading).color).toBe('rgb(255, 255, 255)');
    }
});

test('limel-side-panel: does not add a text shadow to the headings on a header without a color', async () => {
    await renderPanel({
        style: { '--color-black': '0, 0, 0' },
        stack: [{ heading: 'Sales pipe' }],
    });

    expect(
        getComputedStyle(getHeader().querySelector('.heading')!).textShadow
    ).toBe('none');
});

test('limel-side-panel: does not show a header when the stack is empty', async () => {
    await renderPanel();

    expect(getHeader()).toBeNull();
});

test('limel-side-panel: shows a button for each action, labeled with its label', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand' },
            { type: 'newTab', label: 'Open in a new tab' },
        ],
    });

    expect(
        getActionButtons().map((button) => button.getAttribute('aria-label'))
    ).toEqual(['Expand', 'Open in a new tab']);
});

test('limel-side-panel: shows the icon of the type of each action', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand' },
            { type: 'newTab', label: 'Open in a new tab' },
        ],
    });

    expect(
        getActionButtons().map(
            (button) => button.querySelector('limel-icon')!.name
        )
    ).toEqual(['expand', 'up_right_arrow']);
});

test('limel-side-panel: emits selectAction with the id of the clicked action and the click event', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand', id: 'expand-widget' },
            { type: 'newTab', label: 'Open in a new tab', id: 'open-widget' },
        ],
    });
    const selected = listenFor('selectAction');
    const click = new MouseEvent('click', { cancelable: true });

    getActionButtons()[1].dispatchEvent(click);

    expect(selected).toEqual([{ id: 'open-widget', event: click }]);
});

test('limel-side-panel: emits selectAction with the type of a clicked action that has no id', async () => {
    await renderPanel({ actions: [{ type: 'expand', label: 'Expand' }] });
    const selected = listenFor<{ id: string }>('selectAction');

    getActionButtons()[0].click();

    expect(selected.map((detail) => detail.id)).toEqual(['expand']);
});

test('limel-side-panel: shows the label and helperLabel of an action in a tooltip', async () => {
    await renderPanel({
        actions: [
            {
                type: 'newTab',
                label: 'Open in a new tab',
                helperLabel: 'Sales pipe',
            },
        ],
    });
    const button = getActionButtons()[0];
    const tooltip = button.querySelector('limel-tooltip')!;

    expect(tooltip.elementId).toBe(button.id);
    expect(tooltip.label).toBe('Open in a new tab');
    expect(tooltip.helperLabel).toBe('Sales pipe');
});

test('limel-side-panel: shows an action with an href as a link', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand', href: 'https://example.com/' },
        ],
    });
    const link = getActionButtons()[0];

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('https://example.com/');
});

test('limel-side-panel: opens a newTab action with an href in a new tab', async () => {
    await renderPanel({
        actions: [
            { type: 'newTab', label: 'Open', href: 'https://example.com/' },
            { type: 'expand', label: 'Expand', href: 'https://example.com/' },
        ],
    });

    expect(
        getActionButtons().map((link) => link.getAttribute('target'))
    ).toEqual(['_blank', null]);
});

test('limel-side-panel: marks each action with its type, for its hover animation', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand' },
            { type: 'newTab', label: 'Open in a new tab' },
        ],
    });

    expect(
        getActionButtons().map((button) => button.classList.contains('expand'))
    ).toEqual([true, false]);
    expect(
        getActionButtons().map((button) => button.classList.contains('newTab'))
    ).toEqual([false, true]);
});

// `limel-tooltip` reads `--tooltip-z-index` from its host and sets it as the
// z-index of its portal container, which is outside the panel.
test('limel-side-panel: shows the toolbar tooltips above the panel', async () => {
    await renderPanel({
        style: { '--side-panel-z-index': '20' },
        actions: [{ type: 'expand', label: 'Expand' }],
    });
    const tooltips = getPage().root!.shadowRoot!.querySelectorAll(
        '.toolbar limel-tooltip'
    );

    expect(tooltips).toHaveLength(2);
    for (const tooltip of tooltips) {
        expect(zIndexOfPortalFor(tooltip)).toBe('21');
    }
});

test('limel-side-panel: shows the header-actions slot in the header', async () => {
    await renderPanel({ stack: [{ heading: 'Sales pipe' }] });

    expect(getHeader().contains(getGivenHeaderAction().assignedSlot)).toBe(
        true
    );
});

test('limel-side-panel: tells the header actions to use white text on a painted header', async () => {
    await renderPanel({
        style: { '--color-white': '255, 255, 255' },
        stack: [{ heading: 'Sales pipe', color: 'rgb(0, 128, 128)' }],
    });
    const probe = document.createElement('span');
    probe.style.color = 'var(--side-panel-header-text-color)';
    getGivenHeaderAction().append(probe);

    expect(getComputedStyle(probe).color).toBe('rgb(255, 255, 255)');
});

test('limel-side-panel: places the header actions at the right end of the header, centered vertically', async () => {
    const header = await renderPanelWithHeaderActions({
        heading: 'Sales pipe',
    });
    const headerBox = header.getBoundingClientRect();
    const actionsBox = getGivenHeaderAction().getBoundingClientRect();

    expect(headerBox.right - actionsBox.right).toBeCloseTo(12, 0);
    expect(centerOf(actionsBox)).toBeCloseTo(centerOf(headerBox), 0);
});

test('limel-side-panel: truncates a long heading before the header actions', async () => {
    const header = await renderPanelWithHeaderActions({
        heading: LONG_HEADING,
    });
    const heading = header.querySelector('.heading')!;

    expect(heading.scrollWidth).toBeGreaterThan(heading.clientWidth);
    expect(heading.getBoundingClientRect().right).toBeLessThanOrEqual(
        getGivenHeaderAction().getBoundingClientRect().left
    );
});

test('limel-side-panel: keeps space for the headings when the header actions are wide', async () => {
    const header = await renderPanelWithHeaderActions(
        { heading: LONG_HEADING },
        { width: 2000, height: 24 }
    );
    const headerWidth = header.getBoundingClientRect().width;

    expect(
        header.querySelector('.headings')!.getBoundingClientRect().width
    ).toBeGreaterThan(headerWidth * 0.4);
    expect(header.scrollWidth).toBe(header.clientWidth);
});

test('limel-side-panel: does not make the header taller when the header actions are tall', async () => {
    const entry = { heading: 'Sales pipe', subheading: 'Start page widget' };
    // `offsetHeight`, because the opening animation scales the panel.
    const normalHeader = await renderPanelWithHeaderActions(entry);
    const normalHeight = normalHeader.offsetHeight;

    const header = await renderPanelWithHeaderActions(entry, {
        width: 80,
        height: 300,
    });

    expect(header.offsetHeight).toBe(normalHeight);
});

test('limel-side-panel: does not make the header taller when the header actions are tall and there is no subheading', async () => {
    const entry = { heading: 'Sales pipe' };
    const withTinyAction = await renderPanelWithHeaderActions(entry, {
        width: 1,
        height: 1,
    });
    const normalHeight = withTinyAction.offsetHeight;

    const header = await renderPanelWithHeaderActions(entry, {
        width: 80,
        height: 300,
    });

    expect(header.offsetHeight).toBe(normalHeight);
});

test('limel-side-panel: does not show the header actions when the stack is empty', async () => {
    await renderPanel();

    expect(getGivenHeaderAction().assignedSlot).toBeNull();
    expect(getGivenHeaderAction().getClientRects()).toHaveLength(0);
});

test('limel-side-panel: shows tooltips in the header actions above the panel', async () => {
    await renderPanel({
        style: { '--side-panel-z-index': '20' },
        stack: [{ heading: 'Sales pipe' }],
    });
    const tooltip = document.createElement('limel-tooltip');
    getGivenHeaderAction().append(tooltip);

    expect(zIndexOfPortalFor(tooltip)).toBe('21');
});

const LONG_HEADING = 'A heading that is far too long '.repeat(5);

const PORTAL_Z_INDEXES = [
    '--dropdown-z-index',
    '--popover-z-index',
    '--tooltip-z-index',
];

test('limel-side-panel: shows dropdowns, popovers and tooltips in the content above the panel', async () => {
    await renderPanel({ style: { '--side-panel-z-index': '20' } });

    expect(
        PORTAL_Z_INDEXES.map((property) =>
            zIndexOfPortalFor(getGivenContent(), property)
        )
    ).toEqual(['21', '21', '21']);
});

test('limel-side-panel: uses the z-indexes of dropdowns, popovers and tooltips that the consumer sets', async () => {
    const panel = await renderPanel({
        style: { '--side-panel-z-index': '20' },
    });
    panel.parentElement!.style.setProperty('--dropdown-z-index', '100');
    panel.parentElement!.style.setProperty('--popover-z-index', '101');
    panel.style.setProperty('--tooltip-z-index', '102');

    expect(
        PORTAL_Z_INDEXES.map((property) =>
            zIndexOfPortalFor(getGivenContent(), property)
        )
    ).toEqual(['100', '101', '102']);
});

test('limel-side-panel: shows the subheading smaller than the heading, without margins', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', subheading: 'Start page widget' }],
    });
    const heading = getComputedStyle(getHeader().querySelector('.heading')!);
    const subheading = getComputedStyle(
        getHeader().querySelector('.subheading')!
    );

    expect(subheading.fontSize).toBe('12px');
    expect(heading.fontSize).toBe('16px');
    for (const style of [heading, subheading]) {
        expect([style.marginTop, style.marginBottom]).toEqual(['0px', '0px']);
    }
});

test('limel-side-panel: emits close when Escape is pressed', async () => {
    await renderPanel();
    const closed = listenFor('close');

    await pressEscape();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: does not emit close when the content prevents the Escape event', async () => {
    await renderPanel();
    const closed = listenFor('close');
    useEscapeOn(getGivenContent());

    await pressEscape();

    expect(closed).toEqual([]);
});

// `limel-popover` adds its listener on `document` when it opens, which is after
// the panel was connected.
test('limel-side-panel: does not emit close when a later document listener prevents the Escape event', async () => {
    await renderPanel();
    const closed = listenFor('close');
    useEscapeOn(document);

    await pressEscape();

    expect(closed).toEqual([]);
});

test('limel-side-panel: prevents the Escape event when it emits close', async () => {
    await renderPanel();
    const escape = escapeKeyDown();

    getGivenContent().dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(true);
});

test('limel-side-panel: removes the Escape listener when disconnected', async () => {
    await renderPanel();
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    getPage().root!.remove();

    expect(removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
    );
    removeEventListener.mockRestore();
});

test('limel-side-panel: is not wider than a positioned ancestor that is narrower than the minimum width', async () => {
    const page = await render(
        <div style={{ position: 'relative', width: '300px', height: '400px' }}>
            <limel-side-panel />
        </div>
    );
    pages.push(page);
    const panel = page.root!.querySelector('limel-side-panel')!;

    const width = panel
        .shadowRoot!.querySelector('aside')!
        .getBoundingClientRect().width;

    expect(width).toBeLessThanOrEqual(300);
});

test('limel-side-panel: emits close only from the last opened panel when Escape is pressed', async () => {
    const [first, second] = await renderTwoPanels();
    const closed = listenForCloseOn([first, second]);

    document.body.dispatchEvent(escapeKeyDown());

    expect(closed).toEqual([second]);
});

test('limel-side-panel: emits close from the earlier panel when the last opened panel is removed', async () => {
    const [first, second] = await renderTwoPanels();
    const closed = listenForCloseOn([first, second]);
    second.remove();

    document.body.dispatchEvent(escapeKeyDown());

    expect(closed).toEqual([first]);
});

test('limel-side-panel: uses the width that the edge is dragged to', async () => {
    const panel = await renderSizedPanel();
    const edge = getHandle().getBoundingClientRect().left;

    await dragHandleTo(edge, edge - 60);

    expect(widthOf(panel)).toBe(460);
});

test('limel-side-panel: uses the width that the arrow keys resize it to', async () => {
    const panel = await renderSizedPanel();

    getHandle().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    await getPage().waitForChanges();

    expect(widthOf(panel)).toBe(416);
});

test('limel-side-panel: starts with the width from --side-panel-width', async () => {
    const panel = await renderSizedPanel();

    expect(widthOf(panel)).toBe(400);
});

test('limel-side-panel: uses and emits the clamped width when dragged past the maximum width', async () => {
    const panel = await renderSizedPanel();
    const widths: number[] = [];
    panel.addEventListener('changeWidth', (event: CustomEvent<number>) => {
        widths.push(event.detail);
    });
    const edge = getHandle().getBoundingClientRect().left;

    await dragHandleTo(edge, edge - 500);

    expect(widthOf(panel)).toBe(600);
    expect(widths).toEqual([600]);
});

test('limel-side-panel: emits changeWidth when the edge is dragged', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 940 });

    expect(widths).toEqual([460]);
    expect(getPage().root!.style.getPropertyValue('--side-panel-width')).toBe(
        ''
    );
});

test('limel-side-panel: clamps changeWidth to the maximum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 800 }, { widest: 500 });

    expect(widths).toEqual([500]);
});

test('limel-side-panel: clamps changeWidth to the minimum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 1100 }, { narrowest: 320 });

    expect(widths).toEqual([320]);
});

// The drag asks for 600px. The panel measures that width, and must then keep
// the clamped width, not the one it measured.
test('limel-side-panel: keeps the clamped width after measuring', async () => {
    await renderPanel();

    await dragEdge({ from: 1000, to: 800 }, { widest: 500 });

    expect(getPanel().style.width).toBe('500px');
});

test('limel-side-panel: resets body styles when disconnected during a drag', async () => {
    await renderPanel();
    await dragEdge({ from: 1000, to: 940 });

    getPage().root!.remove();

    expect(document.body.style.cursor).toBe('');
});

test('limel-side-panel: can be resized after it is moved in the DOM', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');
    const panel = getPage().root!;
    const parent = panel.parentElement!;

    panel.remove();
    parent.append(panel);
    await dragEdge({ from: 1000, to: 940 });

    expect(widths).toEqual([460]);
});

// A consumer that stores the width usually renders again, often with new
// arrays for `stack` and `actions`, so the panel renders on each move.
test('limel-side-panel: keeps resizing when the consumer renders again on each changeWidth', async () => {
    const panel = await renderPanel({ stack: [{ heading: 'Sales pipe' }] });
    const widths: number[] = [];
    panel.addEventListener('changeWidth', (event: CustomEvent<number>) => {
        widths.push(event.detail);
        panel.style.setProperty('--side-panel-width', `${event.detail}px`);
        (panel as HTMLLimelSidePanelElement).stack = [
            { heading: `Sales pipe ${event.detail}` },
        ];
    });
    layOutThePanel({});
    const handle = getHandle();
    handle.setPointerCapture = vi.fn();

    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );
    for (const clientX of [990, 980, 970]) {
        await getPage().waitForChanges();
        getHandle().dispatchEvent(
            new PointerEvent('pointermove', { clientX: clientX, pointerId: 1 })
        );
    }

    await getPage().waitForChanges();

    expect(widths).toEqual([410, 420, 430]);
    expect(getHeader().querySelector('.heading')!.textContent).toBe(
        'Sales pipe 430'
    );
});

test('limel-side-panel: emits a wider changeWidth when ArrowLeft is pressed on the resize handle', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft');

    expect(widths).toEqual([416]);
});

test('limel-side-panel: emits a narrower changeWidth when ArrowRight is pressed on the resize handle', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowRight');

    expect(widths).toEqual([384]);
});

test('limel-side-panel: clamps changeWidth from the keyboard to the maximum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft', { widest: 400 });

    expect(widths).toEqual([400]);
});

test('limel-side-panel: prevents the default action of the arrow keys on the resize handle', async () => {
    await renderPanel();

    const event = await pressKeyOnHandle('ArrowLeft');

    expect(event.defaultPrevented).toBe(true);
});

test('limel-side-panel: makes the resize handle focusable with resizeLabel as its name', async () => {
    await renderPanel({ resizeLabel: 'Ändra bredd' });

    expect(getHandle().tabIndex).toBe(0);
    expect(getHandle().getAttribute('aria-label')).toBe('Ändra bredd');
});

test('limel-side-panel: sets the current, minimum and maximum width on the resize handle', async () => {
    const page = await render(
        <div style={{ position: 'relative', width: '1000px', height: '400px' }}>
            <limel-side-panel
                style={{
                    '--side-panel-width': '400px',
                    '--side-panel-min-width': '300px',
                }}
            />
        </div>
    );
    pages.push(page);
    const handle = page
        .root!.querySelector('limel-side-panel')!
        .shadowRoot!.querySelector('.handle')!;

    await waitForLayout();

    expect(handle.getAttribute('aria-valuenow')).toBe('400');
    expect(handle.getAttribute('aria-valuemin')).toBe('300');
    expect(handle.getAttribute('aria-valuemax')).toBe('600');
});

test('limel-side-panel: does not propagate close or changeWidth from the content', async () => {
    await renderPanel();
    const heard = listenOutsideFor(OWN_EVENTS);

    for (const event of OWN_EVENTS) {
        await emitFromContent(event);
    }

    expect(heard).toEqual([]);
});

// Tests the listeners inside the panel without the fallback listener on the host.
test('limel-side-panel: stops close and changeWidth inside the panel', async () => {
    await renderPanel();
    const heard = listenInsideForOwnEvents();

    for (const event of OWN_EVENTS) {
        await emitFromContentSlot(event);
    }

    expect(heard).toEqual([]);
});

// Tests the listeners inside the panel without the fallback listener on the host.
test('limel-side-panel: stops close and changeWidth from the header actions inside the panel', async () => {
    await renderPanel({ stack: [{ heading: 'Sales pipe' }] });
    const heard = listenInsideForOwnEvents();

    for (const event of OWN_EVENTS) {
        getGivenHeaderAction().assignedSlot!.dispatchEvent(
            new CustomEvent(event, { bubbles: true, composed: true })
        );
    }

    expect(heard).toEqual([]);
});

test('limel-side-panel: propagates its own close event', async () => {
    await renderPanel();
    const heard = listenOutsideFor(['close']);

    await pressCloseButton();

    expect(heard).toEqual(['close']);
});

test('limel-side-panel: propagates its own changeWidth event', async () => {
    await renderPanel();
    const heard = listenOutsideFor(['changeWidth']);

    await dragEdge({ from: 1000, to: 940 });

    expect(heard).toEqual(['changeWidth']);
});

interface Drag {
    /**
     * `clientX` of `pointerdown`
     */
    from: number;

    /**
     * `clientX` of `pointermove`
     */
    to: number;
}

interface Limits {
    /**
     * Minimum width in pixels. No minimum if not set.
     */
    narrowest?: number;

    /**
     * Maximum width in pixels. No maximum if not set.
     */
    widest?: number;
}

/**
 * Mocks `offsetWidth` on the panel. The width is 400px when no inline
 * width is set. Otherwise it is the inline width, clamped to the limits.
 *
 * @param limits - the width limits
 * @param limits.narrowest
 * @param limits.widest
 */
function layOutThePanel({ narrowest = 0, widest = Infinity }: Limits) {
    const panel = getPanel();

    Object.defineProperty(panel, 'offsetWidth', {
        configurable: true,
        get: () => {
            const set = Number.parseFloat(panel.style.width);
            const width = Number.isNaN(set) ? 400 : set;

            return Math.min(Math.max(width, narrowest), widest);
        },
    });
}

async function renderPanel(
    props: Record<string, unknown> = {}
): Promise<HTMLElement> {
    const page = await render(
        <limel-side-panel {...props}>
            <div class="given-content" />
            <button class="given-header-action" slot="header-actions" />
        </limel-side-panel>
    );
    pages.push(page);

    return page.root!;
}

interface Size {
    width: number;
    height: number;
}

const SMALL_HEADER_ACTION: Size = { width: 80, height: 24 };

/**
 * Renders a 400px wide panel with an element in the `header-actions` slot.
 *
 * @param entry - the only entry in the stack
 * @param size - the size of the element in the slot, in pixels
 * @returns the header
 */
async function renderPanelWithHeaderActions(
    entry: SidePanelEntry,
    size: Size = SMALL_HEADER_ACTION
): Promise<HTMLElement> {
    const page = await render(
        <div style={{ position: 'relative', width: '1000px', height: '400px' }}>
            <limel-side-panel
                style={{ '--side-panel-width': '400px' }}
                stack={[entry]}
            >
                <div
                    class="given-header-action"
                    slot="header-actions"
                    style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                    }}
                />
            </limel-side-panel>
        </div>
    );
    pages.push(page);

    return page
        .root!.querySelector('limel-side-panel')!
        .shadowRoot!.querySelector<HTMLElement>('.header')!;
}

/**
 * Renders a panel that starts 400px wide, in a 1000px wide positioned
 * ancestor. The panel can be between 300px and 600px wide.
 *
 * @returns the host
 */
async function renderSizedPanel(): Promise<HTMLElement> {
    const page = await render(
        <div style={{ position: 'relative', width: '1000px', height: '400px' }}>
            <limel-side-panel
                style={{
                    '--side-panel-width': '400px',
                    '--side-panel-min-width': '300px',
                }}
            />
        </div>
    );
    pages.push(page);

    return page.root!.querySelector('limel-side-panel')!;
}

/**
 * Drags the resize handle with real layout. `setPointerCapture` is mocked,
 * because synthetic events have no active pointer.
 *
 * @param from - `clientX` of `pointerdown`
 * @param to - `clientX` of `pointermove`
 */
async function dragHandleTo(from: number, to: number) {
    const handle = getHandle();
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: from, pointerId: 1 })
    );
    handle.dispatchEvent(
        new PointerEvent('pointermove', { clientX: to, pointerId: 1 })
    );
    handle.dispatchEvent(
        new PointerEvent('pointerup', { clientX: to, pointerId: 1 })
    );

    await getPage().waitForChanges();
}

// `offsetWidth`, because the opening animation scales the panel.
function widthOf(panel: HTMLElement): number {
    return panel.shadowRoot!.querySelector<HTMLElement>('aside')!.offsetWidth;
}

/**
 * Renders a panel, then adds a second panel after the first is ready. A second
 * call to `render` would remove the first panel.
 *
 * @returns the two hosts, in the order they were opened
 */
async function renderTwoPanels(): Promise<HTMLElement[]> {
    const first = await renderPanel();
    const second = document.createElement('limel-side-panel');
    first.after(second);
    await second.componentOnReady();

    return [first, second];
}

function getContentSlot(): HTMLSlotElement {
    return getPage().root!.shadowRoot!.querySelector('slot:not([name])')!;
}

async function pressCloseButton() {
    getCloseButton().dispatchEvent(new CustomEvent('click'));

    await getPage().waitForChanges();
}

/**
 * Dispatches a keydown event on the resize handle. The panel starts at 400px.
 *
 * @param key - the key
 * @param limits - the width limits
 * @returns the dispatched event
 */
async function pressKeyOnHandle(
    key: string,
    limits: Limits = {}
): Promise<KeyboardEvent> {
    layOutThePanel(limits);

    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        composed: true,
        cancelable: true,
    });
    getHandle().dispatchEvent(event);
    await getPage().waitForChanges();

    return event;
}

/**
 * Drags the resize handle. The panel starts at 400px. `setPointerCapture` is
 * mocked, because synthetic events have no active pointer.
 *
 * @param movement - the start and end positions of the pointer
 * @param limits - the width limits
 */
async function dragEdge(movement: Drag, limits: Limits = {}) {
    layOutThePanel(limits);

    const handle = getHandle();
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', {
            clientX: movement.from,
            pointerId: 1,
        })
    );
    handle.dispatchEvent(
        new PointerEvent('pointermove', { clientX: movement.to, pointerId: 1 })
    );

    await getPage().waitForChanges();
}

/**
 * Dispatches a bubbling, composed event from the slotted content.
 *
 * @param event - the event name
 */
async function emitFromContent(event: string) {
    getGivenContent().dispatchEvent(
        new CustomEvent(event, { bubbles: true, composed: true })
    );

    await getPage().waitForChanges();
}

/**
 * Dispatches a bubbling, composed event from the default slot.
 *
 * @param event - the event name
 */
async function emitFromContentSlot(event: string) {
    getContentSlot().dispatchEvent(
        new CustomEvent(event, { bubbles: true, composed: true })
    );

    await getPage().waitForChanges();
}

/**
 * Dispatches an Escape keydown event from the slotted content. The event bubbles
 * to `window` and is not prevented.
 */
async function pressEscape() {
    getGivenContent().dispatchEvent(escapeKeyDown());

    await getPage().waitForChanges();
}

function escapeKeyDown(): KeyboardEvent {
    return new KeyboardEvent('keydown', {
        key: ESCAPE,
        bubbles: true,
        composed: true,
        cancelable: true,
    });
}

/**
 * Calls `preventDefault` on Escape keydown events on the target, like an open
 * dialog or dropdown does.
 *
 * @param target - the event target
 */
function useEscapeOn(target: EventTarget) {
    target.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
            if (event.key === ESCAPE) {
                event.preventDefault();
            }
        },
        { signal: listenUntilTheTestEnds() }
    );
}

/**
 * Adds a listener on the host.
 *
 * @param event - the event name
 * @returns the event details, in the order they were received
 */
function listenFor<T = unknown>(event: string): T[] {
    const details: T[] = [];
    getPage().root!.addEventListener(event, (received: CustomEvent<T>) => {
        details.push(received.detail);
    });

    return details;
}

/**
 * Adds a `close` listener on each panel.
 *
 * @param panels - the hosts to listen on
 * @returns the hosts that emitted `close`, in order
 */
function listenForCloseOn(panels: HTMLElement[]): HTMLElement[] {
    const closed: HTMLElement[] = [];

    for (const panel of panels) {
        panel.addEventListener('close', () => {
            closed.push(panel);
        });
    }

    return closed;
}

/**
 * Adds listeners on the parent of the host. A listener on the host itself would
 * also receive events that are stopped there.
 *
 * @param events - the event names
 * @returns the names of the received events, in order
 */
function listenOutsideFor(events: string[]): string[] {
    const heard: string[] = [];

    for (const event of events) {
        getPage().root!.parentElement!.addEventListener(event, () => {
            heard.push(event);
        });
    }

    return heard;
}

/**
 * Adds listeners for the panel's own event names on the `aside` element in the
 * shadow root, which is an ancestor of the slots.
 *
 * @returns the names of the received events, in order
 */
function listenInsideForOwnEvents(): string[] {
    const heard: string[] = [];
    const panel = getPanel();

    for (const event of OWN_EVENTS) {
        panel.addEventListener(event, () => {
            heard.push(event);
        });
    }

    return heard;
}

function getPage(): Page {
    return pages.at(-1)!;
}

function listenUntilTheTestEnds(): AbortSignal {
    const listener = new AbortController();
    listeners.push(listener);

    return listener.signal;
}

function getCloseButton(): HTMLButtonElement {
    return getPage().root!.shadowRoot!.querySelector('button.close')!;
}

/**
 * Sets a z-index property of an element as the z-index of an element outside
 * the panel, like `limel-tooltip`, `limel-menu` and `limel-popover` do with
 * their portal containers.
 *
 * @param element - the element that reads the property
 * @param property - the custom property
 * @returns the computed z-index of the element outside the panel
 */
function zIndexOfPortalFor(
    element: Element,
    property = '--tooltip-z-index'
): string {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex =
        getComputedStyle(element).getPropertyValue(property);
    document.body.append(container);
    const zIndex = getComputedStyle(container).zIndex;
    container.remove();

    return zIndex;
}

function centerOf(box: DOMRect): number {
    return box.top + box.height / 2;
}

function getActionButtons(): HTMLElement[] {
    return [
        ...getPage().root!.shadowRoot!.querySelectorAll<HTMLElement>(
            '.actions > *'
        ),
    ];
}

function getHeader(): HTMLElement {
    return getPage().root!.shadowRoot!.querySelector<HTMLElement>('.header')!;
}

function getGivenHeaderAction(): HTMLElement {
    return getPage().root!.querySelector<HTMLElement>('.given-header-action')!;
}

function getGivenContent(): HTMLElement {
    return getPage().root!.querySelector<HTMLElement>('.given-content')!;
}

/**
 * Waits until resize observers have run and the panel has rendered again.
 */
async function waitForLayout() {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await getPage().waitForChanges();
}

/**
 * The panel, also when it was rendered inside another element.
 *
 * @returns the host
 */
function getHost(): HTMLElement {
    const root = getPage().root!;
    if (root.matches('limel-side-panel')) {
        return root;
    }

    return root.querySelector('limel-side-panel')!;
}

function getHandle(): HTMLElement {
    return getHost().shadowRoot!.querySelector<HTMLElement>('.handle')!;
}

function getPanel(): HTMLElement {
    return getHost().shadowRoot!.querySelector('aside')!;
}
