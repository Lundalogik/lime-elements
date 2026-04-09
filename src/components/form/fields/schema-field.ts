import React from 'react';
import { getDefaultRegistry } from '@rjsf/core';
import { FieldProps, FieldPathList } from '@rjsf/utils';
import { isEmpty } from 'lodash-es';
import {
    hasValue,
    isFieldInvalid,
    isFieldRequired,
    getErrorText,
} from '../validation-display';
import { resetDependentFields } from './field-helpers';
import { FieldTemplate } from '../templates';
import { getHelpComponent } from '../help';
import { FormComponent, FormSchema } from '../form.types';
import { TimePicker } from '../widgets/time-picker';
import { RowLayoutContext } from '../row/row-context';

const { fields: defaultFields } = getDefaultRegistry();
const BaseSchemaField = defaultFields.SchemaField;

/**
 * If given a value and schema, check if the value should be translated
 * from null to undefined to avoid issues with validation
 *
 * This function needs to be used for several reasons:
 * 1. CustomEvent does not allow `detail` to equal `undefined`, but we can call onChange with `undefined` in React
 * 2. `null` is treated as a valid value in a jsonschema and with marshmallow and it has its own type (null)
 * 3. Without changing `null` to `undefined` there would be no way to remove a field from
 * from the submitted form data once it had any data. (when POSTing, undefined is not posted since its not valid json)
 * 4. The only applies to custom web components since widgets handle transforming null/'' to undefined depending on the widget
 * and its purpose.
 *
 * Example:
 * If I have an object `{ name?: string, email?: string }` that I am using a custom web component for `name`,
 * then initially, the formData will be `{}` which is fine because neither name or email are required. Then if i input a
 * value for name the formData will be `{ name: 'some_value' }` which is also fine. But then if I want to remove name
 * from the form data I would delete all the text from the name input field. Web components would emit this empty value
 * as '' or null. If the web component tries to emit `undefined`, null would be emitted instead because CustomEvent has
 * a default `detail` value of null
 *
 * @param value - the value associated with the schema
 * @param schema - the schema for the value
 * @returns whether or not null should be changed to undefined
 */
const shouldChangeToUndefined = (value, schema): boolean => {
    return value === null && !schema.type.includes('null');
};

const hasCustomComponent = (schema): boolean => {
    const name = schema.lime?.component?.name;
    if (!name) {
        return false;
    }

    try {
        verifyCustomComponentIsDefined(name);
    } catch {
        console.warn(`Custom component ${name} not defined`);

        return false;
    }

    return true;
};

const verifyCustomComponentIsDefined = (elementName): void => {
    if (!customElements.get(elementName)) {
        throw new Error(`Custom form element '${elementName}' is not defined!`);
    }
};

const getCustomComponent = (
    schema
): { name: string; props: { [key: string]: any } } => {
    const name = schema.lime?.component?.name;
    const props = schema.lime?.component?.props || {};

    return { name: name, props: props };
};

/**
 * Create properties from the factory that is set on `limel-form`
 *
 * @param formContext - the form context
 * @param schema - the schema for the current field
 * @returns the properties created by the factory
 */
export function getFactoryProps(
    formContext: any,
    schema: FormSchema
): Record<string, any> {
    const factory: (schema: FormSchema) => Record<string, any> =
        formContext.propsFactory;
    if (typeof factory !== 'function') {
        return {};
    }

    const props = factory(schema);
    if (!props) {
        return {};
    }

    return props;
}

export class SchemaField extends React.Component<FieldProps> {
    public static readonly contextType = RowLayoutContext;
    declare context: React.ContextType<typeof RowLayoutContext>;

    state = {
        modified: false,
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCustomComponentChange =
            this.handleCustomComponentChange.bind(this);
    }

    private isInvalid() {
        const { modified } = this.state;
        const { errorSchema, required, schema } = this.props;

        return isFieldInvalid({
            hasErrors: !isEmpty(errorSchema),
            modified: modified,
            hasValue: hasValue(this.props.formData),
            required: isFieldRequired({ required, minItems: schema.minItems }),
        });
    }

    private getHelperText() {
        const { errorSchema, schema } = this.props;
        const hasErrors = !isEmpty(errorSchema) && '__errors' in errorSchema;
        const errors =
            this.isInvalid() && hasErrors ? errorSchema.__errors : [];
        const fallbackText = schema.lime?.component?.props?.helperText;

        return getErrorText(errors, schema.description, fallbackText);
    }

    private handleCustomComponentChange(
        event: React.SyntheticEvent<Element, CustomEvent>
    ) {
        const { schema } = this.props;
        event.stopPropagation();

        let value = event.nativeEvent.detail;

        if (shouldChangeToUndefined(value, schema)) {
            value = undefined;
        }

        this.handleChange(value, this.props.fieldPathId.path);
    }

    private handleChange(data: unknown, path: FieldPathList) {
        const { formData, schema } = this.props;
        const { rootSchema } = this.props.registry;

        this.setState({ modified: true });

        const newData = resetDependentFields(
            formData,
            data,
            schema,
            rootSchema
        );

        this.props.onChange(newData, path);
    }

    private buildCustomComponentProps() {
        const {
            disabled,
            readonly,
            name,
            registry,
            schema: rawSchema,
            errorSchema,
            fieldPathId,
        } = this.props;
        const schema = rawSchema as FormSchema;
        const factoryProps = getFactoryProps(registry.formContext, schema);

        return {
            ...factoryProps,
            value: this.props.formData,
            required: isFieldRequired({
                required: this.props.required,
                minItems: schema.minItems,
            }),
            readonly: readonly || schema.readOnly,
            disabled: disabled,
            invalid: this.isInvalid(),
            label: this.context ? '' : schema.title,
            helperText:
                this.context && !this.isInvalid() ? '' : this.getHelperText(),
            ref: (element: FormComponent) => {
                element.formInfo = {
                    schema: schema,
                    rootSchema: registry.formContext.schema,
                    errorSchema: errorSchema,
                    rootValue: registry.formContext.rootValue,
                    name: name,
                    schemaPath: fieldPathId?.path?.map(String),
                };

                return () => {};
            },
        };
    }

    private renderCustomComponent(props: FieldProps) {
        const schema = props.schema as FormSchema;
        const { name, props: userDefinedComponentProps } =
            getCustomComponent(schema);

        verifyCustomComponentIsDefined(name);

        const component = React.createElement(name, {
            ...userDefinedComponentProps,
            ...this.buildCustomComponentProps(),
            onChange: this.handleCustomComponentChange,
        });

        return React.createElement(
            FieldTemplate,
            {
                ...this.props,
                classNames: 'rjsf-field rjsf-field-custom',
            },
            component,
            getHelpComponent(schema)
        );
    }

    render() {
        if (this.props.schema.lime?.hidden) {
            return null;
        }

        if (hasCustomComponent(this.props.schema)) {
            return this.renderCustomComponent(this.props);
        }

        const fieldProps = {
            ...this.props,
            onChange: this.handleChange,
        };

        if (this.props.schema.format === 'time') {
            fieldProps.uiSchema = {
                'ui:widget': TimePicker,
                ...fieldProps.uiSchema,
            };
        }

        return React.createElement(BaseSchemaField, fieldProps);
    }
}
