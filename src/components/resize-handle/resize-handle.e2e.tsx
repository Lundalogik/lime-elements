import { render, h } from '@stencil/vitest';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
    getAccessibleNames,
    getAccessibleNodes,
} from '../../util/test/accessibility-tree';

type Page = Awaited<ReturnType<typeof render>>;

// A list instead of a `let`, because the lint rules do not allow reassignment of
// top-level variables in functions.
const pages: Page[] = [];
const shadowHosts: HTMLElement[] = [];

afterEach(() => {
    for (const page of pages.splice(0)) {
        page.unmount();
    }

    for (const shadowHost of shadowHosts.splice(0)) {
        shadowHost.remove();
    }
});

test('limel-resize-handle: is a focusable vertical separator with the given values', async () => {
    const handle = await renderHandle({
        value: 400,
        min: 300,
        max: 600,
    });

    const separator = getSeparator(handle);

    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator.tabIndex).toBe(0);
    expect(
        ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'].map((name) =>
            separator.getAttribute(name)
        )
    ).toEqual(['400', '300', '600']);
});

test('limel-resize-handle: is named after the region that it resizes', async () => {
    await renderHandle({ resizableRegionLabel: 'sheet' });

    expect(await getAccessibleNames('separator')).toEqual(['Resize sheet']);
});

test('limel-resize-handle: is named "Resize this region" when it is not told what it resizes', async () => {
    await renderHandle();

    expect(await getAccessibleNames('separator')).toEqual([
        'Resize this region',
    ]);
});

test.each([
    ['sheet', 'Ändra storlek på sheet'],
    [undefined, 'Ändra storlek på den här regionen'],
])(
    'limel-resize-handle: is named in the language that is set, with the region %s',
    async (resizableRegionLabel, name) => {
        await renderHandle({ resizableRegionLabel, language: 'sv' });

        expect(await getAccessibleNames('separator')).toEqual([name]);
    }
);

test('limel-resize-handle: follows a change of the region and the language', async () => {
    const handle = await renderHandle({ resizableRegionLabel: 'sheet' });

    handle.setAttribute('resizable-region-label', 'panel');
    handle.setAttribute('language', 'sv');
    await pages.at(-1)!.waitForChanges();

    expect(await getAccessibleNames('separator')).toEqual([
        'Ändra storlek på panel',
    ]);
});

test.each([
    ['left', 'Press the left and right arrow keys'],
    ['right', 'Press the left and right arrow keys'],
    ['top', 'Press the up and down arrow keys'],
    ['bottom', 'Press the up and down arrow keys'],
])(
    'limel-resize-handle: a handle at the %s is described as "%s"',
    async (location, description) => {
        await renderHandle({
            location: location,
            resizableRegionLabel: 'sheet',
        });

        expect(await getAccessibleNodes('separator')).toEqual([
            { name: 'Resize sheet', description: description },
        ]);
    }
);

test('limel-resize-handle: is described in the language that is set', async () => {
    await renderHandle({ language: 'sv' });

    expect(await getAccessibleNodes('separator')).toEqual([
        {
            name: 'Ändra storlek på den här regionen',
            description: 'Tryck på vänster- och högerpiltangenterna',
        },
    ]);
});

test('limel-resize-handle: follows a change of location and language in its description', async () => {
    const handle = await renderHandle();

    handle.setAttribute('location', 'top');
    handle.setAttribute('language', 'sv');
    await pages.at(-1)!.waitForChanges();

    await expect
        .poll(async () => getAccessibleNodes('separator'))
        .toEqual([
            {
                name: 'Ändra storlek på den här regionen',
                description: 'Tryck på upp- och nedpiltangenterna',
            },
        ]);
});

test('limel-resize-handle: tells to drag it while the pointer is over it', async () => {
    const handle = await renderHandle();

    await userEvent.hover(handle);

    await expect
        .poll(async () => getAccessibleNodes('separator'))
        .toEqual([
            {
                name: 'Resize this region',
                description: 'Drag to resize',
            },
        ]);
});

test('limel-resize-handle: tells which arrow keys to press again when the pointer has left it', async () => {
    const handle = await renderHandle();

    await userEvent.hover(handle);
    await userEvent.hover(handle.parentElement!);

    await expect
        .poll(async () => getAccessibleNodes('separator'))
        .toEqual([
            {
                name: 'Resize this region',
                description: 'Press the left and right arrow keys',
            },
        ]);
});

test('limel-resize-handle: tells to drag it while the pointer is over it and it has focus that does not come from the keyboard', async () => {
    await renderHandleWithFocusFromScript();

    expect(await getAccessibleNodes('separator')).toEqual([
        {
            name: 'Resize this region',
            description: 'Drag to resize',
        },
    ]);
});

test('limel-resize-handle: tells which arrow keys to press when an arrow key resizes it after focus that did not come from the keyboard', async () => {
    const handle = await renderHandleWithFocusFromScript();

    await userEvent.keyboard('{ArrowLeft}');
    await pages.at(-1)!.waitForChanges();

    expect(getSeparator(handle).matches(':focus-visible')).toBe(true);
    expect(await getAccessibleNodes('separator')).toEqual([
        {
            name: 'Resize this region',
            description: 'Press the left and right arrow keys',
        },
    ]);
});

test('limel-resize-handle: tells which arrow keys to press while it has keyboard focus, also when the pointer is over it', async () => {
    const handle = await renderHandle();

    await userEvent.tab();
    await userEvent.hover(handle);

    await expect
        .poll(async () => getAccessibleNodes('separator'))
        .toEqual([
            {
                name: 'Resize this region',
                description: 'Press the left and right arrow keys',
            },
        ]);
});

test('limel-resize-handle: shows its name and how to resize in a tooltip', async () => {
    const handle = await renderHandle({ resizableRegionLabel: 'sheet' });
    const tooltip = handle.shadowRoot!.querySelector('limel-tooltip')!;

    expect(tooltip.label).toBe('Resize sheet');
    expect(tooltip.helperLabel).toBe('Press the left and right arrow keys');
});

test('limel-resize-handle: is on the left by default', async () => {
    const handle = await renderHandle();

    expect(handle.getAttribute('location')).toBe('left');
});

test.each([
    ['left', 'vertical'],
    ['right', 'vertical'],
    ['top', 'horizontal'],
    ['bottom', 'horizontal'],
])(
    'limel-resize-handle: a handle at the %s is a %s separator',
    async (location, orientation) => {
        const handle = await renderHandle({ location: location });

        expect(getSeparator(handle).getAttribute('aria-orientation')).toBe(
            orientation
        );
    }
);

test.each([
    ['left', 'col-resize'],
    ['right', 'col-resize'],
    ['top', 'row-resize'],
    ['bottom', 'row-resize'],
])(
    'limel-resize-handle: a handle at the %s has the %s cursor',
    async (location, cursor) => {
        const handle = await renderHandle({ location: location });

        expect(getComputedStyle(handle).cursor).toBe(cursor);
    }
);

test.each([
    ['left', 460, 370],
    ['right', 340, 430],
])(
    'limel-resize-handle: a handle at the %s emits changeSize with the width of its element changed by the distance it is dragged',
    async (location, firstWidth, secondWidth) => {
        const handle = await renderHandle({ location: location });
        const sizes = listenForSizes(handle);

        drag(handle, [1000, 940, 1030]);

        expect(sizes).toEqual([firstWidth, secondWidth]);
    }
);

test.each([
    ['top', 240, 170],
    ['bottom', 160, 230],
])(
    'limel-resize-handle: a handle at the %s emits changeSize with the height of its element changed by the distance it is dragged',
    async (location, firstHeight, secondHeight) => {
        const handle = await renderHandle({ location: location });
        const sizes = listenForSizes(handle);

        drag(handle, [1000, 960, 1030], 'clientY');

        expect(sizes).toEqual([firstHeight, secondHeight]);
    }
);

test.each([
    ['left', 'ArrowLeft', 'ArrowRight', 408, 392],
    ['right', 'ArrowRight', 'ArrowLeft', 408, 392],
    ['top', 'ArrowUp', 'ArrowDown', 208, 192],
    ['bottom', 'ArrowDown', 'ArrowUp', 208, 192],
])(
    'limel-resize-handle: a handle at the %s emits changeSize 8px larger for %s and 8px smaller for %s',
    async (location, growKey, shrinkKey, grown, shrunk) => {
        const handle = await renderHandle({ location: location });
        const sizes = listenForSizes(handle);

        const events = [growKey, shrinkKey, 'Enter'].map((key) =>
            pressKey(handle, key)
        );

        expect(sizes).toEqual([grown, shrunk]);
        expect(events.map((event) => event.defaultPrevented)).toEqual([
            true,
            true,
            false,
        ]);
    }
);

test.each([
    ['left', ['ArrowUp', 'ArrowDown']],
    ['right', ['ArrowUp', 'ArrowDown']],
    ['top', ['ArrowLeft', 'ArrowRight']],
    ['bottom', ['ArrowLeft', 'ArrowRight']],
])(
    'limel-resize-handle: a handle at the %s ignores %j',
    async (location, keys) => {
        const handle = await renderHandle({ location: location });
        const sizes = listenForSizes(handle);

        const events = keys.map((key) => pressKey(handle, key));

        expect(sizes).toEqual([]);
        expect(events.map((event) => event.defaultPrevented)).toEqual([
            false,
            false,
        ]);
    }
);

test('limel-resize-handle: resizes the element that has the shadow root when it is placed directly in a shadow root', async () => {
    const handle = await renderHandleInShadowRoot();
    const sizes = listenForSizes(handle);

    pressKey(handle, 'ArrowLeft');

    expect(sizes).toEqual([408]);
});

test.each([
    ['top', { top: 0, bottom: 32 }],
    ['bottom', { top: 168, bottom: 200 }],
])(
    'limel-resize-handle: --limel-resize-handle-thickness makes the grab area of a handle at the %s larger, away from the edge',
    async (location, expected) => {
        const handle = await renderHandle({
            location: location,
            style: { '--limel-resize-handle-thickness': '2rem' },
        });
        const element = handle.parentElement!.getBoundingClientRect();
        const rect = handle.getBoundingClientRect();

        expect({
            top: rect.top - element.top,
            bottom: rect.bottom - element.top,
        }).toEqual(expected);
    }
);

test.each([
    ['top', 0, 24],
    ['bottom', 16, 24],
])(
    'limel-resize-handle: the grip of a handle at the %s stays at the edge when the grab area is larger, wherever the pointer is',
    async (location, gripTop, handleHeight) => {
        const handle = await renderHandle({
            location: location,
            style: { '--limel-resize-handle-thickness': '1.5rem' },
        });
        const grip = handle.shadowRoot!.querySelector('[role="presentation"]')!;
        await userEvent.hover(handle);
        grip.style.transition = 'none';
        grip.style.transform = 'none';

        expect(handle.getBoundingClientRect().height).toBe(handleHeight);
        expect(
            grip.getBoundingClientRect().top -
                handle.getBoundingClientRect().top
        ).toBe(gripTop);
    }
);

test.each(['top', 'bottom'])(
    'limel-resize-handle: --limel-resize-handle-visual-length sets the length of the visible strip of a handle at the %s',
    async (location) => {
        const handle = await renderHandle({
            location: location,
            style: { '--limel-resize-handle-visual-length': '2rem' },
        });

        expect(getComputedStyle(getSeparator(handle), '::after').width).toBe(
            '32px'
        );
    }
);

test.each(['left', 'bottom'])(
    'limel-resize-handle: highlights the strip of a handle at the %s when the pointer is over it',
    async (location) => {
        const handle = await renderHandle({ location: location });
        removeTransitions(handle);

        await userEvent.hover(handle);

        expect(getHighlight(handle)).toEqual({ opacity: '1', scale: '1' });
    }
);

test.each(['left', 'bottom'])(
    'limel-resize-handle: highlights the strip of a handle at the %s when it has keyboard focus',
    async (location) => {
        const handle = await renderHandle({ location: location });
        removeTransitions(handle);

        await userEvent.tab();

        expect(getHighlight(handle)).toEqual({ opacity: '1', scale: '1' });
    }
);

test('limel-resize-handle: follows a change of location', async () => {
    const handle = await renderHandle({ location: 'left' });
    const sizes = listenForSizes(handle);

    handle.setAttribute('location', 'bottom');
    await pages.at(-1)!.waitForChanges();
    pressKey(handle, 'ArrowDown');

    expect(getSeparator(handle).getAttribute('aria-orientation')).toBe(
        'horizontal'
    );
    expect(sizes).toEqual([208]);
});

test.each([
    ['left', { left: 0, top: 0, width: 8, height: 200 }],
    ['right', { left: 392, top: 0, width: 8, height: 200 }],
    ['top', { left: 0, top: 0, width: 400, height: 8 }],
    ['bottom', { left: 0, top: 192, width: 400, height: 8 }],
])(
    'limel-resize-handle: a handle at the %s is placed on that edge of its element',
    async (location, expected) => {
        const handle = await renderHandle({ location: location });
        const element = handle.parentElement!.getBoundingClientRect();
        const rect = handle.getBoundingClientRect();

        expect({
            left: rect.left - element.left,
            top: rect.top - element.top,
            width: rect.width,
            height: rect.height,
        }).toEqual(expected);
    }
);

test('limel-resize-handle: does not let changeSize bubble', async () => {
    const handle = await renderHandle();
    const heard: Event[] = [];
    handle.parentElement!.addEventListener('changeSize', (event) => {
        heard.push(event);
    });

    pressKey(handle, 'ArrowLeft');

    expect(heard).toEqual([]);
});

test('limel-resize-handle: emits endResize when the drag ends', async () => {
    const handle = await renderHandle();
    const ends = listenForEnds(handle);

    drag(handle, [1000, 940, 1030]);
    handle.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(ends).toHaveLength(1);
});

test('limel-resize-handle: does not emit endResize when the pointer is released without having moved', async () => {
    const handle = await renderHandle();
    const ends = listenForEnds(handle);

    drag(handle, [1000]);
    handle.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(ends).toEqual([]);
});

test('limel-resize-handle: does not emit endResize during a drag', async () => {
    const handle = await renderHandle();
    const ends = listenForEnds(handle);

    drag(handle, [1000, 940, 1030]);

    expect(ends).toEqual([]);
});

test('limel-resize-handle: emits endResize after changeSize for each arrow key press', async () => {
    const handle = await renderHandle();
    const heard = listenForAll(handle);

    pressKey(handle, 'ArrowLeft');
    pressKey(handle, 'ArrowRight');

    expect(heard).toEqual([
        'changeSize',
        'endResize',
        'changeSize',
        'endResize',
    ]);
});

test('limel-resize-handle: does not let endResize bubble', async () => {
    const handle = await renderHandle();
    const heard: Event[] = [];
    handle.parentElement!.addEventListener('endResize', (event) => {
        heard.push(event);
    });

    pressKey(handle, 'ArrowLeft');

    expect(heard).toEqual([]);
});

/**
 * Renders a handle in a 400px wide element, which is the element it resizes,
 * and moves the pointer to the middle of that element, so that no handle is
 * under a pointer that an earlier test left behind.
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
    await userEvent.hover(page.root!);

    return page.root!.querySelector('limel-resize-handle')!;
}

/**
 * Renders a handle directly in the shadow root of a 400px wide element.
 *
 * @returns the handle
 */
async function renderHandleInShadowRoot(): Promise<HTMLElement> {
    const shadowHost = document.createElement('div');
    shadowHost.style.width = '400px';
    shadowHost.style.height = '200px';
    const handle = document.createElement('limel-resize-handle');
    shadowHost.attachShadow({ mode: 'open' }).append(handle);
    document.body.append(shadowHost);
    shadowHosts.push(shadowHost);
    await handle.componentOnReady();

    return handle;
}

/**
 * Drags the handle. `setPointerCapture` is mocked, because synthetic events
 * have no active pointer.
 *
 * @param handle - the handle
 * @param positions - the coordinate of `pointerdown`, then of each `pointermove`
 * @param coordinate - the coordinate that `positions` are for
 */
function drag(
    handle: HTMLElement,
    positions: number[],
    coordinate: 'clientX' | 'clientY' = 'clientX'
) {
    const [start, ...moves] = positions;
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', {
            [coordinate]: start,
            pointerId: 1,
        })
    );
    for (const position of moves) {
        handle.dispatchEvent(
            new PointerEvent('pointermove', {
                [coordinate]: position,
                pointerId: 1,
            })
        );
    }
}

/**
 * Renders a handle that has focus without the keyboard, and the pointer over
 * it. A mouse click on another element comes first, because Chromium counts a
 * script focus as keyboard focus after earlier keyboard input.
 *
 * @returns the handle
 */
async function renderHandleWithFocusFromScript(): Promise<HTMLElement> {
    const page = await render(
        <div style={{ position: 'relative', width: '400px', height: '200px' }}>
            <button style={{ margin: '4rem' }}>Other</button>
            <limel-resize-handle />
        </div>
    );
    pages.push(page);
    const handle = page.root!.querySelector('limel-resize-handle')!;

    await userEvent.click(page.root!.querySelector('button')!);
    await userEvent.hover(handle);
    getSeparator(handle).focus();
    await page.waitForChanges();

    expect(handle.shadowRoot!.activeElement).toBe(getSeparator(handle));
    expect(getSeparator(handle).matches(':focus-visible')).toBe(false);

    return handle;
}

function removeTransitions(handle: HTMLElement) {
    const style = document.createElement('style');
    style.textContent =
        '*, *::before, *::after { transition: none !important; }';
    handle.shadowRoot!.append(style);
}

function getHighlight(handle: HTMLElement) {
    const style = getComputedStyle(getSeparator(handle), '::before');

    return { opacity: style.opacity, scale: style.scale };
}

function getSeparator(handle: HTMLElement): HTMLElement {
    return handle.shadowRoot!.querySelector<HTMLElement>('[role="separator"]')!;
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

function listenForEnds(handle: HTMLElement): Event[] {
    const ends: Event[] = [];
    handle.addEventListener('endResize', (event) => {
        ends.push(event);
    });

    return ends;
}

function listenForAll(handle: HTMLElement): string[] {
    const heard: string[] = [];
    for (const type of ['changeSize', 'endResize']) {
        handle.addEventListener(type, () => {
            heard.push(type);
        });
    }

    return heard;
}
