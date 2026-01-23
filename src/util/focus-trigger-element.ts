const FOCUSABLE_SELECTOR =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const isDisabled = (element: HTMLElement): boolean => {
    return (
        (element as any).disabled === true ||
        element.hasAttribute('disabled') ||
        element.getAttribute('aria-disabled') === 'true'
    );
};

/**
 * Focuses the first focusable element inside a trigger element.
 * Supports custom elements by searching both the element's shadow root
 * and its light DOM.
 *
 * @param trigger - The trigger element to focus.
 * @returns `true` if focus was moved, otherwise `false`.
 */
export const focusTriggerElement = (trigger?: HTMLElement | null): boolean => {
    if (!trigger || isDisabled(trigger)) {
        return false;
    }

    const shadowFocusable =
        trigger.shadowRoot?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    if (shadowFocusable) {
        shadowFocusable.focus();
        return true;
    }

    const lightDomFocusable =
        trigger.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    if (lightDomFocusable) {
        lightDomFocusable.focus();
        return true;
    }

    trigger.focus();
    return true;
};
