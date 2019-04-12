import { FunctionalComponent } from '@stencil/core';

interface RadioButtonTemplateProps {
    disabled?: boolean;
    id: string;
    checked?: boolean;
    onChange?: (event: Event) => void;
    label?: string;
}

export const RadioButtonTemplate: FunctionalComponent<
    RadioButtonTemplateProps
> = props => {
    return (
        <div class="mdc-form-field">
            <div
                class={`
                        mdc-radio
                        ${props.disabled ? 'mdc-radio--disabled' : ''}
                    `}
            >
                <input
                    class="mdc-radio__native-control"
                    type="radio"
                    id={props.id}
                    checked={props.checked}
                    disabled={props.disabled}
                    onChange={props.onChange}
                />
                <div class="mdc-radio__background">
                    <div class="mdc-radio__outer-circle" />
                    <div class="mdc-radio__inner-circle" />
                </div>
            </div>
            <label
                class={`${props.disabled ? 'disabled' : ''}`}
                htmlFor={props.id}
            >
                {props.label}
            </label>
        </div>
    );
};
