import React, { useContext } from 'react';
import { ArrayFieldItemTemplateProps } from '@rjsf/utils';
import { isObjectType } from '../schema';
import { FormSchema } from '../form.types';
import { CollapsibleItemTemplate } from './array-field-collapsible-item';
import { SimpleItemTemplate } from './array-field-simple-item';
import { ArrayFieldContext, ArrayItemErrorsContext } from './array-context';

export const ArrayFieldItemTemplate = (props: ArrayFieldItemTemplateProps) => {
    const arrayContext = useContext(ArrayFieldContext);
    const itemErrors = useContext(ArrayItemErrorsContext);
    const schema = arrayContext?.arraySchema;
    const formData = arrayContext?.formData;
    const formContext = props.registry.formContext;
    const allowItemReorder = canItemReorder(props, schema);
    const allowItemRemoval = canRemoveItems(schema);

    if (schema && isObjectType(schema.items as FormSchema)) {
        const itemData = Array.isArray(formData)
            ? formData[props.index]
            : undefined;

        return React.createElement(
            CollapsibleItemTemplate,
            {
                key: props.itemKey,
                buttonsProps: props.buttonsProps,
                index: props.index,
                data: itemData,
                schema: schema,
                formSchema: formContext?.schema,
                allowItemRemoval: allowItemRemoval,
                allowItemReorder: allowItemReorder,
                errorSchema: itemErrors?.[props.index],
                revealErrors: formContext?.revealErrors === true,
            },
            props.children
        );
    }

    return React.createElement(
        SimpleItemTemplate,
        {
            key: props.itemKey,
            buttonsProps: props.buttonsProps,
            index: props.index,
            allowItemRemoval: allowItemRemoval,
            allowItemReorder: allowItemReorder,
        },
        props.children
    );
};

function canRemoveItems(schema: FormSchema | undefined): boolean {
    const limeOptions = schema?.lime || {};

    return limeOptions.allowItemRemoval !== false;
}

function canItemReorder(
    props: ArrayFieldItemTemplateProps,
    schema: FormSchema | undefined
): boolean {
    const limeOptions = schema?.lime || {};
    if (limeOptions.allowItemReorder === false) {
        return false;
    }

    const { buttonsProps } = props;

    return Boolean(buttonsProps?.hasMoveDown || buttonsProps?.hasMoveUp);
}
