import { render, h } from '@stencil/vitest';
import { afterEach, expect, test, vi } from 'vitest';

type Page = Awaited<ReturnType<typeof render>>;

// A list instead of a `let`, because the lint rules do not allow reassignment of
// top-level variables in functions.
const pages: Page[] = [];

afterEach(() => {
    for (const page of pages.splice(0)) {
        page.unmount();
    }
});

test('limel-resize-handle: is a focusable vertical separator with the given label and values', async () => {
    const handle = await renderHandle({
        label: 'Resize',
        value: 400,
        min: 300,
        max: 600,
    });

    expect(handle.getAttribute('role')).toBe('separator');
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.tabIndex).toBe(0);
    expect(handle.getAttribute('aria-label')).toBe('Resize');
    expect(
        ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'].map((name) =>
            handle.getAttribute(name)
        )
    ).toEqual(['400', '300', '600']);
});

test('limel-resize-handle: emits changeSize with the width of its element plus the distance it is dragged to the left', async () => {
    const handle = await renderHandle();
    const sizes = listenForSizes(handle);

    drag(handle, [1000, 940, 1030]);

    expect(sizes).toEqual([460, 370]);
});

test('limel-resize-handle: emits changeSize 16px wider for ArrowLeft and 16px narrower for ArrowRight', async () => {
    const handle = await renderHandle();
    const sizes = listenForSizes(handle);

    const events = ['ArrowLeft', 'ArrowRight', 'Enter'].map((key) =>
        pressKey(handle, key)
    );

    expect(sizes).toEqual([416, 384]);
    expect(events.map((event) => event.defaultPrevented)).toEqual([
        true,
        true,
        false,
    ]);
});

test('limel-resize-handle: does not let changeSize bubble', async () => {
    const handle = await renderHandle();
    const heard: Event[] = [];
    handle.parentElement!.addEventListener('changeSize', (event) => {
        heard.push(event);
    });

    pressKey(handle, 'ArrowLeft');

    expect(heard).toEqual([]);
});

/**
 * Renders a handle in a 400px wide element, which is the element it resizes.
 *
 * @param props - the props of the handle
 * @returns the handle
 */
async function renderHandle(
    props: Record<string, unknown> = {}
): Promise<HTMLElement> {
    const page = await render(
        <div style={{ position: 'relative', width: '400px', height: '200px' }}>
            <limel-resize-handle {...props} />
        </div>
    );
    pages.push(page);

    return page.root!.querySelector('limel-resize-handle')!;
}

/**
 * Drags the handle. `setPointerCapture` is mocked, because synthetic events
 * have no active pointer.
 *
 * @param handle - the handle
 * @param positions - `clientX` of `pointerdown`, then of each `pointermove`
 */
function drag(handle: HTMLElement, positions: number[]) {
    const [start, ...moves] = positions;
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: start, pointerId: 1 })
    );
    for (const clientX of moves) {
        handle.dispatchEvent(
            new PointerEvent('pointermove', { clientX: clientX, pointerId: 1 })
        );
    }
}

function pressKey(handle: HTMLElement, key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true,
    });
    handle.dispatchEvent(event);

    return event;
}

function listenForSizes(handle: HTMLElement): number[] {
    const sizes: number[] = [];
    handle.addEventListener('changeSize', (event: CustomEvent<number>) => {
        sizes.push(event.detail);
    });

    return sizes;
}
