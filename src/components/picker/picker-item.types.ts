import { ListItem } from '../list-item/list-item.types';
import { PickerValue } from './value.types';

/**
 * An item that can be picked by `limel-picker`.
 *
 * Extends `ListItem` with picker-specific flags that only make sense
 * once the item has been selected and rendered as a chip.
 *
 * @public
 */
export interface PickerItem<T = PickerValue> extends ListItem<T> {
    /**
     * Whether the item should be removable once it has been picked
     * and rendered as a chip. Most useful when `multiple={true}`,
     * but also locks the single chip when `multiple={false}`.
     *
     * Picked items are removable by default. Set this to `false` to
     * "lock" an individual item so that the user cannot remove it —
     * neither via the remove button, nor with Backspace/Delete, nor
     * by the "Clear all" button. Locked items remain fully interactive
     * (clicks still emit `interact` events).
     *
     * If the entire picker is `disabled` or `readonly`, the remove
     * button is hidden on all chips regardless of this flag.
     */
    removable?: boolean;

    /**
     * Optional badge to display on the chip when the item is picked.
     * Useful for marking selected items with a status indicator
     * (e.g. "Inactive", "Beta", or a numeric counter).
     */
    badge?: number | string;
}
