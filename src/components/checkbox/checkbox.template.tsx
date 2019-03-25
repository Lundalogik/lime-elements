import { FunctionalComponent } from '@stencil/core';

interface CheckboxTemplateProps {
    disabled?: boolean;
    id: string;
    checked?: boolean;
    onChange?: (event: Event) => void;
    label?: string;
}

export const CheckboxTemplate: FunctionalComponent<
    CheckboxTemplateProps
> = props => {
    return (
        <div class="mdc-form-field ">
            <div
                class={`
                        mdc-checkbox
                        ${props.disabled ? 'mdc-checkbox--disabled' : ''}
                    `}
            >
                <input
                    type="checkbox"
                    class="mdc-checkbox__native-control"
                    id={props.id}
                    checked={props.checked}
                    disabled={props.disabled}
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
            </div>
            <label htmlFor={props.id}>{props.label}</label>
        </div>
    );
};
