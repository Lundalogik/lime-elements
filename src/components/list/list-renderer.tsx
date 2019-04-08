import { h } from '@stencil/core';
import { ListItem, ListSeparator } from '../../interface';
import { CheckboxTemplate } from '../checkbox/checkbox.template';
import { ListRendererConfig } from './list-renderer-config';
import { RadioButtonTemplate } from './radio-button/radio-button.template';

export class ListRenderer {
    private defaultConfig: ListRendererConfig = {
        isMenu: false,
        isOpen: true,
        badgeIcons: false,
    };

    private hasIcons: boolean;

    public render(
        items: Array<ListItem | ListSeparator>,
        config: ListRendererConfig = {}
    ) {
        items = items || [];
        config = { ...this.defaultConfig, ...config };

        const twoLines = items.some(item => {
            return 'secondaryText' in item && !!item.secondaryText;
        });

        this.hasIcons = items.some(item => {
            return 'icon' in item && !!item.icon;
        });

        const badgeIcons = config.badgeIcons && this.hasIcons;
        const selectableListTypes = ['selectable', 'radio', 'checkbox'];

        let role;
        switch (config.type) {
            case 'checkbox':
                role = 'group';
                break;
            case 'radio':
                role = 'radiogroup';
                break;
            default:
                role = config.isMenu ? 'menu' : 'listbox';
        }

        const classNames = {
            'mdc-list': true,
            'mdc-list--two-line': twoLines,
            selectable: selectableListTypes.includes(config.type),
            'mdc-list--avatar-list': badgeIcons,
        };

        return (
            <ul
                class={classNames}
                aria-hidden={(!config.isOpen).toString()}
                role={role}
                aria-orientation="vertical"
            >
                {items.map(this.renderListItem.bind(this, config))}
            </ul>
        );
    }

    /**
     * Render a single list item
     *
     * @param {ListRendererConfig} config the config object, passed on from the `render` function
     * @param {ListItem | ListSeparator} item the item to render
     * @param {number} index the index the item had in the `items` array
     *
     * @returns {HTMLElement} the list item
     */
    private renderListItem(
        config: ListRendererConfig,
        item: ListItem | ListSeparator,
        index: number
    ) {
        if ('separator' in item) {
            return <li class="mdc-list-divider" role="separator" />;
        }

        if (['radio', 'checkbox'].includes(config.type)) {
            return this.renderVariantListItem(config, item, index);
        }

        const classNames = {
            'mdc-list-item': true,
            'mdc-list-item--disabled': item.disabled,
            'mdc-list-item__text': !item.secondaryText,
            'mdc-list-item--selected': item.selected,
        };

        return (
            <li
                class={classNames}
                role={config.isMenu ? 'menuitem' : ''}
                tabindex={item.disabled ? '-1' : '0'}
                aria-disabled={item.disabled ? 'true' : 'false'}
                aria-selected={item.selected ? 'true' : 'false'}
                data-index={index}
            >
                {item.icon ? this.renderIcon(config, item) : null}
                {this.renderText(item.text, item.secondaryText)}
            </li>
        );
    }

    /**
     * Render the text of the list item
     *
     * @param {string} text primary text for the list item
     * @param {string} secondaryText secondary text for the list item
     *
     * @returns {HTMLElement | string} the text for the list item
     */
    private renderText(text: string, secondaryText?: string) {
        if (!secondaryText) {
            return text;
        }

        return (
            <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">{text}</span>
                <span class="mdc-list-item__secondary-text">
                    {secondaryText}
                </span>
            </span>
        );
    }

    /**
     * Render an icon for a list item
     *
     * @param {ListRendererConfig} config the config object, passed on from the `renderListItem` function
     * @param {ListItem} item the list item
     *
     * @returns {HTMLElement} the icon element
     */
    private renderIcon(config: ListRendererConfig, item: ListItem) {
        const style = {};
        if (item.iconColor) {
            config.badgeIcons
                ? (style['--icon-background-color'] = item.iconColor)
                : (style['color'] = item.iconColor); // tslint:disable-line:no-string-literal
        }

        return (
            <limel-icon
                badge={config.badgeIcons}
                class="mdc-list-item__graphic"
                name={item.icon}
                style={style}
                size={config.isMenu ? 'small' : 'medium'}
            />
        );
    }

    private renderVariantListItem(
        config: ListRendererConfig,
        item: ListItem,
        index: number
    ) {
        let itemTemplate;
        if (config.type === 'radio') {
            itemTemplate = (
                <RadioButtonTemplate
                    id={`c_${index}`}
                    checked={item.selected}
                    disabled={item.disabled}
                />
            );
        } else if (config.type === 'checkbox') {
            itemTemplate = (
                <CheckboxTemplate
                    id={`c_${index}`}
                    checked={item.selected}
                    disabled={item.disabled}
                />
            );
        }

        const classNames = {
            'mdc-list-item': true,
            'mdc-list-item--disabled': item.disabled,
            'mdc-list-item__text': !item.secondaryText,
        };

        return (
            <li
                class={classNames}
                role={config.type}
                aria-checked={item.selected ? 'true' : 'false'}
                tabindex={item.disabled ? '-1' : '0'}
                aria-disabled={item.disabled ? 'true' : 'false'}
                data-index={index}
            >
                {this.renderVariantListItemContent(config, item, itemTemplate)}
            </li>
        );
    }

    private renderVariantListItemContent(
        config: ListRendererConfig,
        item: ListItem,
        itemTemplate: any
    ) {
        if (this.hasIcons) {
            return [
                item.icon ? this.renderIcon(config, item) : null,
                this.renderText(item.text, item.secondaryText),
                <div class="mdc-list-item__meta">{itemTemplate}</div>,
            ];
        }
        return [
            <div class="mdc-list-item__graphic">{itemTemplate}</div>,
            this.renderText(item.text, item.secondaryText),
        ];
    }
}
