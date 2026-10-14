const DRAG_CURSOR = 'col-resize';

interface BodyStyles {
    cursor: string;
    userSelect: string;
}

/**
 * The handle has captured the pointer, but the browser draws the cursor of the
 * element under the pointer, which after the first pixel is the page, not the
 * handle. Without these styles the cursor changes when the drag leaves the
 * handle, and the drag selects the text that the pointer moves across.
 */
function applyDragStylesToBody(): BodyStyles {
    const earlierStyles = getBodyStyles();
    setBodyStyles({ cursor: DRAG_CURSOR, userSelect: 'none' });

    return earlierStyles;
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

/**
 * Makes an element resizable with a drag handle on its left edge.
 *
 * @param handle - the drag handle
 * @param widthNow - returns the current width of the element, in pixels
 * @param onResize - called with the new width, in pixels, on each pointer move
 * @returns a function that removes the event listeners
 */
export function dragToResize(
    handle: HTMLElement,
    widthNow: () => number,
    onResize: (width: number) => void
): () => void {
    let activePointerId: number | undefined;
    let startedAt: number;
    let startedWide: number;
    let bodyStylesBeforeDrag: BodyStyles;

    const start = (event: PointerEvent) => {
        if (activePointerId !== undefined) {
            return;
        }

        event.preventDefault();
        activePointerId = event.pointerId;
        startedAt = event.clientX;
        startedWide = widthNow();
        handle.setPointerCapture(event.pointerId);
        bodyStylesBeforeDrag = applyDragStylesToBody();
    };

    const drag = (event: PointerEvent) => {
        if (event.pointerId !== activePointerId) {
            return;
        }

        // The handle is on the left edge, so moving it to the left increases the
        // width.
        onResize(startedWide - (event.clientX - startedAt));
    };

    const end = (event: PointerEvent) => {
        if (event.pointerId !== activePointerId) {
            return;
        }

        stop();
    };

    // Cleanup also calls this, also between drags. The body styles can then
    // belong to a different drag, so they are only reset for an active drag.
    const stop = () => {
        if (activePointerId === undefined) {
            return;
        }

        activePointerId = undefined;
        setBodyStyles(bodyStylesBeforeDrag);
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
