import { ListItem, Option } from '../../interface';
import { FunctionalComponent, h } from '@stencil/core';
import { isMultiple } from '../../util/multiple';

interface SelectTemplateProps {
    disabled?: boolean;
    readonly?: boolean;
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

    dropdownZIndex: string;
}

export const SelectTemplate: FunctionalComponent<SelectTemplateProps> = (
    props
) => {
    const value = props.value;
    let hasValue = !!props.value;
    let hasEmptyText = true;
    if (isMultiple(value)) {
        hasValue = value.length > 0;
    } else if (hasValue) {
        hasValue = !!value.value;
        hasEmptyText = value.text === '';
    }

    let isValid = !props.invalid;
    if (props.checkValid && props.required && !hasValue) {
        isValid = false;
    }

    const classList = {
        'limel-select': true,
        'mdc-select': true,
        'mdc-select--outlined': true,
        'mdc-select--disabled': props.disabled,
        'limel-select--readonly': props.readonly,
        'limel-select--required': props.required,
        'limel-select--invalid': !isValid,
        'limel-select--empty': !hasValue,
        'limel-select--with-helper-text': typeof props.helperText === 'string',
    };

    return (
        <div class={classList}>
            <SelectValue
                {...props}
                hasValue={hasValue}
                isValid={isValid}
                hasEmptyText={hasEmptyText}
            />
            <HelperText text={props.helperText} isValid={!props.invalid} />
            <SelectDropdown {...props} />
        </div>
    );
};

const SelectValue: FunctionalComponent<
    SelectTemplateProps & {
        hasValue: boolean;
        isValid: boolean;
        hasEmptyText: boolean;
    }
> = (props) => {
    const anchorClassList = {
        'mdc-select__anchor': true,
        'limel-select-trigger': true,
        'limel-select--focused': props.isOpen,
    };
    const labelClassList = {
        'mdc-floating-label': true,
        'mdc-floating-label--float-above':
            !props.hasEmptyText ||
            props.isOpen ||
            props.readonly ||
            props.hasValue,
        'mdc-floating-label--active': props.isOpen,
    };

    return (
        <button
            class={anchorClassList}
            onClick={props.open}
            onKeyPress={props.onTriggerPress}
            aria-haspopup="listbox"
            aria-expanded={props.isOpen}
            aria-controls={props.id}
            aria-labelledby="s-label s-selected-text"
            aria-required={props.required}
            disabled={props.disabled || props.readonly}
        >
            <span id="s-label" class={labelClassList}>
                {props.label}
            </span>
            <span class="mdc-select__selected-text-container limel-select__selected-option">
                {getSelectedIcon(props.value)}
                <span
                    id="s-selected-text"
                    class="mdc-select__selected-text limel-select__selected-option__text"
                >
                    {getSelectedText(props.value, props.readonly)}
                </span>
            </span>
            <ShowIcon {...props} isValid={props.isValid} />
            <span class="mdc-select__dropdown-icon">
                <svg
                    class="mdc-select__dropdown-icon-graphic"
                    viewBox="7 10 10 5"
                    focusable="false"
                >
                    <polygon
                        stroke="none"
                        fill-rule="evenodd"
                        points="7 10 12 15 17 10"
                    ></polygon>
                </svg>
            </span>
        </button>
    );
};

const ShowIcon: FunctionalComponent<
    SelectTemplateProps & {
        isValid: boolean;
    }
> = (props) => {
    if (props.isValid) {
        return;
    }

    return (
        <limel-icon name="high_importance" size="medium" class="invalid-icon" />
    );
};

const HelperText: FunctionalComponent<{ text: string; isValid: boolean }> = (
    props
) => {
    if (typeof props.text !== 'string') {
        return;
    }

    return (
        <limel-helper-line
            helperText={props.text.trim()}
            invalid={!props.isValid}
        />
    );
};

const SelectDropdown: FunctionalComponent<SelectTemplateProps> = (props) => {
    if (props.native) {
        return <NativeDropdown {...props} />;
    }

    return <MenuDropdown {...props} />;
};

const MenuDropdown: FunctionalComponent<SelectTemplateProps> = (props) => {
    const items = createMenuItems(props.options, props.value, props.required);

    return (
        <limel-portal
            containerId={props.id}
            visible={props.isOpen}
            inheritParentWidth={true}
            containerStyle={{ 'z-index': props.dropdownZIndex }}
        >
            <limel-menu-surface
                open={props.isOpen}
                onDismiss={props.close}
                style={{
                    '--mdc-menu-min-width': '100%',
                    'max-height': 'inherit',
                    display: 'flex',
                    'min-width': '100%',
                    width: 'fit-content',
                }}
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
            aria-disabled={props.disabled}
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
    value: Option | Option[],
    selectIsRequired = false
): Array<ListItem<Option>> {
    const menuOptionFilter = getMenuOptionFilter(selectIsRequired);

    return options.filter(menuOptionFilter).map((option) => {
        const selected = isSelected(option, value);
        const { text, disabled } = option;

        return {
            text: text,
            selected: selected,
            disabled: disabled,
            value: option,
            icon: option.icon,
            iconColor: option.iconColor,
        };
    });
}

function getMenuOptionFilter(selectIsRequired: boolean) {
    return (option: Option) => {
        if (!selectIsRequired) {
            // If the select component is NOT required, we keep all options.
            return true;
        }

        if (option.text) {
            // If the select component IS required, we keep only options
            // that are not "empty". We only check the text property, because
            // some systems use an "empty option" that will have a value for
            // the `value` property, to signify "no option selected". Such
            // an option should be treated as "empty".
            return true;
        }
    };
}

function getSelectedText(value: Option | Option[], readonly: boolean): string {
    if ((!value || (isMultiple(value) && !value.length)) && readonly) {
        return '–';
    }

    if (!value) {
        return '';
    }

    if (isMultiple(value)) {
        return value.map((option) => option.text).join(', ');
    }

    return value.text;
}

function getSelectedIcon(value: any) {
    if (!value || !value.icon) {
        return '';
    }

    const style: any = {};
    if (value.iconColor) {
        style.color = value.iconColor;
    }

    return (
        <limel-icon
            class="limel-select__selected-option__icon"
            name={value.icon}
            size="medium"
            style={style}
        />
    );
}
