import { afterEach, expect, test, vi } from 'vitest';
import { dragToResize } from './drag-to-resize';

afterEach(() => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
});

test('dragToResize: calls onResize with the new width', () => {
    const edge = listenToAnEdge();

    drag(edge, { from: 1000, to: 940 });

    expect(edge.widths).toEqual([460]);
});

test('dragToResize: ignores pointermove after pointerup', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 800, pointerId: 1 })
    );

    expect(edge.widths).toEqual([460]);
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

    expect(edge.widths).toEqual([460]);
});

test('dragToResize: ignores pointer events after cleanup', () => {
    const edge = listenToAnEdge();

    edge.stopListening();
    drag(edge, { from: 1000, to: 940 });

    expect(edge.widths).toEqual([]);
});

test('dragToResize: sets cursor and user-select on body during a drag', () => {
    const edge = listenToAnEdge();

    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );

    expect(document.body.style.cursor).toBe('col-resize');
    expect(document.body.style.userSelect).toBe('none');
});

test('dragToResize: resets body styles on pointerup', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(document.body.style.cursor).toBe('');
    expect(document.body.style.userSelect).toBe('');
});

test('dragToResize: restores the earlier body styles when the drag ends', () => {
    document.body.style.cursor = 'wait';
    document.body.style.userSelect = 'text';
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    expect(document.body.style.cursor).toBe('wait');
    expect(document.body.style.userSelect).toBe('text');
});

test('dragToResize: resets body styles on pointercancel', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(
        new PointerEvent('pointercancel', { pointerId: 1 })
    );

    expect(document.body.style.cursor).toBe('');
    expect(document.body.style.userSelect).toBe('');
});

// When another element takes the capture, the `pointerup` goes to that element.
test('dragToResize: resets body styles on lostpointercapture', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(
        new PointerEvent('lostpointercapture', { pointerId: 1 })
    );

    expect(document.body.style.cursor).toBe('');
    expect(document.body.style.userSelect).toBe('');
});

test('dragToResize: starts a new drag after lostpointercapture', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(
        new PointerEvent('lostpointercapture', { pointerId: 1 })
    );
    drag(edge, { from: 1200, to: 1100 });

    expect(edge.widths).toEqual([460, 500]);
});

test('dragToResize: ignores pointermove from another pointer', () => {
    const edge = listenToAnEdge();
    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );

    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 800, pointerId: 2 })
    );

    expect(edge.widths).toEqual([]);
});

test('dragToResize: ignores pointerup from another pointer', () => {
    const edge = listenToAnEdge();
    drag(edge, { from: 1000, to: 940 });

    edge.element.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 900, pointerId: 1 })
    );

    expect(edge.widths).toEqual([460, 500]);
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

    expect(edge.widths).toEqual([460]);
});

// The body styles can belong to another drag at that time.
test('dragToResize: does not reset body styles on cleanup when no drag is active', () => {
    const edge = listenToAnEdge();
    document.body.style.cursor = 'wait';

    edge.stopListening();

    expect(document.body.style.cursor).toBe('wait');
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
     * Widths passed to `onResize`, in call order
     */
    widths: number[];

    /**
     * The cleanup function returned by `dragToResize`
     */
    stopListening: () => void;
}

function drag(edge: Edge, movement: Drag) {
    edge.element.dispatchEvent(
        new PointerEvent('pointerdown', {
            clientX: movement.from,
            pointerId: 1,
        })
    );
    edge.element.dispatchEvent(
        new PointerEvent('pointermove', { clientX: movement.to, pointerId: 1 })
    );
}

/**
 * Creates a drag handle for an element that is 400px wide. `setPointerCapture`
 * is mocked, because synthetic events have no active pointer.
 *
 * @returns the handle, the reported widths and the cleanup function
 */
function listenToAnEdge(): Edge {
    const element = document.createElement('div');
    element.setPointerCapture = vi.fn();
    const widths: number[] = [];

    const stopListening = dragToResize(
        element,
        () => 400,
        (width) => {
            widths.push(width);
        }
    );

    return { element: element, widths: widths, stopListening: stopListening };
}
