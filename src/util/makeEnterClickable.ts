import { forceUpdate } from '@stencil/core';

const eventHandlers: WeakMap<HTMLElement, CallBacks> = new WeakMap();

/**
 * Overrides the default browser behavior for clickable elements
 * When focused and pressing down enter, avoids calling onClick repeatedly
 * @param {HTMLElement} element the clickable element
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function makeEnterClickable(element: HTMLElement) {
    if (eventHandlers.has(element)) {
        return;
    }

    let isActive = false;
    let hasJustReleasedEnter = true;

    const keydownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !isActive) {
            isActive = true;

            if (element?.shadowRoot) {
                forceUpdate(element);
            }
        }
    };

    const keyupHandler = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && isActive) {
            isActive = false;
            hasJustReleasedEnter = true;

            if (element?.shadowRoot) {
                forceUpdate(element);
            }
        }
    };

    const clickHandler = (event: MouseEvent) => {
        if (!isActive) {
            return;
        }

        if (hasJustReleasedEnter) {
            hasJustReleasedEnter = false;

            return;
        }

        event.stopImmediatePropagation();
    };

    eventHandlers.set(element, {
        keydownHandler: keydownHandler,
        keyupHandler: keyupHandler,
        clickHandler: clickHandler,
    });

    element.addEventListener('keydown', keydownHandler);
    element.addEventListener('keyup', keyupHandler);
    element.addEventListener('click', clickHandler, true);
}

export function removeEnterClickable(element: HTMLElement) {
    const callBacks: CallBacks = eventHandlers.get(element);

    if (!callBacks || !eventHandlers.has(element)) {
        return;
    }

    element.removeEventListener('keydown', callBacks.keydownHandler);
    element.removeEventListener('keyup', callBacks.keyupHandler);
    element.removeEventListener('click', callBacks.clickHandler, true);

    eventHandlers.delete(element);
}

interface CallBacks {
    keydownHandler: (arg: KeyboardEvent) => void;
    keyupHandler: (arg: KeyboardEvent) => void;
    clickHandler: (arg: MouseEvent) => void;
}
