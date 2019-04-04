import { FunctionalComponent } from '@stencil/core';
import { isArray } from 'lodash-es';
import {
    ENTER,
    ENTER_KEY_CODE,
    SPACE,
    SPACE_KEY_CODE,
} from '../../util/keycodes';
import { ListItem } from '../list/list-item.types';
import { Option } from './option.types';

interface SelectTemplateProps {
    disabled?: boolean;
    options: Option[];
    value: Option | Option[];
    label?: string;
    multiple?: boolean;
}

interface NativeSelectTemplateProps extends SelectTemplateProps {
    onChange?: (event: Event) => void;
}

export const NativeSelectTemplate: FunctionalComponent<
    NativeSelectTemplateProps
> = props => {
    let hasValue = !!props.value;
    if (isArray(props.value)) {
        hasValue = (props.value as Option[]).length > 0;
    } else if (hasValue) {
        hasValue = !!(props.value as Option).value;
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
    onChange?: (event: CustomEvent<ListItem | ListItem[]>) => void;
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const MenuSelectTemplate: FunctionalComponent<
    MenuSelectTemplateProps
> = props => {
    const items = createMenuItems(props.options, props.value);
    let hasValue = !!props.value;
    if (isArray(props.value)) {
        hasValue = (props.value as Option[]).length > 0;
    } else if (hasValue) {
        hasValue = !!(props.value as Option).value;
    }

    return (
        <div
            class={`
            limel-select
            mdc-menu-surface--anchor
            ${props.disabled ? 'mdc-select--disabled' : ''}
        `}
        >
            <div
                tabindex="0"
                onClick={props.open}
                class={`
                    limel-select-trigger
                    ${props.isOpen ? 'mdc-select--focused' : ''}
                `}
                slot="trigger"
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
            {props.isOpen ? (
                <div class="mdc-menu-surface--scrim" onClick={props.close} />
            ) : null}
            <div
                class={`
                mdc-menu-surface
                ${props.isOpen ? 'mdc-menu-surface--open' : ''}
            `}
                tabindex="-1"
            >
                <limel-list
                    items={items}
                    selectable={true}
                    multiple={props.multiple}
                    onKeyDown={handleListKeys}
                    onKeyUp={handleListKeys}
                    onChange={props.onChange}
                />
            </div>
        </div>
    );
};

function handleListKeys(event: KeyboardEvent) {
    const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
    const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

    if (isSpace || isEnter) {
        event.stopPropagation();
        event.preventDefault();
    }
}

function isSelected(option: Option, value: Option | Option[]): boolean {
    if (!value) {
        return false;
    }

    if (isArray(value)) {
        return (value as Option[]).some(o => option.value === o.value);
    }

    return option.value === (value as Option).value;
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

    if (isArray(value)) {
        return (value as Option[]).map(option => option.text).join(', ');
    }

    return (value as Option).text;
}
