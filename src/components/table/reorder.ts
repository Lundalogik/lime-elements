import { RowReorderEvent } from './table.types';

const DRAG_THRESHOLD = 5;
const SCROLL_EDGE = 48;
const MAX_SCROLL_STEP = 16;

/**
 * Where an item starts along the drag direction, and how long it is
 */
export interface Extent {
    start: number;
    size: number;
}

/**
 * @param extents - where each item is, in the order they are shown
 * @param position - where the pointer is
 * @returns the index the dragged item would be dropped in front of; the
 * number of items when it would be dropped after the last one
 */
export function findDropIndex(extents: Extent[], position: number): number {
    const index = extents.findIndex(
        ({ start, size }) => position < start + size / 2
    );

    return index === -1 ? extents.length : index;
}

/**
 * @param position - where the pointer is
 * @param start - where the scrolling area starts
 * @param end - where the scrolling area ends
 * @returns how far to scroll in one frame while something is dragged: below
 * zero near the start, above zero near the end, faster the closer the pointer
 * is to the edge or the further it is past it, and zero in between
 */
export function getScrollStep(
    position: number,
    start: number,
    end: number
): number {
    const intoStart = start + SCROLL_EDGE - position;
    const intoEnd = position - (end - SCROLL_EDGE);
    const depth = Math.max(intoStart, intoEnd);
    if (depth <= 0) {
        return 0;
    }

    const step = Math.ceil(Math.min(depth / SCROLL_EDGE, 1) * MAX_SCROLL_STEP);

    return intoStart > intoEnd ? -step : step;
}

function moveTo<T>(items: T[], from: number, to: number): T[] | undefined {
    if (to === from || from < 0 || from >= items.length) {
        return;
    }

    const moved = [...items];
    moved.splice(to, 0, ...moved.splice(from, 1));

    return moved;
}

/**
 * @param items - the items in their current order
 * @param from - the index of the item to move
 * @param dropIndex - the index the item is dropped in front of
 * @returns the items in their new order, or `undefined` when the item ends
 * up where it already was
 */
export function moveItem<T>(
    items: T[],
    from: number,
    dropIndex: number
): T[] | undefined {
    return moveTo(items, from, dropIndex > from ? dropIndex - 1 : dropIndex);
}

/**
 * @param rows - the rows in the order they are shown
 * @param from - the index of the row that was dragged
 * @param to - the index the row has after the move
 * @returns what to tell the consumer about the move, or `undefined` when
 * the row did not change place
 */
export function createReorderEvent<T>(
    rows: T[],
    from: number,
    to: number
): RowReorderEvent<T> | undefined {
    const moved = moveTo(rows, from, to);
    if (!moved) {
        return;
    }

    const fromRow = rows[from];
    if (to > 0) {
        return { fromRow: fromRow, toRow: moved[to - 1], above: false };
    }

    return { fromRow: fromRow, toRow: moved[to + 1], above: true };
}

/**
 * Describes a sideways drag of one item among its siblings
 */
export interface DragOptions {
    /**
     * The `pointerdown` event that may become a drag
     */
    event: PointerEvent;
    /**
     * The element being dragged
     */
    source: HTMLElement;
    /**
     * The elements it can be dropped among, in the order they are shown
     */
    targets: HTMLElement[];
    /**
     * The element that scrolls the targets. It is scrolled while the pointer
     * is near one of its edges, so that targets outside it can be reached.
     */
    scroller?: HTMLElement;
    /**
     * Called when the element is dropped, with the index of the target it
     * was dropped in front of
     */
    onDrop: (dropIndex: number) => void;
}

/**
 * Follows the pointer of a `pointerdown` until it is released or cancelled.
 * Other pointers are ignored, so a second finger cannot take over.
 *
 * @param event - the `pointerdown` event to follow
 * @param onMove - called for every move of that pointer
 * @param onEnd - called once when that pointer is released or cancelled
 * @returns a function that stops following the pointer, without calling
 * `onEnd`
 */
export function trackPointer(
    event: PointerEvent,
    onMove: (pointer: PointerEvent) => void,
    onEnd: (pointer: PointerEvent) => void = () => {}
): () => void {
    const move = (pointer: PointerEvent) => {
        if (pointer.pointerId === event.pointerId) {
            onMove(pointer);
        }
    };

    const stopListening = () => {
        globalThis.removeEventListener('pointermove', move, {
            capture: true,
        });
        globalThis.removeEventListener('pointerup', stop, {
            capture: true,
        });
        globalThis.removeEventListener('pointercancel', stop, {
            capture: true,
        });
    };

    const stop = (pointer: PointerEvent) => {
        if (pointer.pointerId !== event.pointerId) {
            return;
        }

        stopListening();
        onEnd(pointer);
    };

    globalThis.addEventListener('pointermove', move, {
        capture: true,
    });
    globalThis.addEventListener('pointerup', stop, {
        capture: true,
    });
    globalThis.addEventListener('pointercancel', stop, {
        capture: true,
    });

    return stopListening;
}

/**
 * Follows the pointer from a `pointerdown` until it is released, and marks
 * the dragged element with `data-dragging` and the place it would be dropped
 * with `data-drop`. Nothing happens until the pointer has moved a few pixels,
 * so a plain click is still a click.
 *
 * @param options - what is dragged and where it can be dropped
 * @returns a function that ends the drag without dropping anything
 */
export function trackDrag(options: DragOptions): () => void {
    const { event, source, targets, scroller, onDrop } = options;
    const getPosition = (pointer: PointerEvent) => pointer.clientX;
    const start = getPosition(event);
    let dropIndex: number | undefined;
    let lastPosition = start;
    let scrollFrame: number | undefined;

    const markDropTarget = (index?: number) => {
        for (const target of targets) {
            delete target.dataset.drop;
        }

        if (index === undefined || targets.length === 0) {
            return;
        }

        if (index < targets.length) {
            targets[index].dataset.drop = 'before';
        } else {
            targets.at(-1).dataset.drop = 'after';
        }
    };

    const updateDropTarget = () => {
        dropIndex = findDropIndex(
            targets.map((target) => {
                const rect = target.getBoundingClientRect();

                return { start: rect.left, size: rect.width };
            }),
            lastPosition
        );
        markDropTarget(dropIndex);
    };

    const scrollNearEdge = () => {
        scrollFrame = undefined;
        const rect = scroller.getBoundingClientRect();
        const step = getScrollStep(lastPosition, rect.left, rect.right);
        if (step === 0) {
            return;
        }

        const scrollBefore = scroller.scrollLeft;
        scroller.scrollBy({ left: step });
        if (scroller.scrollLeft === scrollBefore) {
            return;
        }

        updateDropTarget();
        scrollFrame = requestAnimationFrame(scrollNearEdge);
    };

    const move = (pointer: PointerEvent) => {
        const position = getPosition(pointer);
        const hasStarted = dropIndex !== undefined;
        if (!hasStarted && Math.abs(position - start) < DRAG_THRESHOLD) {
            return;
        }

        source.dataset.dragging = '';
        lastPosition = position;
        updateDropTarget();
        if (scroller) {
            scrollFrame ??= requestAnimationFrame(scrollNearEdge);
        }
    };

    const clear = () => {
        if (scrollFrame !== undefined) {
            cancelAnimationFrame(scrollFrame);
        }

        delete source.dataset.dragging;
        markDropTarget();
    };

    const stop = (pointer: PointerEvent) => {
        const isDrop = pointer.type === 'pointerup' && dropIndex !== undefined;
        if (isDrop) {
            lastPosition = getPosition(pointer);
            updateDropTarget();
        }

        clear();

        if (isDrop) {
            onDrop(dropIndex);
        }
    };

    const stopListening = trackPointer(event, move, stop);

    return () => {
        stopListening();
        clear();
    };
}
