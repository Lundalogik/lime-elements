import { ResizeLocation, resizeLocations } from './resize-location';

interface BodyStyles {
    cursor: string;
    userSelect: string;
}

// Several handles can be dragged at the same time, for example with two
// fingers. The styles from before the first drag come back when the last drag
// ends.
const dragStyles: { activeDrags: number; before?: BodyStyles } = {
    activeDrags: 0,
};

/**
 * The handle has captured the pointer, but the browser draws the cursor of the
 * element under the pointer, which after the first pixel is the page, not the
 * handle. Without these styles the cursor changes when the drag leaves the
 * handle, and the drag selects the text that the pointer moves across.
 *
 * @param cursor - the cursor to show during the drag
 */
function applyDragStylesToBody(cursor: string) {
    if (dragStyles.activeDrags === 0) {
        dragStyles.before = getBodyStyles();
    }

    dragStyles.activeDrags += 1;
    setBodyStyles({ cursor: cursor, userSelect: 'none' });
}

function restoreBodyStyles() {
    dragStyles.activeDrags -= 1;
    if (dragStyles.activeDrags === 0) {
        setBodyStyles(dragStyles.before);
    }
}

function getBodyStyles(): BodyStyles {
    return {
        cursor: document.body.style.cursor,
        userSelect: document.body.style.userSelect,
    };
}

function setBodyStyles(styles: BodyStyles) {
    document.body.style.cursor = styles.cursor;
    document.body.style.userSelect = styles.userSelect;
}

export interface ResizeListener {
    /**
     * Returns the location of the handle. Called when a drag starts.
     */
    getLocation: () => ResizeLocation;

    /**
     * Returns the current size of the element, in pixels: the width when the
     * handle is on the left or the right, the height when it is at the top or
     * the bottom.
     */
    getSize: () => number;

    /**
     * Called with the new size, in pixels, on each pointer move.
     */
    resize: (size: number) => void;

    /**
     * Called when the pointer is released after `resize` was called. Not
     * called when the pointer is released without having moved, and not called
     * when the listeners are removed during a drag.
     */
    end: () => void;
}

/**
 * Makes an element resizable with a drag handle on one of its edges.
 *
 * @param handle - the drag handle
 * @param listener - gives the location and the size, and is told about the
 * resize
 * @returns a function that removes the event listeners
 */
export function dragToResize(
    handle: HTMLElement,
    listener: ResizeListener
): () => void {
    let activePointerId: number | undefined;
    let traits = resizeLocations.left;
    let startedAt: number;
    let startedSize: number;
    let hasResized = false;

    const pointerPosition = (event: PointerEvent) => {
        return traits.axis === 'x' ? event.clientX : event.clientY;
    };

    const start = (event: PointerEvent) => {
        if (activePointerId !== undefined) {
            return;
        }

        event.preventDefault();
        activePointerId = event.pointerId;
        hasResized = false;
        traits = resizeLocations[listener.getLocation()];
        startedAt = pointerPosition(event);
        startedSize = listener.getSize();
        handle.setPointerCapture(event.pointerId);
        applyDragStylesToBody(traits.cursor);
    };

    const drag = (event: PointerEvent) => {
        if (event.pointerId !== activePointerId) {
            return;
        }

        hasResized = true;
        listener.resize(
            startedSize +
                traits.direction * (pointerPosition(event) - startedAt)
        );
    };

    const end = (event: PointerEvent) => {
        if (event.pointerId !== activePointerId) {
            return;
        }

        stop();
        if (hasResized) {
            listener.end();
        }
    };

    // Cleanup also calls this, also between drags. The body styles can then
    // belong to a different drag, so they are only reset for an active drag.
    const stop = () => {
        if (activePointerId === undefined) {
            return;
        }

        activePointerId = undefined;
        restoreBodyStyles();
    };

    handle.addEventListener('pointerdown', start);
    handle.addEventListener('pointermove', drag);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
    handle.addEventListener('lostpointercapture', end);

    return () => {
        stop();
        handle.removeEventListener('pointerdown', start);
        handle.removeEventListener('pointermove', drag);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
        handle.removeEventListener('lostpointercapture', end);
    };
}
