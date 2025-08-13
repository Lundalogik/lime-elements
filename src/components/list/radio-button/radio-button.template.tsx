import { FunctionalComponent, h } from '@stencil/core';

interface RadioButtonTemplateProps {
    disabled?: boolean;
    id: string;
    checked?: boolean;
    onChange?: (event: Event) => void;
    label?: string;
}

export const RadioButtonTemplate: FunctionalComponent<
    RadioButtonTemplateProps
> = (props) => {
    return (
        <div
            class={{
                'boolean-input': true,
                'radio-button': true,
                checked: props.checked,
                disabled: props.disabled,
            }}
        >
            <input
                type="radio"
                id={props.id}
                checked={props.checked}
                disabled={props.disabled}
                onChange={props.onChange}
            />
            <div class="box" />
            <label class="boolean-input-label" htmlFor={props.id}>
                {props.label}
            </label>
        </div>
    );
};
