import { ListItem, Option } from '@limetech/lime-elements';
import { FunctionalComponent, h } from '@stencil/core';
import { isMultiple } from '../../util/multiple';

interface SelectTemplateProps {
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    options: Option[];
    value: Option | Option[];
    label?: string;
    helperText?: string;
    multiple?: boolean;
    native: boolean;

    onNativeChange: (event: Event) => void;

    id: string;
    onMenuChange: (event: CustomEvent<ListItem | ListItem[]>) => void;
    onTriggerPress: (event: KeyboardEvent) => void;
    isOpen: boolean;
    open: () => void;
    close: () => void;
    checkValid: boolean;
}

export const SelectTemplate: FunctionalComponent<SelectTemplateProps> = (
    props
) => {
    let hasValue = !!props.value;
    if (isMultiple(props.value)) {
        hasValue = props.value.length > 0;
    } else if (hasValue) {
        hasValue = !!props.value.value;
    }

    let isValid = !props.invalid;
    if (props.checkValid && props.required && !hasValue) {
        isValid = false;
    }

    const classList = {
        'limel-select': true,
        'mdc-select': true,
        'mdc-menu-surface--anchor': true,
        'mdc-select--disabled': props.disabled,
        'limel-select--required': props.required,
        'limel-select--invalid': !isValid,
        'limel-select--empty': !hasValue,
        'limel-select--with-helper-text': typeof props.helperText === 'string',
    };

    return (
        <div class={classList}>
            <SelectValue {...props} hasValue={hasValue} />
            <HelperText text={props.helperText} />
            <SelectDropdown {...props} />
        </div>
    );
};

const SelectValue: FunctionalComponent<
    SelectTemplateProps & {
        hasValue: boolean;
    }
> = (props) => {
    const containerClassList = {
        'limel-select-trigger': true,
        'limel-select--focused': props.isOpen,
    };
    const labelClassList = {
        'mdc-floating-label': true,
        'mdc-floating-label--float-above': props.hasValue || props.isOpen,
        'mdc-floating-label--active': props.isOpen,
    };
    const lineClassList = {
        'mdc-line-ripple': true,
        'mdc-line-ripple--active': props.isOpen,
    };

    return (
        <div
            tabindex="0"
            onClick={props.open}
            class={containerClassList}
            onKeyPress={props.onTriggerPress}
        >
            <i class="mdc-select__dropdown-icon" />
            <div class="limel-select__selected-text">
                {getSelectedText(props.value)}
            </div>
            <span class={labelClassList}>{props.label}</span>
            <div class={lineClassList} />
        </div>
    );
};

const HelperText: FunctionalComponent<{ text: string }> = (props) => {
    if (typeof props.text !== 'string') {
        return;
    }

    return (
        <p
            class="mdc-select-helper-text mdc-select-helper-text--persistent"
            aria-hidden="true"
        >
            {props.text.trim()}
        </p>
    );
};

const SelectDropdown: FunctionalComponent<SelectTemplateProps> = (props) => {
    if (props.native) {
        return <NativeDropdown {...props} />;
    }

    return <MenuDropdown {...props} />;
};

const MenuDropdown: FunctionalComponent<SelectTemplateProps> = (props) => {
    const items = createMenuItems(props.options, props.value);

    return (
        <limel-portal
            containerId={props.id}
            visible={props.isOpen}
            inheritParentWidth={true}
        >
            <limel-menu-surface
                open={props.isOpen}
                onDismiss={props.close}
                style={{ '--menu-surface-width': '100%' }}
            >
                <limel-list
                    items={items}
                    type={props.multiple ? 'checkbox' : 'selectable'}
                    onChange={props.onMenuChange}
                />
            </limel-menu-surface>
        </limel-portal>
    );
};

const NativeDropdown: FunctionalComponent<SelectTemplateProps> = (props) => {
    return (
        <select
            required={props.required}
            aria-required={props.required}
            onChange={props.onNativeChange}
            onFocus={props.open}
            onBlur={props.close}
            class="limel-select__native-control"
            disabled={props.disabled}
            multiple={props.multiple}
        >
            {props.options.map((option) => {
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
    );
};

function isSelected(option: Option, value: Option | Option[]): boolean {
    if (!value) {
        return false;
    }

    if (isMultiple(value)) {
        return value.some((o) => option.value === o.value);
    }

    return option.value === value.value;
}

function createMenuItems(
    options: Option[],
    value: Option | Option[]
): Array<ListItem<Option>> {
    return options.map((option) => {
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
        return value.map((option) => option.text).join(', ');
    }

    return value.text;
}
