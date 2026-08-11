import { ENTER } from '../../util/keycodes';
import type { ManualInputCommit } from './color-picker.types';

/**
 * Accessors into the component that owns the `manualInputCommit` behavior.
 * The pending value lives on the component (as state, so edits re-render),
 * while the commit semantics live here, shared between the picker and its
 * palette.
 */
interface ManualInputCommitHost {
    getMode(): ManualInputCommit;
    getValue(): string;
    getPendingValue(): string | null;
    setPendingValue(value: string | null): void;
    commit(value: string): void;
}

/**
 * Creates the input-field `change` and `keydown` handlers implementing the
 * `manualInputCommit` behavior: in `'change'` mode every change commits; in
 * `'enter'` mode typed input is held as the pending value and only commits
 * when the user presses Enter.
 *
 * @param host - accessors into the owning component
 * @returns the two handlers to wire onto the input field
 */
export const createManualInputCommitHandlers = (
    host: ManualInputCommitHost
) => ({
    handleChange: (event: CustomEvent<string>): void => {
        event.stopPropagation();

        if (host.getMode() === 'enter') {
            host.setPendingValue(event.detail);

            return;
        }

        host.commit(event.detail);
    },
    handleKeyDown: (event: KeyboardEvent): void => {
        if (host.getMode() !== 'enter' || event.key !== ENTER) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        // The input field debounces its change event, so the live DOM value
        // is preferred over the last received change; otherwise a fast typist
        // pressing Enter would commit a stale value.
        const value =
            getLiveInputValue(event) ??
            host.getPendingValue() ??
            host.getValue();
        host.setPendingValue(null);
        host.commit(value);
    },
});

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
const getLiveInputValue = (event: KeyboardEvent): string | null => {
    const target = event.composedPath?.()[0] as HTMLInputElement | undefined;
    if (target?.tagName === 'INPUT' && typeof target.value === 'string') {
        return target.value;
    }

    return null;
};
