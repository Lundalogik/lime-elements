import { ListItem, ListSeparator } from '../../interface';
import { ListRendererConfig } from './list-renderer-config';

export class ListRenderer {
    private defaultConfig: ListRendererConfig = {
        isMenu: false,
        isOpen: true,
        selectable: false,
        badgeIcons: false,
        includeCheckboxes: false,
    };

    public render(
        items: Array<ListItem | ListSeparator>,
        config: ListRendererConfig = {}
    ) {
        items = items || [];
        config = { ...this.defaultConfig, ...config };
        const twoLines = items.some(item => {
            return 'secondaryText' in item && !!item.secondaryText;
        });

        const icons =
            config.badgeIcons &&
            items.some(item => {
                return 'icon' in item && !!item.icon;
            });

        const role = config.isMenu ? 'menu' : 'listbox';

        return (
            <ul
                class={`
                    mdc-list
                    ${twoLines ? 'mdc-list--two-line' : ''}
                    ${config.isMenu ? 'mdc-menu__items' : ''}
                    ${config.selectable ? 'selectable' : ''}
                    ${icons ? 'mdc-list--avatar-list' : ''}
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

        return (
            <li
                class="mdc-list-item mdc-form-field"
                role={config.isMenu ? 'menuitem' : ''}
                tabindex={item.disabled ? '-1' : '0'}
                aria-disabled={item.disabled ? 'true' : 'false'}
                data-index={index}
            >
                {config.includeCheckboxes
                    ? this.renderCheckboxes(
                          item.checked,
                          item.disabled,
                          item.id
                      )
                    : null}
                {item.icon ? this.renderIcon(item) : null}
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
            return <label>{text}</label>;
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
     * @param {ListItem} item the list item
     *
     * @returns {HTMLElement} the icon element
     */
    private renderIcon(item: ListItem) {
        const style = {};
        if (item.iconColor) {
            style['--icon-background-color'] = item.iconColor;
        }

        return (
            <limel-icon
                class="mdc-list-item__graphic"
                name={item.icon}
                style={style}
                size="medium"
            />
        );
    }

    /**
     *
     * Render a checkbox for a list item
     * @param {boolean} checked checkbox
     * @param {boolean} disabled checkbox
     * @param  {string} value of checkbox
     * @returns {HTMLElement} the checkbox
     */

    private renderCheckboxes(
        checked: boolean,
        disabled: boolean,
        value: string
    ) {
        return (
            <div
                class={`
                            mdc-checkbox
                            ${disabled ? 'mdc-checkbox--disabled' : ''}
                        `}
            >
                <input
                    type="checkbox"
                    class="mdc-checkbox__native-control"
                    value={value}
                    checked={checked}
                    disabled={disabled}
                />
                <div class="mdc-checkbox__background">
                    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                        <path
                            className="mdc-checkbox__checkmark-path"
                            fill="none"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"
                        />
                    </svg>
                    <div class="mdc-checkbox__mixedmark" />
                </div>
            </div>
        );
    }
}
