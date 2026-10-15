import { afterEach, expect, Mock, test, vi } from 'vitest';
import { dragToResize } from './drag-to-resize';
import { ResizeLocation } from './resize-location';

// The helper counts the active drags, so a test that does not end its drag
// would change the styles that the next test sees.
const stopListeners: Array<() => void> = [];

afterEach(() => {
    for (const stopListening of stopListeners.splice(0)) {
        stopListening();
    }

    document.body.style.cursor = '';
    document.body.style.userSelect = '';
});

test('dragToResize: calls resize with the new width', () => {
    const edge = listenToAnEdge();

    drag(edge, { from: 1000, to: 940 });

    expect(edge.sizes).toEqual([460]);
});

test('dragToResize: ignores pointermove after pointerup', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 800, pointerId: 1 })
    );

    expect(edge.sizes).toEqual([460]);
});

// For example, when a touch drag turns into a scroll.
test('dragToResize: ignores pointermove after pointercancel', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(
        new PointerEvent('pointercancel', { pointerId: 1 })
    );
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 800, pointerId: 1 })
    );

    expect(edge.sizes).toEqual([460]);
});

test('dragToResize: ignores pointer events after cleanup', () => {
    const edge = listenToAnEdge();

    edge.stopListening();
    drag(edge, { from: 1000, to: 940 });

    expect(edge.sizes).toEqual([]);
});

test('dragToResize: sets cursor and user-select on body during a drag', () => {
    const edge = listenToAnEdge();

    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );

    expect(document.body.style.cursor).toBe('col-resize');
    expect(document.body.style.userSelect).toBe('none');
});

test.each([
    ['left', 460, 'col-resize'],
    ['right', 340, 'col-resize'],
    ['top', 460, 'row-resize'],
    ['bottom', 340, 'row-resize'],
] as const)(
    'dragToResize: a handle at the %s gives %i when moved 60px towards lower coordinates, and the %s cursor',
    (location, size, cursor) => {
        const edge = listenToAnEdge(location);

        drag(edge, { from: 1000, to: 940 });

        expect(edge.sizes).toEqual([size]);
        expect(document.body.style.cursor).toBe(cursor);
    }
);

test.each(['top', 'bottom'] as const)(
    'dragToResize: a handle at the %s follows clientY and not clientX',
    (location) => {
        const edge = listenToAnEdge(location);
        edge.element.dispatchEvent(
            new PointerEvent('pointerdown', {
                clientX: 0,
                clientY: 1000,
                pointerId: 1,
            })
        );

        edge.element.dispatchEvent(
            new PointerEvent('pointermove', {
                clientX: 500,
                clientY: 1000,
                pointerId: 1,
            })
        );

        expect(edge.sizes).toEqual([400]);
    }
);

test('dragToResize: reads the location when a drag starts', () => {
    const edge = listenToAnEdge('left');

    edge.location = 'right';
    drag(edge, { from: 1000, to: 940 });

    expect(edge.sizes).toEqual([340]);
});

// `lostpointercapture` ends the drag when another element takes the capture,
// because the `pointerup` then goes to that element.
test.each(['pointerup', 'pointercancel', 'lostpointercapture'])(
    'dragToResize: resets body styles on %s',
    (type) => {
        const edge = listenToAnEdge();
        drag(edge, { from: 1000, to: 940 });

        edge.element.dispatchEvent(new PointerEvent(type, { pointerId: 1 }));

        expect(document.body.style.cursor).toBe('');
        expect(document.body.style.userSelect).toBe('');
    }
);

test('dragToResize: restores the earlier body styles when the drag ends', () => {
    document.body.style.cursor = 'wait';
    document.body.style.userSelect = 'text';
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(document.body.style.cursor).toBe('wait');
    expect(document.body.style.userSelect).toBe('text');
});

test('dragToResize: starts a new drag after lostpointercapture', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(
        new PointerEvent('lostpointercapture', { pointerId: 1 })
    );
    drag(edge, { from: 1200, to: 1100 });

    expect(edge.sizes).toEqual([460, 500]);
});

test('dragToResize: ignores pointermove from another pointer', () => {
    const edge = listenToAnEdge();
    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );

    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 800, pointerId: 2 })
    );

    expect(edge.sizes).toEqual([]);
});

test('dragToResize: ignores pointerup from another pointer', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 900, pointerId: 1 })
    );

    expect(edge.sizes).toEqual([460, 500]);
});

test('dragToResize: ignores pointerdown while a drag is active', () => {
    const edge = listenToAnEdge();
    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );

    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 500, pointerId: 2 })
    );
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 940, pointerId: 1 })
    );

    expect(edge.sizes).toEqual([460]);
});

// The body styles can belong to another drag at that time.
test('dragToResize: does not reset body styles on cleanup when no drag is active', () => {
    const edge = listenToAnEdge();
    document.body.style.cursor = 'wait';

    edge.stopListening();

    expect(document.body.style.cursor).toBe('wait');
});

test.each(['pointerup', 'pointercancel', 'lostpointercapture'])(
    'dragToResize: calls end on %s',
    (type) => {
        const edge = listenToAnEdge();
        drag(edge, { from: 1000, to: 940 });

        edge.element.dispatchEvent(new PointerEvent(type, { pointerId: 1 }));

        expect(edge.end).toHaveBeenCalledTimes(1);
    }
);

test.each(['pointerup', 'pointercancel', 'lostpointercapture'])(
    'dragToResize: does not call end on %s when the pointer did not move',
    (type) => {
        const edge = listenToAnEdge();
        press(edge);

        edge.element.dispatchEvent(new PointerEvent(type, { pointerId: 1 }));

        expect(edge.end).not.toHaveBeenCalled();
    }
);

test('dragToResize: calls end for a drag that moves after an earlier press that did not move', () => {
    const edge = listenToAnEdge();
    press(edge);
    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    drag(edge, { from: 1000, to: 940 });
    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(edge.end).toHaveBeenCalledTimes(1);
});

test('dragToResize: does not call end for a press that did not move after an earlier drag', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });
    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    press(edge);
    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(edge.end).toHaveBeenCalledTimes(1);
});

// Two fingers can drag two handles at the same time.
test.each([
    ['in the order they started', [0, 1]],
    ['in the opposite order', [1, 0]],
] as const)(
    'dragToResize: restores the earlier body styles when two overlapping drags end %s',
    (_, order) => {
        document.body.style.cursor = 'wait';
        document.body.style.userSelect = 'text';
        const edges = [listenToAnEdge(), listenToAnEdge('top')];
        for (const edge of edges) {
            press(edge);
        }

        for (const index of order) {
            edges[index].element.dispatchEvent(
                new PointerEvent('pointerup', { pointerId: 1 })
            );
        }

        expect(document.body.style.cursor).toBe('wait');
        expect(document.body.style.userSelect).toBe('text');
    }
);

test('dragToResize: keeps the drag styles on body while another drag is active', () => {
    const edges = [listenToAnEdge(), listenToAnEdge()];
    for (const edge of edges) {
        press(edge);
    }

    edges[0].element.dispatchEvent(
        new PointerEvent('pointerup', { pointerId: 1 })
    );

    expect(document.body.style.userSelect).toBe('none');
});

test('dragToResize: restores the earlier body styles when one of two overlapping drags is cleaned up', () => {
    document.body.style.userSelect = 'text';
    const edges = [listenToAnEdge(), listenToAnEdge()];
    for (const edge of edges) {
        press(edge);
    }

    edges[0].stopListening();
    edges[1].element.dispatchEvent(
        new PointerEvent('pointerup', { pointerId: 1 })
    );

    expect(document.body.style.userSelect).toBe('text');
});

// The browser releases the capture after `pointerup`.
test('dragToResize: calls end once when lostpointercapture follows pointerup', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
    edge.element.dispatchEvent(
        new PointerEvent('lostpointercapture', { pointerId: 1 })
    );

    expect(edge.end).toHaveBeenCalledTimes(1);
});

test('dragToResize: does not call end for pointerup from another pointer', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));

    expect(edge.end).not.toHaveBeenCalled();
});

// The element is removed, so nothing must react to the end of the drag.
test('dragToResize: does not call end on cleanup during a drag', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.stopListening();

    expect(edge.end).not.toHaveBeenCalled();
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

interface Edge {
    /**
     * The drag handle
     */
    element: HTMLElement;

    /**
     * The location that the listener gives
     */
    location: ResizeLocation;

    /**
     * Sizes passed to `resize`, in call order
     */
    sizes: number[];

    /**
     * The `end` callback
     */
    end: Mock<() => void>;

    /**
     * The cleanup function returned by `dragToResize`
     */
    stopListening: () => void;
}

function press(edge: Edge) {
    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );
}

function drag(edge: Edge, movement: Drag) {
    const coordinate = ['top', 'bottom'].includes(edge.location)
        ? 'clientY'
        : 'clientX';
    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', {
            [coordinate]: movement.from,
            pointerId: 1,
        })
    );
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', {
            [coordinate]: movement.to,
            pointerId: 1,
        })
    );
}

/**
 * Creates a drag handle for an element that is 400px wide and 400px high.
 * `setPointerCapture` is mocked, because synthetic events have no active
 * pointer.
 *
 * @param location - the location of the handle
 * @returns the handle, the reported sizes, the `end` callback and the cleanup
 * function
 */
function listenToAnEdge(location: ResizeLocation = 'left'): Edge {
    const element = document.createElement('div');
    element.setPointerCapture = vi.fn();
    const sizes: number[] = [];
    const end = vi.fn();

    const edge: Edge = {
        element: element,
        location: location,
        sizes: sizes,
        end: end,
        stopListening: dragToResize(element, {
            getLocation: () => edge.location,
            getSize: () => 400,
            resize: (size) => {
                sizes.push(size);
            },
            end: end,
        }),
    };
    stopListeners.push(edge.stopListening);

    return edge;
}
