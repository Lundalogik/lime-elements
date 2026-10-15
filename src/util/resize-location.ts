import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP } from './keycodes';

const KEYBOARD_SIZE_STEP = 8;

export type ResizeLocation = 'left' | 'right' | 'top' | 'bottom';

interface LocationTraits {
    /**
     * The axis that the handle is moved along.
     */
    axis: 'x' | 'y';

    /**
     * The cursor to show while the handle is dragged.
     */
    cursor: 'col-resize' | 'row-resize';

    /**
     * `1` when the element gets larger as the pointer moves towards higher
     * coordinates, and `-1` when it gets larger towards lower coordinates.
     */
    direction: 1 | -1;

    /**
     * The key that moves the handle away from the element, which makes the
     * element larger.
     */
    growKey: string;

    /**
     * The key that moves the handle into the element, which makes the element
     * smaller.
     */
    shrinkKey: string;
}

export const resizeLocations: Record<ResizeLocation, LocationTraits> = {
    left: {
        axis: 'x',
        cursor: 'col-resize',
        direction: -1,
        growKey: ARROW_LEFT,
        shrinkKey: ARROW_RIGHT,
    },
    right: {
        axis: 'x',
        cursor: 'col-resize',
        direction: 1,
        growKey: ARROW_RIGHT,
        shrinkKey: ARROW_LEFT,
    },
    top: {
        axis: 'y',
        cursor: 'row-resize',
        direction: -1,
        growKey: ARROW_UP,
        shrinkKey: ARROW_DOWN,
    },
    bottom: {
        axis: 'y',
        cursor: 'row-resize',
        direction: 1,
        growKey: ARROW_DOWN,
        shrinkKey: ARROW_UP,
    },
};

/**
 * Returns the orientation of a separator that is a handle at the given
 * location.
 *
 * @param location - the location of the handle
 * @returns the orientation
 */
export function getOrientation(
    location: ResizeLocation
): 'vertical' | 'horizontal' {
    return resizeLocations[location].axis === 'x' ? 'vertical' : 'horizontal';
}

/**
 * Returns how many pixels the size of the element changes when the key is
 * pressed while the handle has focus.
 *
 * @param location - the location of the handle
 * @param key - the `key` of the keyboard event
 * @returns the change in pixels, or `undefined` when the key does not resize
 */
export function getKeyboardSizeChange(
    location: ResizeLocation,
    key: string
): number | undefined {
    const { growKey, shrinkKey } = resizeLocations[location];
    if (key === growKey) {
        return KEYBOARD_SIZE_STEP;
    }

    if (key === shrinkKey) {
        return -KEYBOARD_SIZE_STEP;
    }
}

/**
 * Returns the size of the element along the axis that a handle at the given
 * location resizes: the width for `left` and `right`, the height for `top` and
 * `bottom`.
 *
 * `offsetWidth` and `offsetHeight` are used and not `getBoundingClientRect`,
 * because an ancestor can be scaled with a transform.
 *
 * @param element - the element that the handle resizes
 * @param location - the location of the handle
 * @returns the size in pixels
 */
export function measureSize(
    element: HTMLElement,
    location: ResizeLocation
): number {
    return resizeLocations[location].axis === 'x'
        ? element.offsetWidth
        : element.offsetHeight;
}
