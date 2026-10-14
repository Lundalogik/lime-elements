import { render, h } from '@stencil/vitest';
import { afterEach, expect, test, vi } from 'vitest';
import { ESCAPE } from '../../util/keycodes';

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

test('limel-side-panel: does not emit close when Escape is pressed and closeOnEscape is false', async () => {
    await renderPanel({ closeOnEscape: false });
    const closed = listenFor('close');

    await pressEscape();

    expect(closed).toEqual([]);
});

test('limel-side-panel: does not prevent the Escape event when closeOnEscape is false', async () => {
    await renderPanel({ closeOnEscape: false });
    const escape = escapeKeyDown();

    getGivenContent().dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(false);
});

test('limel-side-panel: emits close when the close button is clicked and closeOnEscape is false', async () => {
    await renderPanel({ closeOnEscape: false });
    const closed = listenFor('close');

    await pressCloseButton();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: emits close for Escape again when closeOnEscape is set back to true', async () => {
    const panel = await renderPanel({ closeOnEscape: false });
    const closed = listenFor('close');

    (panel as HTMLLimelSidePanelElement).closeOnEscape = true;
    await pressEscape();

    expect(closed).toHaveLength(1);
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

test('limel-side-panel: emits close from no panel when the last opened panel has closeOnEscape set to false', async () => {
    const [first, second] = await renderTwoPanels();
    (second as HTMLLimelSidePanelElement).closeOnEscape = false;
    const closed = listenForCloseOn([first, second]);

    document.body.dispatchEvent(escapeKeyDown());

    expect(closed).toEqual([]);
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

    expect(widthOf(panel)).toBe(408);
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

test('limel-side-panel: does not emit changeWidth before the drag ends', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await startDragging({ from: 1000, to: 940 });

    expect(widths).toEqual([]);
});

test('limel-side-panel: emits changeWidth once for a drag with many moves', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');
    await startDragging({ from: 1000, to: 940 });

    moveAndRelease([900, 950]);
    await getPage().waitForChanges();

    expect(widths).toEqual([450]);
});

test('limel-side-panel: does not emit changeWidth or set a width when the edge is pressed and released without moving', async () => {
    const panel = await renderSizedPanel();
    const widths = listenFor('changeWidth');

    await pressAndReleaseHandle();

    expect(widths).toEqual([]);
    expect(panel.shadowRoot!.querySelector('aside')!.style.width).toBe('');
});

test('limel-side-panel: does not emit changeWidth when a drag ends at the same width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 1100 }, { narrowest: 400 });

    expect(widths).toEqual([]);
});

// A forced layout of large content makes each pointer move slow. The width at
// the start of the drag is read once, at the first move.
test('limel-side-panel: does not measure the panel while the edge is dragged', async () => {
    await renderPanel();
    await startDragging({ from: 1000, to: 940 });
    const reads = vi.spyOn(getPanel(), 'offsetWidth', 'get');

    getHandle().dispatchEvent(
        new PointerEvent('pointermove', { clientX: 900, pointerId: 1 })
    );
    await waitForLayout();

    expect(reads).not.toHaveBeenCalled();
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
    await startDragging({ from: 1000, to: 940 });

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

test('limel-side-panel: emits a wider changeWidth when ArrowLeft is pressed on the resize handle', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft');

    expect(widths).toEqual([408]);
});

test('limel-side-panel: emits a narrower changeWidth when ArrowRight is pressed on the resize handle', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowRight');

    expect(widths).toEqual([392]);
});

test('limel-side-panel: clamps changeWidth from the keyboard to the maximum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft', { widest: 404 });

    expect(widths).toEqual([404]);
});

test('limel-side-panel: does not emit changeWidth when an arrow key does not change the width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft', { widest: 400 });

    expect(widths).toEqual([]);
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

test('limel-side-panel: updates the maximum width when the positioned ancestor gets wider', async () => {
    const host = await renderSizedPanel();
    await waitForLayout();

    host.parentElement!.style.width = '1400px';
    await waitForLayout();

    expect(getHandle().getAttribute('aria-valuemax')).toBe('840');
});

test('limel-side-panel: does not change the style of the panel to measure the width limits', async () => {
    const host = await renderSizedPanel();
    await waitForLayout();
    const styleChanges: MutationRecord[] = [];
    const observer = new MutationObserver((records) => {
        styleChanges.push(...records);
    });
    observer.observe(getPanel(), {
        attributes: true,
        attributeFilter: ['style'],
    });

    host.style.setProperty('--side-panel-width', '500px');
    await waitForLayout();
    observer.disconnect();

    expect(getHandle().getAttribute('aria-valuenow')).toBe('500');
    expect(styleChanges).toEqual([]);
});

test('limel-side-panel: does not measure the width limits when only the height of the panel changes', async () => {
    const host = await renderSizedPanel();
    await waitForLayout();
    const reads = spyOnLimitReads();

    host.parentElement!.style.height = '500px';
    await waitForLayout();

    expect(reads()).toBe(0);
});

test('limel-side-panel: measures the width limits once for an arrow key press', async () => {
    await renderSizedPanel();
    await waitForLayout();
    const reads = spyOnLimitReads();

    getHandle().dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            bubbles: true,
            cancelable: true,
        })
    );
    await waitForLayout();

    expect(reads()).toBe(2);
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
    const heard = listenInsideFor(OWN_EVENTS);

    for (const event of OWN_EVENTS) {
        await emitFromContentSlot(event);
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
        </limel-side-panel>
    );
    pages.push(page);

    return page.root!;
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
 * Drags the resize handle, then releases the pointer. The panel starts at
 * 400px.
 *
 * @param movement - the start and end positions of the pointer
 * @param limits - the width limits
 */
async function dragEdge(movement: Drag, limits: Limits = {}) {
    await startDragging(movement, limits);
    moveAndRelease([]);

    await getPage().waitForChanges();
}

/**
 * Presses the resize handle and releases the pointer without moving it.
 * `setPointerCapture` is mocked, because synthetic events have no active
 * pointer.
 */
async function pressAndReleaseHandle() {
    const handle = getHandle();
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );
    handle.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    await getPage().waitForChanges();
}

/**
 * Moves the pointer that drags the resize handle, then releases it.
 *
 * @param positions - `clientX` of each `pointermove`
 */
function moveAndRelease(positions: number[]) {
    const handle = getHandle();
    for (const clientX of positions) {
        handle.dispatchEvent(
            new PointerEvent('pointermove', { clientX: clientX, pointerId: 1 })
        );
    }

    handle.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
}

/**
 * Drags the resize handle, and does not release the pointer. The panel starts
 * at 400px. `setPointerCapture` is mocked, because synthetic events have no
 * active pointer.
 *
 * @param movement - the start and end positions of the pointer
 * @param limits - the width limits
 */
async function startDragging(movement: Drag, limits: Limits = {}) {
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
function listenFor(event: string): unknown[] {
    const details: unknown[] = [];
    getPage().root!.addEventListener(event, (received: CustomEvent) => {
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
 * Adds listeners on the `aside` element in the shadow root, which is an
 * ancestor of the slot.
 *
 * @param events - the event names
 * @returns the names of the received events, in order
 */
function listenInsideFor(events: string[]): string[] {
    const heard: string[] = [];
    const panel = getPanel();

    for (const event of events) {
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

function getGivenContent(): HTMLElement {
    return getPage().root!.querySelector<HTMLElement>('.given-content')!;
}

/**
 * Counts the reads of the elements that the panel measures its width limits
 * with: one for the narrowest width, one for the widest.
 *
 * @returns a function that returns the number of reads so far
 */
function spyOnLimitReads(): () => number {
    const limits =
        getHost().shadowRoot!.querySelectorAll<HTMLElement>('[data-limit]');
    expect(limits).toHaveLength(2);
    const reads = [...limits].map((limit) =>
        vi.spyOn(limit, 'offsetWidth', 'get')
    );

    return () => {
        return reads.reduce((total, read) => total + read.mock.calls.length, 0);
    };
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
