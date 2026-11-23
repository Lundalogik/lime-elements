import { ENTER, SPACEBAR } from './keycodes';

/**
 * Clicks an element when Enter or Space is pressed on it, as a native button
 * would. For a component that acts as a button, but is not one.
 *
 * Key presses that come from something inside the element, such as a nested
 * input, are left alone.
 *
 * @param event - the `keydown` event, handled on the element
 * @param element - the element to click
 */
export function clickOnEnterOrSpace(
    event: KeyboardEvent,
    element: HTMLElement
) {
    if (event.target !== event.currentTarget) {
        return;
    }

    if (event.key !== ENTER && event.key !== SPACEBAR) {
        return;
    }

    event.preventDefault();
    element.click();
}
