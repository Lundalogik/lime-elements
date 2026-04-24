import React from 'react';
import { getDefaultRegistry } from '@rjsf/core';
import { FieldProps } from '@rjsf/utils';
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
        const { formData: oldData, schema, fieldPathId } = this.props;
        const { rootSchema } = this.props.registry;

        // RJSF v6's built-in ArrayField shares one onChange handler across all
        // descendants, so changes to leaves deep inside an array item bubble
        // through here with the leaf value (not the full array) and a path
        // that is deeper than this field's own path. In that case the
        // array-shape logic below does not apply and would crash on scalar
        // `newData`. The built-in handler also coerces `undefined` to `null`
        // for every child change, which breaks field clearing for custom
        // components; restore `undefined` when the leaf schema does not
        // include `'null'`, mirroring the ingress conversion in `schema-field`.
        if (fieldPathId && path.length > fieldPathId.path.length) {
            const leafSchema = getSchemaAtPath(
                schema as FormSchema,
                path.slice(fieldPathId.path.length)
            );
            const value =
                newData === null && !schemaAllowsNull(leafSchema)
                    ? undefined
                    : newData;
            this.props.onChange(value, path);

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
