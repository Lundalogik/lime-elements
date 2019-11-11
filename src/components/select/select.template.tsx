import { ListItem, Option } from '@limetech/lime-elements';
import { FunctionalComponent, h } from '@stencil/core';
import { isMultiple } from '../../util/multiple';

interface SelectTemplateProps {
    disabled?: boolean;
    required?: boolean;
    options: Option[];
    value: Option | Option[];
    label?: string;
    multiple?: boolean;
}

interface NativeSelectTemplateProps extends SelectTemplateProps {
    onChange?: (event: Event) => void;
}

export const NativeSelectTemplate: FunctionalComponent<NativeSelectTemplateProps> = props => {
    let hasValue = !!props.value;
    if (isMultiple(props.value)) {
        hasValue = props.value.length > 0;
    } else if (hasValue) {
        hasValue = !!props.value.value;
    }

    return (
        <div
            class={`
                mdc-select
                ${props.disabled ? 'mdc-select--disabled' : ''}
            `}
        >
            <i class="mdc-select__dropdown-icon" />
            <div class="limel-select__selected-text">
                {getSelectedText(props.value)}
            </div>
            <select
                required={props.required}
                aria-required={props.required}
                onChange={props.onChange}
                class="mdc-select__native-control"
                disabled={props.disabled}
                multiple={props.multiple}
            >
                {props.options.map(option => {
                    return (
                        <option
                            key={option.value}
                            value={option.value}
                            selected={isSelected(option, props.value)}
                            disabled={option.disabled}
                        >
                            {option.text}
                        </option>
                    );
                })}
            </select>
            <label
                class={`
                    mdc-floating-label
                    ${hasValue ? 'mdc-floating-label--float-above' : ''}
                `}
            >
                {props.label}
            </label>
            <div class="mdc-line-ripple" />
        </div>
    );
};

interface MenuSelectTemplateProps extends SelectTemplateProps {
    id: string;
    onChange?: (event: CustomEvent<ListItem | ListItem[]>) => void;
    onTriggerPress: (event: KeyboardEvent) => void;
    isOpen: boolean;
    open: () => void;
    close: () => void;
    checkValid: boolean;
}

export const MenuSelectTemplate: FunctionalComponent<MenuSelectTemplateProps> = props => {
    const items = createMenuItems(props.options, props.value);
    let hasValue = !!props.value;
    if (isMultiple(props.value)) {
        hasValue = props.value.length > 0;
    } else if (hasValue) {
        hasValue = !!props.value.value;
    }

    let isValid = true;
    if (props.checkValid && props.required && !hasValue) {
        isValid = false;
    }

    return (
        <div
            class={`
            limel-select
            mdc-menu-surface--anchor
            ${props.disabled ? 'mdc-select--disabled' : ''}
            ${props.required ? 'limel-select--required' : ''}
            ${!isValid ? 'limel-select--invalid' : ''}
            ${!hasValue ? 'limel-select--empty' : ''}
        `}
        >
            <div
                tabindex="0"
                onClick={props.open}
                class={`
                    limel-select-trigger
                    ${props.isOpen ? 'mdc-select--focused' : ''}
                `}
                onKeyPress={props.onTriggerPress}
            >
                <i class="mdc-select__dropdown-icon" />
                <div class="limel-select__selected-text">
                    {getSelectedText(props.value)}
                </div>
                <span
                    class={`
                    mdc-floating-label
                    ${
                        hasValue || props.isOpen
                            ? 'mdc-floating-label--float-above'
                            : ''
                    }
                    ${props.isOpen ? 'mdc-floating-label--active' : ''}
                `}
                >
                    {props.label}
                </span>
                <div
                    class={`
                    mdc-line-ripple
                    ${props.isOpen ? 'mdc-line-ripple--active' : ''}
                `}
                />
            </div>
            <limel-portal containerId={props.id} visible={props.isOpen}>
                <limel-menu-surface open={props.isOpen} onDismiss={props.close}>
                    <limel-list
                        items={items}
                        type={props.multiple ? 'checkbox' : 'selectable'}
                        onChange={props.onChange}
                    />
                </limel-menu-surface>
            </limel-portal>
        </div>
    );
};

function isSelected(option: Option, value: Option | Option[]): boolean {
    if (!value) {
        return false;
    }

    if (isMultiple(value)) {
        return value.some(o => option.value === o.value);
    }

    return option.value === value.value;
}

function createMenuItems(
    options: Option[],
    value: Option | Option[]
): Array<ListItem<Option>> {
    return options.map(option => {
        const selected = isSelected(option, value);
        const { text, disabled } = option;

        return {
            text: text,
            selected: selected,
            disabled: disabled,
            value: option,
        };
    });
}

function getSelectedText(value: Option | Option[]): string {
    if (!value) {
        return '';
    }

    if (isMultiple(value)) {
        return value.map(option => option.text).join(', ');
    }

    return value.text;
}
