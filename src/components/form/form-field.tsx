import { FunctionalComponent, h } from '@stencil/core';

type FormFieldProps = {
    name: string;
};

export const FormField: FunctionalComponent<FormFieldProps> = (
    props,
    children
) => (
    <div class="form-group field field-custom" slot={props.name}>
        {children}
    </div>
);
