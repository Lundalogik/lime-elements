import { RowReorderEvent } from './table.types';

const DRAG_THRESHOLD = 5;

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
    const to = dropIndex > from ? dropIndex - 1 : dropIndex;
    if (to === from || from < 0 || from >= items.length) {
        return;
    }

    const moved = [...items];
    moved.splice(to, 0, ...moved.splice(from, 1));

    return moved;
}

/**
 * @param rows - the rows in the order they are shown
 * @param from - the index of the row that was dragged
 * @param dropIndex - the index the row was dropped in front of
 * @returns what to tell the consumer about the move, or `undefined` when
 * the row did not change place
 */
export function createReorderEvent<T>(
    rows: T[],
    from: number,
    dropIndex: number
): RowReorderEvent<T> | undefined {
    const moved = moveItem(rows, from, dropIndex);
    if (!moved) {
        return;
    }

    const fromRow = rows[from];
    const to = moved.indexOf(fromRow);
    if (to > 0) {
        return { fromRow: fromRow, toRow: moved[to - 1], above: false };
    }

    return { fromRow: fromRow, toRow: moved[to + 1], above: true };
}

/**
 * Describes a drag of one item among its siblings
 */
export interface DragOptions {
    /**
     * The `pointerdown` event that may become a drag
     */
    event: PointerEvent;
    /**
     * The direction the items are laid out in
     */
    axis: 'x' | 'y';
    /**
     * The element being dragged
     */
    source: HTMLElement;
    /**
     * The elements it can be dropped among, in the order they are shown
     */
    targets: HTMLElement[];
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
 */
export function trackPointer(
    event: PointerEvent,
    onMove: (pointer: PointerEvent) => void,
    onEnd: (pointer: PointerEvent) => void = () => {}
): void {
    const move = (pointer: PointerEvent) => {
        if (pointer.pointerId === event.pointerId) {
            onMove(pointer);
        }
    };

    const stop = (pointer: PointerEvent) => {
        if (pointer.pointerId !== event.pointerId) {
            return;
        }

        globalThis.removeEventListener('pointermove', move);
        globalThis.removeEventListener('pointerup', stop);
        globalThis.removeEventListener('pointercancel', stop);
        onEnd(pointer);
    };

    globalThis.addEventListener('pointermove', move);
    globalThis.addEventListener('pointerup', stop);
    globalThis.addEventListener('pointercancel', stop);
}

/**
 * Follows the pointer from a `pointerdown` until it is released, and marks
 * the dragged element with `data-dragging` and the place it would be dropped
 * with `data-drop`. Nothing happens until the pointer has moved a few pixels,
 * so a plain click is still a click.
 *
 * @param options - what is dragged and where it can be dropped
 */
export function trackDrag(options: DragOptions): void {
    const { event, axis, source, targets, onDrop } = options;
    const getPosition = (pointer: PointerEvent) =>
        axis === 'x' ? pointer.clientX : pointer.clientY;
    const start = getPosition(event);
    let dropIndex: number | undefined;

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

    const move = (pointer: PointerEvent) => {
        const position = getPosition(pointer);
        const hasStarted = dropIndex !== undefined;
        if (!hasStarted && Math.abs(position - start) < DRAG_THRESHOLD) {
            return;
        }

        source.dataset.dragging = '';
        dropIndex = findDropIndex(
            targets.map((target) => {
                const rect = target.getBoundingClientRect();

                return axis === 'x'
                    ? { start: rect.left, size: rect.width }
                    : { start: rect.top, size: rect.height };
            }),
            position
        );
        markDropTarget(dropIndex);
    };

    const stop = (pointer: PointerEvent) => {
        delete source.dataset.dragging;
        markDropTarget();

        if (pointer.type === 'pointerup' && dropIndex !== undefined) {
            onDrop(dropIndex);
        }
    };

    trackPointer(event, move, stop);
}
