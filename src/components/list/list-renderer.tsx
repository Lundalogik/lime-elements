import { ListItem, ListSeparator } from '../../interface';
import { CheckboxTemplate } from '../checkbox/checkbox.template';
import { ListRendererConfig } from './list-renderer-config';

export class ListRenderer {
    private defaultConfig: ListRendererConfig = {
        isMenu: false,
        isOpen: true,
        selectable: false,
        badgeIcons: false,
        multiple: false,
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

        let role = config.selectable && config.multiple ? 'group' : null;
        if (!role) {
            role = config.isMenu ? 'menu' : 'listbox';
        }

        return (
            <ul
                class={`
                    mdc-list
                    ${twoLines ? 'mdc-list--two-line' : ''}
                    ${config.isMenu ? 'mdc-menu__items' : ''}
                    ${config.selectable ? 'selectable' : ''}
                    ${badgeIcons ? 'mdc-list--avatar-list' : ''}
                `}
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

        if (config.selectable && config.multiple) {
            return this.renderCheckboxListItem(config, item, index);
        }

        return (
            <li
                class={`
                    mdc-list-item
                    ${item.disabled ? 'mdc-list-item--disabled' : ''}
                    ${!item.secondaryText ? 'mdc-list-item__text' : ''}
                    ${item.selected ? 'mdc-list-item--selected' : ''}
                `}
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

    private renderCheckboxListItem(
        config: ListRendererConfig,
        item: ListItem,
        index: number
    ) {
        return (
            <li
                class={`
                    mdc-list-item
                    ${item.disabled ? 'mdc-list-item--disabled' : ''}
                    ${!item.secondaryText ? 'mdc-list-item__text' : ''}
                `}
                role="checkbox"
                aria-checked={item.selected ? 'true' : 'false'}
                tabindex={item.disabled ? '-1' : '0'}
                aria-disabled={item.disabled ? 'true' : 'false'}
                data-index={index}
            >
                {this.renderCheckboxListItemContent(config, item, index)}
            </li>
        );
    }

    private renderCheckboxListItemContent(
        config: ListRendererConfig,
        item: ListItem,
        index: number
    ) {
        if (this.hasIcons) {
            return [
                item.icon ? this.renderIcon(config, item) : null,
                this.renderText(item.text, item.secondaryText),
                <div class="mdc-list-item__meta">
                    <CheckboxTemplate
                        id={`c_${index}`}
                        checked={item.selected}
                    />
                </div>,
            ];
        }
        return [
            <div class="mdc-list-item__graphic">
                <CheckboxTemplate id={`c_${index}`} checked={item.selected} />
            </div>,
            this.renderText(item.text, item.secondaryText),
        ];
    }
}
