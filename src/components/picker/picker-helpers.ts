import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from './picker-item.types';

/**
 * The id a picked item is matched by. An object value carries its own
 * `id`; a primitive value is its own id.
 *
 * @param item - the item to get an id for
 * @returns the value id, or `undefined` if the item has no value
 */
export function getValueId(item: PickerItem): string | number | undefined {
    const value = item.value;
    if (value === undefined || value === null) {
        return undefined;
    }

    if (typeof value === 'object') {
        return value.id;
    }

    return value;
}

/**
 * The id of the chip an item is rendered as. Chip ids are strings, so this
 * is where a value id becomes one — note that items sharing a value id, and
 * items having none, therefore share a chip id too.
 *
 * @param item - the item the chip stands for
 * @returns the chip id
 */
export function getChipId(item: PickerItem): string {
    return `${getValueId(item)}`;
}

/**
 * Whether anything in the list is pickable, as opposed to only
 * `ListSeparator` headers.
 *
 * @param items - the items to check
 * @returns `true` if at least one item is pickable
 */
export function hasPickableItems(
    items: Array<PickerItem | ListSeparator>
): boolean {
    return items.some((item) => !('separator' in item));
}
