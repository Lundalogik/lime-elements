import { Component, h, Prop } from '@stencil/core';
import { isDate, isObject, isArray, isUndefined } from 'lodash-es';

/**
 * The `limel-example-value` component is a utility component
 * used internally in the Lime Elements documentation to display
 * property values and component states in a formatted way.
 *
 * ## Purpose
 * This component helps visualize different types of values in
 * our component examples and documentation.
 * It's particularly useful for:
 * - Displaying primitive values
 * - Formatting dates
 * - Pretty-printing objects and arrays
 * - Showing undefined values
 *
 * ## Usage
 * ```tsx
 * <limel-example-value label="Selected item" value={this.selectedItem} />
 * ```
 *
 * Display Formatting
 * The component automatically formats different value types:
 * - `undefined` values are displayed as `undefined`
 * - `Date` objects are converted to strings using `toString()`
 * - Objects and arrays are pretty-printed using `JSON.stringify` with indentation
 * - Primitive values are displayed within `<code>` tags.
 *
 * @private
 */
@Component({
    tag: 'limel-example-value',
    shadow: true,
    styleUrl: 'example-value.scss',
})
export class ExampleValue {
    /**
     * A label describing the value.
     */
    @Prop({ reflect: true })
    public label? = 'Value';

    /**
     * The value that should be displayed.
     */
    @Prop()
    public value: any;

    public render() {
        return (
            <div>
                {this.label}: {this.format(this.value)}
            </div>
        );
    }

    private format(val: any) {
        if (isUndefined(val)) {
            return <code>undefined</code>;
        }

        if (isDate(val)) {
            return <code>{val.toString()}</code>;
        }

        if (isObject(val) || isArray(val)) {
            return (
                <pre>
                    <code>{JSON.stringify(val, null, 2)}</code>
                </pre>
            );
        }

        return <code>{JSON.stringify(val, null, 2)}</code>;
    }
}
