import { Icon } from '../../interface';

/**
 * - `trueLabel` - The label to show, when the component is `readonly` and its `value` is `true`.
 * If not set, the `label` property will be used.
 * - `falseLabel` - The label to show, when the component is `readonly` and its `value` is `false`.
 * If not set, the `label` property will be used.
 * - `trueIcon` - The icon to show, when the component is `readonly` and its `value` is `true`.
 * - `falseIcon` - The icon to show, when the component is `readonly` and its `value` is `false`.
 */
export interface ReadonlyProps {
    trueLabel?: string;
    falseLabel?: string;
    trueIcon?: string | Icon;
    falseIcon?: string | Icon;
}
