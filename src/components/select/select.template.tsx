import { ListItem, ListSeparator } from '../list/list-item.types';
import { Option } from '../select/option.types';
import { FunctionalComponent, h } from '@stencil/core';
import { isMultiple } from '../../util/multiple';
import { getIconColor, getIconName } from '../icon/get-icon-props';
interface SelectTemplateProps {
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    invalid?: boolean;
    options: Array<Option | ListSeparator>;
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
    props,
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
        'mdc-select--disabled': props.disabled,
        'limel-select--readonly': props.readonly,
        'limel-select--invalid': !isValid,
        'limel-select--with-helper-text': typeof props.helperText === 'string',
    };

    return [
        <limel-notched-outline
            class={classList}
            labelId="s-label"
            label={props.label}
            required={props.required}
            invalid={!isValid}
            disabled={props.disabled}
            readonly={props.readonly}
            hasValue={hasValue}
            hasFloatingLabel={floatLabelAbove(props)}
        >
            <SelectValue
                {...props}
                hasValue={hasValue}
                isValid={isValid}
                hasEmptyText={hasEmptyText}
            />
        </limel-notched-outline>,
        <HelperText text={props.helperText} isValid={!props.invalid} />,
        <SelectDropdown {...props} />,
    ];
};

const floatLabelAbove = (props: SelectTemplateProps) => {
    if (props.isOpen) {
        return true;
    }

    const value = props.value;
    if (value) {
        if (isMultiple(value)) {
            return value.length > 0;
        } else {
            return value.text !== '';
        }
    }

    return false;
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

    return (
        <button
            slot="content"
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
            <span class="mdc-select__selected-text-container limel-select__selected-option">
                {getSelectedIcon(props.value)}
                <span
                    id="s-selected-text"
                    class="mdc-select__selected-text limel-select__selected-option__text"
                >
                    {getSelectedText(props.value)}
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
    props,
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
                    '--menu-surface-width': '100%',
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
    const options = props.options
        .filter((option): option is Option => !('separator' in option))
        .map(renderOption(props.value));

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
            {options}
        </select>
    );
};

const renderOption = (selectedOption: Option | Option[]) => {
    return (option: Option) => {
        const { value, disabled, text } = option;

        return (
            <option
                key={value}
                value={value}
                selected={isSelected(option, selectedOption)}
                disabled={disabled}
            >
                {text}
            </option>
        );
    };
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
    options: Array<Option | ListSeparator>,
    value: Option | Option[],
    selectIsRequired = false,
): Array<ListItem<Option> | ListSeparator> {
    const menuOptionFilter = getMenuOptionFilter(selectIsRequired);

    return options.filter(menuOptionFilter).map((option) => {
        if ('separator' in option) {
            return {
                text: option.text,
                separator: true,
            };
        }

        const selected = isSelected(option, value);
        const { text, secondaryText, disabled } = option;
        const name = getIconName(option.icon);
        // eslint-disable-next-line sonarjs/deprecation
        const color = getIconColor(option.icon, option.iconColor);

        if (!name) {
            return {
                text: text,
                secondaryText: secondaryText,
                selected: selected,
                disabled: disabled,
                value: option,
            };
        }

        return {
            text: text,
            secondaryText: secondaryText,
            selected: selected,
            disabled: disabled,
            value: option,
            icon: {
                name: name,
                color: color,
            },
        };
    });
}

function getMenuOptionFilter(selectIsRequired: boolean) {
    return (option: Option | ListSeparator) => {
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

        if ('separator' in option) {
            return true;
        }
    };
}

function getSelectedText(value: Option | Option[]): string {
    const isEmptyValue = !value || (isMultiple(value) && !value.length);
    if (isEmptyValue) {
        return '';
    }

    if (isMultiple(value)) {
        return value.map((option) => option.text).join(', ');
    }

    return value.text;
}

function getSelectedIcon(value: any) {
    if (!value?.icon) {
        return '';
    }

    const name = getIconName(value.icon);
    const color = getIconColor(value.icon, value.iconColor);
    const style: any = {};
    if (color) {
        style.color = color;
    }

    return (
        <limel-icon
            class="limel-select__selected-option__icon"
            name={name}
            size="medium"
            style={style}
        />
    );
}

export function triggerIconColorWarning(options: Option[]) {
    options.forEach((option) => {
        // eslint-disable-next-line sonarjs/deprecation
        if (option.iconColor) {
            /* eslint-disable-next-line no-console */
            console.warn(
                "The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`.",
            );
        }
    });
}
