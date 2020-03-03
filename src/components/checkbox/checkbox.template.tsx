import { FunctionalComponent, h } from '@stencil/core';

interface CheckboxTemplateProps {
    disabled?: boolean;
    id: string;
    checked?: boolean;
    required?: boolean;
    invalid?: boolean;
    onChange?: (event: Event) => void;
    label?: string;
}

export const CheckboxTemplate: FunctionalComponent<CheckboxTemplateProps> = props => {
    return (
        <div class="mdc-form-field ">
            <div
                class={{
                    'mdc-checkbox': true,
                    'mdc-checkbox--invalid': props.invalid,
                    'mdc-checkbox--disabled': props.disabled,
                    'mdc-checkbox--required': props.required,
                }}
            >
                <input
                    type="checkbox"
                    class="mdc-checkbox__native-control"
                    id={props.id}
                    checked={props.checked}
                    disabled={props.disabled}
                    required={props.required}
                    onChange={props.onChange}
                />
                <div class="mdc-checkbox__background">
                    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                        <path
                            class="mdc-checkbox__checkmark-path"
                            fill="none"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"
                        />
                    </svg>
                    <div class="mdc-checkbox__mixedmark" />
                </div>
                <div class="mdc-checkbox__ripple" />
            </div>
            <label
                class={{
                    'mdc-checkbox--invalid': props.invalid,
                    'mdc-checkbox--disabled': props.disabled,
                    'mdc-checkbox--required': props.required,
                }}
                htmlFor={props.id}
            >
                {props.label}
            </label>
        </div>
    );
};
