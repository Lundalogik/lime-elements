import { getDeepActiveElement } from '../../util/get-deep-active-element';

/**
 * Whether the element that has the focus shows a focus indicator. That is the
 * case when the focus comes from the keyboard, and not when it comes from a
 * click with a pointer.
 *
 * @returns `true` when the focus is visible, or when that cannot be told
 */
export function hasVisibleFocus(): boolean {
    try {
        return getDeepActiveElement()?.matches(':focus-visible') ?? false;
    } catch {
        return true;
    }
}
