/**
 * Detail payload emitted when a drag reordering gesture starts.
 * `index` represents the position of the item among the filtered reorderable nodes.
 */
export interface DragToReorderStartDetail {
    index: number;
    item: HTMLElement;
    id?: string;
}

/**
 * Detail payload representing a preview move while the pointer is still held.
 * Consumers should update their temporary DOM state to mirror the visual reorder.
 */
export interface DragToReorderPreviewDetail {
    fromIndex: number;
    toIndex: number;
    item: HTMLElement;
    id?: string;
}

/**
 * Detail payload describing the final outcome of a drag interaction.
 * `cancelled` indicates whether the gesture ended normally or aborted mid-way.
 */
export interface DragToReorderFinalizeDetail {
    fromIndex: number;
    toIndex: number;
    item: HTMLElement;
    id?: string;
    cancelled: boolean;
}

/**
 * Configuration for the drag-to-reorder helper.
 * `itemSelector` and `dragHandleSelector` should both resolve inside `container`.
 */
export interface DragToReorderOptions {
    container: HTMLElement;
    itemSelector: string;
    dragHandleSelector: string;
    draggingClass?: string;
    /** Class toggled on the container while a drag is active. */
    containerDraggingClass?: string;
    /** Class applied briefly when an item is dropped to highlight the new position. */
    dropElevationClass?: string;
    /** Duration in milliseconds before removing the drop elevation class (defaults to 1000ms). */
    dropElevationDuration?: number;
    getItemId?: (item: HTMLElement) => string | undefined;
    onStart?: (detail: DragToReorderStartDetail) => void;
    onPreview: (detail: DragToReorderPreviewDetail) => void;
    onFinalize: (detail: DragToReorderFinalizeDetail) => void;
}

export interface DragToReorderController {
    destroy(): void;
}

interface ActiveDragState {
    pointerId: number;
    handle: HTMLElement;
    item: HTMLElement;
    originalIndex: number;
    currentIndex: number;
    id?: string;
}

const DEFAULT_DRAGGING_CLASS = 'is-being-dragged';
const DEFAULT_CONTAINER_CLASS = 'has-an-item-which-is-being-dragged';
const DEFAULT_DROP_ELEVATION_CLASS = 'is-elevated';
const DEFAULT_DROP_ELEVATION_DURATION = 1000;

/**
 * Drag to reorder utility
 *
 * Lightweight pointer-driven drag helper for list-like layouts.
 * Keeps responsibilities split: this utility handles pointer + DOM bookkeeping,
 * while the caller owns rendering state updates through the supplied callbacks.
 *
 * ## Usage notes
 * - This helper uses low-level `pointer*` events instead of the native HTML Drag & Drop API,
 *   which makes behavior consistent across mouse, touch, and stylus input; and avoids
 *   many of the quirks and limitations of the native API.
 * - The helper relies on CSS selectors to identify both the draggable items and the
 *   drag handles within them. This allows consumers to define complex item structures
 *   with specific drag handles (e.g. an icon button) without requiring extra markup
 *   or event listeners.
 * - It assumes items are stacked vertically. The drop target is derived from the
 *   pointer's Y position relative to each element's midpoint, so horizontal
 *   arrangements are not currently supported.
 * - A CSS class (defaults to `is-being-dragged`) is applied to the active item. Consumers
 *   should style this class inside their component Shadow DOM (e.g. add elevation) to
 *   communicate movement. The container simultaneously receives `has-an-item-which-is-being-dragged`
 *   (override via `containerDraggingClass`) in case you want to highlight the entire drop zone.
 * - While dragging the item also gets `is-elevated` (override via `dropElevationClass`). The class
 *   remains for one second after drop to give styles time to gracefully transition back.
 * - The helper temporarily sets `document.body.style.userSelect` and `.cursor` to prevent
 *   text selection and enforce a grabbing cursor during the interaction. Components do not need
 *   to manage these resets themselves — they are restored automatically when the drag ends.
 * - Call `dragToReorder({ ... })` in `componentDidLoad` (or equivalent) and keep a reference to
 *   the returned controller so you can invoke `destroy()` when your component unmounts.
 * - Use the `onPreview` callback to mirror the current visual ordering (e.g. reorder rows in state)
 *   and `onFinalize` to persist the change or revert when `cancelled` is true.
 */

/**
 * Enable drag-and-drop style reordering for list-like DOM structures.
 *
 * @param options configuration for drag behavior and callbacks
 */
export function dragToReorder(
    options: DragToReorderOptions
): DragToReorderController {
    if (!options?.container) {
        throw new Error(
            'Error in `dragToReorder`: Required option `container` is missing.'
        );
    }

    if (!options.itemSelector) {
        throw new Error(
            'Error in `dragToReorder`: Required option `itemSelector` is missing.'
        );
    }

    if (!options.dragHandleSelector) {
        throw new Error(
            'Error in `dragToReorder`: Required option `dragHandleSelector` is missing.'
        );
    }

    if (!options.onPreview) {
        throw new Error(
            'Error in `dragToReorder`: Required option `onPreview` is missing.'
        );
    }

    if (!options.onFinalize) {
        throw new Error(
            'Error in `dragToReorder`: Required option `onFinalize` is missing.'
        );
    }

    const draggingClass = options.draggingClass || DEFAULT_DRAGGING_CLASS;
    const containerActiveClass =
        options.containerDraggingClass || DEFAULT_CONTAINER_CLASS;
    const dropElevationClass =
        options.dropElevationClass || DEFAULT_DROP_ELEVATION_CLASS;
    const dropElevationDuration =
        options.dropElevationDuration ?? DEFAULT_DROP_ELEVATION_DURATION;
    const getItemId =
        options.getItemId ||
        ((item: HTMLElement) => item.dataset.reorderId || undefined);

    let activeDrag: ActiveDragState | undefined;
    let previousUserSelect: string | undefined;
    let previousCursor: string | undefined;
    let dropElevationTimeout: ReturnType<typeof setTimeout> | undefined;
    let dropElevationTarget: HTMLElement | undefined;

    const getItemElements = () => {
        return [
            ...options.container.querySelectorAll(options.itemSelector),
        ] as HTMLElement[];
    };

    // Activate dragging only when pressing a recognized handle inside the container
    const pointerDownListener = (event: PointerEvent) => {
        if (
            event.pointerType === 'mouse' &&
            'button' in event &&
            event.button !== 0
        ) {
            return;
        }

        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }

        const handle = target.closest(options.dragHandleSelector);
        if (!(handle instanceof HTMLElement)) {
            return;
        }

        const item = handle.closest(options.itemSelector);
        if (!(item instanceof HTMLElement)) {
            return;
        }

        const items = getItemElements();
        const originalIndex = items.indexOf(item);
        if (originalIndex === -1) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        if (dropElevationTimeout !== undefined) {
            clearTimeout(dropElevationTimeout);
            dropElevationTimeout = undefined;
        }
        if (dropElevationTarget) {
            dropElevationTarget.classList.remove(dropElevationClass);
            dropElevationTarget = undefined;
        }

        activeDrag = {
            pointerId: event.pointerId,
            handle,
            item,
            originalIndex,
            currentIndex: originalIndex,
            id: getItemId(item),
        };

        handle.setPointerCapture?.(event.pointerId);
        previousUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = 'none';
        previousCursor = document.body.style.cursor;
        document.body.style.cursor = 'grabbing';
        item.classList.add(dropElevationClass, draggingClass);
        options.container.classList.add(containerActiveClass);

        options.onStart?.({
            index: originalIndex,
            item,
            id: activeDrag.id,
        });

        // Listen on the document to keep tracking even when the pointer leaves the list
        document.addEventListener('pointermove', pointerMoveListener, {
            passive: false,
        });
        document.addEventListener('pointerup', pointerUpListener);
        document.addEventListener('pointercancel', pointerCancelListener);
    };

    // Calculate which item the pointer hovers over and inform the consumer
    const pointerMoveListener = (event: PointerEvent) => {
        if (!activeDrag) {
            return;
        }

        event.preventDefault();

        const items = getItemElements();
        if (items.length === 0) {
            return;
        }

        const pointerY = event.clientY;
        let targetIndex = items.length - 1;

        let index = 0;
        for (const element of items) {
            const rect = element.getBoundingClientRect();
            const threshold = rect.top + rect.height / 2;
            if (pointerY < threshold) {
                targetIndex = index;
                break;
            }
            index += 1;
        }

        if (targetIndex < 0) {
            targetIndex = 0;
        }

        if (targetIndex === activeDrag.currentIndex) {
            return;
        }

        options.onPreview({
            fromIndex: activeDrag.currentIndex,
            toIndex: targetIndex,
            item: activeDrag.item,
            id: activeDrag.id,
        });

        activeDrag.currentIndex = targetIndex;
    };

    // Clean up listeners, restore styles, and let the consumer decide how to persist
    const finalizeDrag = (cancelled: boolean) => {
        if (!activeDrag) {
            return;
        }

        const state = activeDrag;
        activeDrag = undefined;

        state.handle.releasePointerCapture?.(state.pointerId);
        state.item.classList.remove(draggingClass);
        options.container.classList.remove(containerActiveClass);

        document.body.style.userSelect = previousUserSelect ?? '';
        previousUserSelect = undefined;
        document.body.style.cursor = previousCursor ?? '';
        previousCursor = undefined;

        document.removeEventListener('pointermove', pointerMoveListener);
        document.removeEventListener('pointerup', pointerUpListener);
        document.removeEventListener('pointercancel', pointerCancelListener);

        options.onFinalize({
            fromIndex: state.originalIndex,
            toIndex: state.currentIndex,
            item: state.item,
            id: state.id,
            cancelled,
        });

        if (dropElevationTimeout !== undefined) {
            clearTimeout(dropElevationTimeout);
            dropElevationTimeout = undefined;
        }

        if (cancelled || dropElevationDuration <= 0) {
            state.item.classList.remove(dropElevationClass);
            if (dropElevationTarget === state.item) {
                dropElevationTarget = undefined;
            }
            return;
        }

        dropElevationTarget = state.item;
        const itemToReset = state.item;
        dropElevationTimeout = globalThis.setTimeout(() => {
            itemToReset.classList.remove(dropElevationClass);
            if (dropElevationTarget === itemToReset) {
                dropElevationTarget = undefined;
            }
            dropElevationTimeout = undefined;
        }, dropElevationDuration);
    };

    // Pointer released normally – treat as a completed reorder
    const pointerUpListener = (event: PointerEvent) => {
        if (!activeDrag || event.pointerId !== activeDrag.pointerId) {
            return;
        }

        event.preventDefault();
        finalizeDrag(false);
    };

    // Browser or OS cancelled the pointer sequence – revert to the snapshot state
    const pointerCancelListener = (event: PointerEvent) => {
        if (!activeDrag || event.pointerId !== activeDrag.pointerId) {
            return;
        }

        finalizeDrag(true);
    };

    options.container.addEventListener('pointerdown', pointerDownListener);

    // Allow the caller to tear down the helper, useful when the list unmounts
    const destroy = () => {
        options.container.removeEventListener(
            'pointerdown',
            pointerDownListener
        );
        if (activeDrag) {
            finalizeDrag(true);
        }

        if (dropElevationTimeout !== undefined) {
            clearTimeout(dropElevationTimeout);
            dropElevationTimeout = undefined;
        }

        if (dropElevationTarget) {
            dropElevationTarget.classList.remove(dropElevationClass);
            dropElevationTarget = undefined;
        }
    };

    return {
        destroy,
    };
}
