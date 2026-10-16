import { findFocusTarget } from './get-focus-target';

const isDisabled = (element: HTMLElement): boolean => {
    return (
        (element as any).disabled === true ||
        element.hasAttribute('disabled') ||
        element.getAttribute('aria-disabled') === 'true'
    );
};

/**
 * Focuses a trigger element, or the first focusable element inside it if the
 * trigger can not take focus itself. Supports custom elements by searching
 * both the element's shadow root and its light DOM.
 *
 * @param trigger - The trigger element to focus.
 * @returns `false` if there is no trigger, or it is disabled. Otherwise `true`.
 */
export const focusTriggerElement = (trigger?: HTMLElement | null): boolean => {
    if (!trigger || isDisabled(trigger)) {
        return false;
    }

    findFocusTarget(trigger).focus();

    return true;
};
