/**
 * Reports the error message of a field that holds input it can't turn
 * into a value, or `null` when it no longer does.
 */
export type InvalidInputReporter = (message: string | null) => void;

/**
 * Listens for `invalidInput` from the element or from inside it, such as
 * a `limel-date-picker` in a custom component's shadow root.
 * @param element - the field's element
 * @param report - called with each message
 * @returns a function that stops listening
 */
export function listenForInvalidInput(
    element: HTMLElement,
    report: InvalidInputReporter
): () => void {
    const listener = (event: CustomEvent<string | null>) => {
        report(event.detail);
    };

    element.addEventListener('invalidInput', listener);

    return () => element.removeEventListener('invalidInput', listener);
}
