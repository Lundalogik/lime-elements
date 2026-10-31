import { debounce } from 'lodash-es';

const LIVE_MESSAGE_DELAY = 500;

/**
 * Creates what a component needs to speak a message through a visually hidden
 * element with `aria-live`. The text is written straight into that element
 * and not through the state of the component, so speaking costs no render.
 * It is written a short while after the last update, so that a screen reader
 * does not read out every change while the user is typing.
 *
 * @param getMessage - Returns the text to speak. An empty text clears the
 * element, so that the same message is spoken again the next time.
 * @returns `setElement`, to be used as the `ref` of the live element, and
 * `update`, to be called when the message may have changed.
 */
export const createLiveMessage = (getMessage: () => string) => {
    let element: HTMLElement | undefined;

    const setElement = (liveElement?: HTMLElement) => {
        element = liveElement;
    };

    const update = debounce(() => {
        if (!element) {
            return;
        }

        const message = getMessage();
        if (element.textContent !== message) {
            element.textContent = message;
        }
    }, LIVE_MESSAGE_DELAY);

    return { setElement, update };
};
