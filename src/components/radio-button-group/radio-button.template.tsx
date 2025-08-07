import { FunctionalComponent, h } from '@stencil/core';

/**
 * Radio Button Template
 *
 * This is a low-level template component that renders individual radio button elements
 * using Material Design Components (MDC) styling and structure. It's used internally
 * by the list component to render radio buttons when `type="radio"` is specified.
 *
 * ## Usage in the Library
 *
 * This template is primarily used by:
 * - `limel-list` component when `type="radio"`
 * - `limel-radio-button-group` component (which wraps `limel-list`)
 *
 * ## Why This Exists
 *
 * While we have `limel-radio-button-group` for most use cases, this template provides
 * the actual radio button HTML structure with proper MDC classes and accessibility
 * attributes. It ensures consistent styling and behavior across all radio button
 * implementations in the library.
 *
 * ## Design Philosophy
 *
 * This follows the principle that individual radio buttons should not be standalone
 * components, as a single radio button is never useful in a UI. Instead, this template
 * is used to build groups of radio buttons through higher-level components.
 *
 * @internal
 */
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
