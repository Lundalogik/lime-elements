import {
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    ARROW_UP,
    END,
    HOME,
} from './keycodes';

/**
 * These helpers implement the keyboard navigation of a row or a column of
 * items, of which only one at a time is in the tab order. That is known as a
 * "roving tabindex": the arrow keys move between the items, Home and End jump
 * to the first and the last one, and Tab leaves the whole group. Tabbing back
 * in lands on the item that was left, since that is the one that is in the tab
 * order.
 *
 * Like the helpers in `typeahead.ts`, everything here is pure and stateless.
 * The component keeps the state, and does the moving itself, since what moving
 * means is not the same everywhere: moving between tabs selects the tab, while
 * moving in a list only moves the focus. The component asks
 * - whether a key press moves at all, with `isNavigationKey`
 * - where it moves to, with `findNavigationTarget`
 * - which item to put in the tab order, with `findTabStop`
 */

/**
 * The direction in which the items are laid out. A row is navigated with the
 * left and right arrow keys, and a column with the up and down ones.
 */
export type NavigationOrientation = 'horizontal' | 'vertical';

/**
 * Returned when there is no item to move to.
 */
export const NO_NAVIGATION_TARGET = -1;

export interface NavigationOptions<T> {
    /**
     * The direction in which the items are laid out.
     */
    orientation: NavigationOrientation;

    /**
     * Whether moving past the last item continues at the first one, and
     * moving back from the first item continues at the last one. Without it,
     * moving stops at the ends.
     */
    wrap?: boolean;

    /**
     * Tells whether an item cannot be moved to, because it is disabled or is
     * not an item at all, like a separator. Such an item is skipped, but still
     * has its place among the items.
     */
    isDisabled?: (item: T) => boolean;
}

type Move = 'previous' | 'next' | 'first' | 'last';

const MOVES: Record<NavigationOrientation, ReadonlyMap<string, Move>> = {
    horizontal: new Map<string, Move>([
        [ARROW_LEFT, 'previous'],
        [ARROW_RIGHT, 'next'],
        [HOME, 'first'],
        [END, 'last'],
    ]),
    vertical: new Map<string, Move>([
        [ARROW_UP, 'previous'],
        [ARROW_DOWN, 'next'],
        [HOME, 'first'],
        [END, 'last'],
    ]),
};

/**
 * Whether a keyboard event is one that moves between the items: an arrow key
 * that goes along the orientation, or Home or End.
 *
 * A key that is pressed with Alt, Ctrl or Cmd is not, since the browser puts
 * those to its own use, such as going back with Alt and the left arrow. Shift
 * is allowed.
 *
 * When this returns `true`, the component should prevent the default action
 * of the event, so that the page does not scroll. Also when there turns out to
 * be nowhere to move to.
 *
 * @param event - the keyboard event to inspect
 * @param options - the same options that are used to move between the items.
 * Only the orientation matters here.
 * @returns `true` when the event is for moving between the items
 */
export function isNavigationKey(
    event: KeyboardEvent,
    options: Pick<NavigationOptions<unknown>, 'orientation'>
): boolean {
    if (event.altKey || event.ctrlKey || event.metaKey) {
        return false;
    }

    return MOVES[options.orientation].has(event.key);
}

/**
 * Find the item that a key press moves to.
 *
 * - The arrow keys that go along the orientation move to the next and the
 *   previous item. At the ends they stop, or continue at the other end when
 *   `options.wrap` is set.
 * - Home and End move to the first and the last item.
 * - Items that cannot be moved to are skipped.
 * - Without a current item, moving forward starts at the first item, and
 *   moving back at the last one.
 *
 * @param items - the items, in the order that they are laid out in. Only their
 * number matters, unless `options.isDisabled` is given.
 * @param key - the `key` of the keyboard event
 * @param currentIndex - the index of the item to move from, usually the one
 * that has focus. Anything outside `items` is treated as "no current item".
 * @param options - which keys move, and how
 * @returns the index of the item to move to. That is `currentIndex` itself
 * when there is nowhere to go from there, since the end is reached and it does
 * not wrap, or since it is the only item that can be moved to. It is
 * `NO_NAVIGATION_TARGET` when the key does not move in this orientation, and
 * when none of the items can be moved to.
 */
export function findNavigationTarget<T>(
    items: ReadonlyArray<T>,
    key: string,
    currentIndex: number,
    options: NavigationOptions<T>
): number {
    const move = MOVES[options.orientation].get(key);
    const count = items.length;
    const canMoveTo = createReachableTest(items, options);
    const first = findReachable(count, 0, 1, false, canMoveTo);

    if (!move || first === NO_NAVIGATION_TARGET) {
        return NO_NAVIGATION_TARGET;
    }

    if (move === 'first') {
        return first;
    }

    const last = findReachable(count, count - 1, -1, false, canMoveTo);
    if (move === 'last') {
        return last;
    }

    if (!isWithin(currentIndex, count)) {
        return move === 'next' ? first : last;
    }

    const step = move === 'next' ? 1 : -1;
    const target = findReachable(
        count,
        currentIndex + step,
        step,
        Boolean(options.wrap),
        canMoveTo
    );

    return target === NO_NAVIGATION_TARGET ? currentIndex : target;
}

/**
 * Find the item that should be in the tab order, which is the one that Tab
 * lands on when it enters the group. The rest of the items are left out of the
 * tab order, and are reached with the arrow keys.
 *
 * That is the preferred item, if it can be moved to. Otherwise the first item
 * that can.
 *
 * @param items - the items, in the order that they are laid out in. Only their
 * number matters, unless `options.isDisabled` is given.
 * @param preferredIndex - the index of the item that should be in the tab
 * order if possible. For a group with a selection that is the selected item,
 * and otherwise the item that last had focus, which the component has to keep
 * track of. Anything outside `items` means that there is no preference.
 * @param options - the same options that are used to move between the items
 * @returns the index of the item to put in the tab order, or
 * `NO_NAVIGATION_TARGET` when none of the items can be moved to
 */
export function findTabStop<T>(
    items: ReadonlyArray<T>,
    preferredIndex: number,
    options?: Pick<NavigationOptions<T>, 'isDisabled'>
): number {
    const count = items.length;
    const canMoveTo = createReachableTest(items, options);

    if (isWithin(preferredIndex, count) && canMoveTo(preferredIndex)) {
        return preferredIndex;
    }

    return findReachable(count, 0, 1, false, canMoveTo);
}

function isWithin(index: number, count: number): boolean {
    return index >= 0 && index < count;
}

function createReachableTest<T>(
    items: ReadonlyArray<T>,
    options?: Pick<NavigationOptions<T>, 'isDisabled'>
): (index: number) => boolean {
    return (index) => !options?.isDisabled?.(items[index]);
}

/**
 * Look for an item that can be moved to, one item at a time.
 *
 * @param count - the number of items
 * @param start - the index to start looking at
 * @param step - the direction to look in, `1` for forward and `-1` for back
 * @param wrap - whether to continue at the other end, instead of giving up at
 * the end of the items. Every item is looked at once at most.
 * @param canMoveTo - tells whether the item at an index can be moved to
 * @returns the index of the first item that can be moved to, or
 * `NO_NAVIGATION_TARGET` when there is none
 */
function findReachable(
    count: number,
    start: number,
    step: 1 | -1,
    wrap: boolean,
    canMoveTo: (index: number) => boolean
): number {
    for (let distance = 0; distance < count; distance += 1) {
        const position = start + step * distance;
        if (!wrap && !isWithin(position, count)) {
            break;
        }

        const index = ((position % count) + count) % count;
        if (canMoveTo(index)) {
            return index;
        }
    }

    return NO_NAVIGATION_TARGET;
}
