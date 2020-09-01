import JSONArrayField from 'react-jsonschema-form/lib/components/fields/ArrayField';
import React from 'react';
import { ArrayProps } from './types';
import { resetDependentFields } from './field-helpers';

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
export class ArrayField extends React.Component<ArrayProps> {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange(newData, errorSchema) {
        const { formData: oldData, schema } = this.props;
        const { definitions } = this.props.registry;

        // This case handles when the first list item is added. When there are no
        // items we get undefined instead of []
        if (!oldData) {
            this.props.onChange(newData, errorSchema);

            return;
        }

        // This case happens when we add or remove an item from the list
        // No need to check for resetting fields unless we change data
        if (oldData.length !== newData.length) {
            this.props.onChange(newData, errorSchema);

            return;
        }

        const nonMatchingIndices = [];

        // Find all items in the new data list that do not match
        // the old data
        for (let i = 0; i < oldData.length; i++) {
            if (newData[i] === oldData[i]) {
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
                definitions
            );
        }

        this.props.onChange(newData, errorSchema);
    }

    render() {
        const arrayProps = {
            ...this.props,
            onChange: this.handleChange,
        };

        return React.createElement(JSONArrayField, arrayProps);
    }
}
