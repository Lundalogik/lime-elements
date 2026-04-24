import React from 'react';
import { getDefaultRegistry } from '@rjsf/core';
import { FieldProps, FieldPathList } from '@rjsf/utils';
import { cloneDeep, isPlainObject, set } from 'lodash-es';
import { resetDependentFields, schemaAllowsNull } from './field-helpers';
import { ARRAY_REORDER_EVENT } from '../templates/array-field';
import { FormSchema } from '../form.types';

const { fields: defaultFields } = getDefaultRegistry();
const BaseArrayField = defaultFields.ArrayField;

/**
 * This override field exists to supplement the need to reset dependent fields
 * in SchemaField. The `resetDependentFields` function requires that the schema that
 * is passed to it be a raw schema with dependencies and all. However, when rendering list items
 * react jsonschema form calls `retrieveSchema` on the raw schema resulting in a schema for the current
 * data. This schema from `retrieveSchema` cannot be used to detect changes in a schema due to data changes
 * as the schema will not change when passed again into `retrieveSchema` with old and then new data.
 * So since the SchemaFields directly rendered by a list have a modified schema, they cannot properly reset
 * dependent fields by calling `resetDependentFields` due to the above limitations. To fix this, we do the
 * same resetting of dependent fields here in this component by detecting changed list items and calling
 * `resetDependentFields` on the changed list items. This is possible because the ArrayField is also given
 * the raw schema so it can properly call `resetDependentFields`
 *
 * This field also handles drag-and-drop reordering. The ArrayFieldTemplate
 * dispatches an `arrayReorder` DOM event when Sortable.js completes a drag.
 * This field listens for that event and reorders the form data via onChange.
 *
 * This form has to handle several events that can affect the list:
 *
 * 1. An on change where no list item changes
 * Solution: Ignore all changes and just pass the event through
 *
 * 2. An on change where one list item is changed
 * Solution: Call `resetDependentFields` with the old list item and the new list item as old and new data
 *
 * 3. An on change event where the size of the list of items has changed due to adding or removing a list item
 * Solution: Ignore all changes and just pass the event through
 *
 * 4. An on change event where list items are swapped or scrambled due to list items being swapped or sorted
 * Solution: Ignore all changes and just pass the event through
 */
export class ArrayField extends React.Component<FieldProps> {
    private wrapper?: HTMLDivElement;

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleReorder = this.handleReorder.bind(this);
        this.setWrapper = this.setWrapper.bind(this);
    }

    componentWillUnmount() {
        this.setWrapper(null);
    }

    private setWrapper(element: HTMLDivElement | null) {
        if (this.wrapper) {
            this.wrapper.removeEventListener(
                ARRAY_REORDER_EVENT,
                this.handleReorder
            );
        }

        this.wrapper = element ?? undefined;

        if (this.wrapper) {
            this.wrapper.addEventListener(
                ARRAY_REORDER_EVENT,
                this.handleReorder
            );
        }
    }

    private handleReorder(event: Event) {
        event.stopPropagation();
        const { fromIndex, toIndex } = (event as CustomEvent).detail;
        const { formData, fieldPathId } = this.props;

        if (!Array.isArray(formData) || !fieldPathId) {
            return;
        }

        const reordered = [...formData];
        const [item] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, item);

        this.props.onChange(reordered, fieldPathId.path);
    }

    private handleChange(newData, path) {
        const { formData: oldData, schema } = this.props;
        const { rootSchema } = this.props.registry;

        if (this.isDeepLeafChange(path)) {
            this.handleDeepLeafChange(newData, path);

            return;
        }

        // This case handles when the first list item is added. When there are no
        // items we get undefined instead of []
        if (!oldData) {
            this.props.onChange(newData, path);

            return;
        }

        // This case happens when we add or remove an item from the list
        // No need to check for resetting fields unless we change data
        if (oldData.length !== newData.length) {
            this.props.onChange(newData, path);

            return;
        }

        const nonMatchingIndices = [];

        // Find all items in the new data list that do not match
        // the old data
        for (const [i, oldDatum] of oldData.entries()) {
            if (newData[i] === oldDatum) {
                continue;
            }

            nonMatchingIndices.push(i);
        }

        // If we have one non matching index, then one item has been changed indicating that its data
        // has been changed so we check if it needs its dependent fields reset
        if (nonMatchingIndices.length === 1) {
            const i = nonMatchingIndices[0];
            newData[i] = resetDependentFields(
                oldData[i],
                newData[i],
                schema.items,
                rootSchema
            );
        }

        this.props.onChange(newData, path);
    }

    /**
     * RJSF v6's built-in ArrayField shares one onChange handler across all
     * descendants, so changes to leaves deep inside an array item bubble
     * through here with the leaf value (not the full array) and a path that
     * is deeper than this field's own path.
     * @param path
     */
    private isDeepLeafChange(path: FieldPathList): boolean {
        const { formData, fieldPathId } = this.props;

        return (
            Array.isArray(formData) &&
            !!fieldPathId &&
            path.length > fieldPathId.path.length
        );
    }

    /**
     * Rebuild the affected item locally so we can (a) restore `undefined`
     * when the leaf schema does not allow `null` — the built-in handler
     * coerces `undefined` to `null`, which breaks field clearing for custom
     * components — and (b) still run `resetDependentFields` at the item
     * level so sibling fields that became obsolete for the new data are
     * cleared.
     * @param newData
     * @param path
     */
    private handleDeepLeafChange(newData: unknown, path: FieldPathList): void {
        const { formData: oldData, fieldPathId } = this.props;

        const [indexSegment, ...pathInItem] = path.slice(
            fieldPathId.path.length
        );
        const index = Number(indexSegment);

        const newArray = [...oldData];
        newArray[index] = this.buildResetItem(newData, index, pathInItem);
        this.props.onChange(newArray, fieldPathId.path);
    }

    private buildResetItem(
        newData: unknown,
        index: number,
        pathInItem: Array<string | number>
    ): unknown {
        const { formData: oldData, schema } = this.props;
        const { rootSchema } = this.props.registry;

        const itemSchema = (
            Array.isArray(schema.items) ? schema.items[index] : schema.items
        ) as FormSchema;
        const leafSchema = getSchemaAtPath(itemSchema, pathInItem);
        const value =
            newData === null && !schemaAllowsNull(leafSchema)
                ? undefined
                : newData;

        const oldItem = oldData[index];
        const newItem = setValueAtPath(oldItem, pathInItem, value);

        return resetDependentFields(oldItem, newItem, itemSchema, rootSchema);
    }

    render() {
        const arrayProps = {
            ...this.props,
            onChange: this.handleChange,
        };

        return React.createElement(
            'div',
            { ref: this.setWrapper },
            React.createElement(BaseArrayField as any, arrayProps)
        );
    }
}

function getSchemaAtPath(
    schema: FormSchema,
    pathSegments: Array<string | number>
): FormSchema | undefined {
    let current: FormSchema | undefined = schema;
    for (const segment of pathSegments) {
        if (!current) {
            return;
        }

        current = resolveSchemaSegment(current, segment);
    }

    return current;
}

function resolveSchemaSegment(
    schema: FormSchema,
    segment: string | number
): FormSchema | undefined {
    if (typeof segment === 'number') {
        const items = schema.items;

        return Array.isArray(items) ? items[segment] : items;
    }

    return schema.properties?.[segment];
}

/**
 * Return a copy of `target` with `value` written at the location described
 * by `pathSegments`, creating intermediate containers as needed. Numeric
 * segments address arrays; string segments address object keys. `target`
 * is not mutated.
 *
 * @param target
 * @param pathSegments
 * @param value
 * @example
 * setValueAtPath({ a: { b: 1 } }, ['a', 'b'], 2); // → { a: { b: 2 } }
 * setValueAtPath([{ x: 1 }], [0, 'x'], 9);        // → [{ x: 9 }]
 */
function setValueAtPath(
    target: unknown,
    pathSegments: Array<string | number>,
    value: unknown
): unknown {
    if (pathSegments.length === 0) {
        return value;
    }

    const clone = cloneContainer(target, pathSegments[0]);
    set(clone, pathSegments, value);

    return clone;
}

function cloneContainer(
    target: unknown,
    firstSegment: string | number
): object {
    if (Array.isArray(target) || isPlainObject(target)) {
        return cloneDeep(target) as object;
    }

    if (typeof firstSegment === 'number') {
        return [];
    }

    return {};
}
