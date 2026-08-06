/**
 * Reads the current value of the `<input>` element a keyboard event
 * originates from, crossing shadow DOM boundaries via the event's composed
 * path.
 *
 * The input field debounces its `change` event, so at the time a keydown is
 * handled, the last received change can lag behind what the user has
 * actually typed; the live DOM value does not.
 *
 * @param event - the keyboard event whose composed path is inspected
 * @returns the live input value, or `null` when the event did not originate
 * from an input element
 */
export const getLiveInputValue = (event: KeyboardEvent): string | null => {
    const target = event.composedPath?.()[0] as HTMLInputElement | undefined;
    if (target?.tagName === 'INPUT' && typeof target.value === 'string') {
        return target.value;
    }

    return null;
};
