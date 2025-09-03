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
    props
) => {
    const inputProps = {};
    if (props.readonly) {
        let icon: string | Icon = 'minus';
        if (props.checked) {
            icon = {
                name: 'ok',
                color: 'var(--lime-primary-color, var(--limel-theme-primary-color))',
            };
        }

        return [
            <limel-dynamic-label
                value={props.checked}
                aria-controls={
                    props.helperText ? props.helperTextId : undefined
                }
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
        inputProps['aria-checked'] = 'mixed';
    } else {
        inputProps['data-indeterminate'] = 'false';
        if (typeof props.checked === 'boolean') {
            inputProps['aria-checked'] = String(props.checked);
        }
    }

    return [
        <div
            class={{
                'boolean-input': true,
                checkbox: true,
                checked: props.checked,
                invalid: props.invalid,
                disabled: props.disabled,
                required: props.required,
                indeterminate: props.indeterminate,
                readonly: props.readonly,
            }}
        >
            <input
                type="checkbox"
                id={props.id}
                checked={props.checked}
                disabled={props.disabled || props.readonly}
                required={props.required}
                onChange={props.onChange}
                aria-controls={
                    props.helperText ? props.helperTextId : undefined
                }
                aria-describedby={props.helperTextId}
                {...inputProps}
            />
            <div class="box">
                <svg
                    class="check-mark"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                </svg>
            </div>
            <label class="boolean-input-label" htmlFor={props.id}>
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
