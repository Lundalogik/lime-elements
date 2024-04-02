import { FunctionalComponent, h } from '@stencil/core';
import { Label } from '../dynamic-label/label.types';
import { Icon } from '../../interface';

interface CheckboxTemplateProps {
    disabled?: boolean;
    id: string;
    checked?: boolean;
    readonly?: boolean;
    indeterminate?: boolean;
    required?: boolean;
    invalid?: boolean;
    onChange?: (event: Event) => void;
    label?: string;
    helperText?: string;
    helperTextId?: string;
    readonlyLabels?: Array<Label<boolean>>;
}

export const CheckboxTemplate: FunctionalComponent<CheckboxTemplateProps> = (
    props,
) => {
    const inputProps = {};
    if (props.readonly) {
        let icon: string | Icon = 'minus';
        if (props.checked) {
            icon = {
                name: 'ok',
                color: 'var(--mdc-theme-primary)',
            };
        }

        return [
            <limel-dynamic-label
                value={props.checked}
                aria-controls={props.helperTextId}
                defaultLabel={{ text: props.label, icon: icon }}
                labels={props.readonlyLabels}
            />,
            <HelperText
                text={props.helperText}
                helperTextId={props.helperTextId}
                invalid={props.invalid}
            />,
        ];
    }

    if (props.indeterminate) {
        inputProps['data-indeterminate'] = 'true';
    }

    return [
        <div class="mdc-form-field ">
            <div
                class={{
                    'mdc-checkbox': true,
                    'mdc-checkbox--invalid': props.invalid,
                    'mdc-checkbox--disabled': props.disabled,
                    'mdc-checkbox--required': props.required,
                    'mdc-checkbox--indeterminate': props.indeterminate,
                    'lime-checkbox--readonly': props.readonly,
                }}
            >
                <input
                    type="checkbox"
                    class="mdc-checkbox__native-control"
                    id={props.id}
                    checked={props.checked}
                    disabled={props.disabled || props.readonly}
                    required={props.required}
                    onChange={props.onChange}
                    aria-controls={props.helperTextId}
                    aria-describedby={props.helperTextId}
                    {...inputProps}
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
            <label
                class={{
                    'mdc-checkbox--invalid': props.invalid,
                    'mdc-checkbox--disabled': props.disabled,
                    'mdc-checkbox--required': props.required,
                    'mdc-checkbox--indeterminate': props.indeterminate,
                    'lime-checkbox--readonly': props.readonly,
                }}
                htmlFor={props.id}
            >
                {props.label}
            </label>
        </div>,
        <HelperText
            text={props.helperText}
            helperTextId={props.helperTextId}
            invalid={props.invalid}
        />,
    ];
};

const HelperText: FunctionalComponent<{
    helperTextId: string;
    text: string;
    invalid?: boolean;
}> = (props) => {
    if (typeof props.text !== 'string') {
        return;
    }

    return (
        <limel-helper-line
            helperText={props.text.trim()}
            helperTextId={props.helperTextId}
            invalid={props.invalid}
        />
    );
};
