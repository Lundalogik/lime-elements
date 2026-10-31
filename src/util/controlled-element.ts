/**
 * Says that `owner` controls the element with the given id, for example the
 * list that a field opens. An id only finds elements in the same DOM tree, so
 * where the browser allows it, the element itself is referenced instead.
 *
 * @param owner - The element that controls the other one.
 * @param id - The id of the controlled element, which may not exist yet.
 * `null` says that nothing is controlled.
 */
export const setControlledElement = (
    owner: HTMLElement,
    id: string | null
): void => {
    if ('ariaControlsElements' in owner) {
        // eslint-disable-next-line unicorn/prefer-query-selector
        const controlled = id ? document.getElementById(id) : null;
        owner.ariaControlsElements = controlled ? [controlled] : null;

        return;
    }

    if (id) {
        owner.setAttribute('aria-controls', id);

        return;
    }

    owner.removeAttribute('aria-controls');
};
