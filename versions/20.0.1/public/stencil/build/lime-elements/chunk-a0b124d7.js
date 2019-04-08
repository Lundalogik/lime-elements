const h = window.LimeElements.h;

import { a as CheckboxTemplate } from './chunk-c623a65d.js';

class ListRenderer {
    constructor() {
        this.defaultConfig = {
            isMenu: false,
            isOpen: true,
            selectable: false,
            badgeIcons: false,
            multiple: false,
        };
    }
    render(items, config = {}) {
        items = items || [];
        config = Object.assign({}, this.defaultConfig, config);
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
        return (h("ul", { class: `
                    mdc-list
                    ${twoLines ? 'mdc-list--two-line' : ''}
                    ${config.isMenu ? 'mdc-menu__items' : ''}
                    ${config.selectable ? 'selectable' : ''}
                    ${badgeIcons ? 'mdc-list--avatar-list' : ''}
                `, "aria-hidden": (!config.isOpen).toString(), role: role, "aria-orientation": "vertical" }, items.map(this.renderListItem.bind(this, config))));
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
    renderListItem(config, item, index) {
        if ('separator' in item) {
            return h("li", { class: "mdc-list-divider", role: "separator" });
        }
        if (config.selectable && config.multiple) {
            return this.renderCheckboxListItem(config, item, index);
        }
        return (h("li", { class: `
                    mdc-list-item
                    ${item.disabled ? 'mdc-list-item--disabled' : ''}
                    ${!item.secondaryText ? 'mdc-list-item__text' : ''}
                    ${item.selected ? 'mdc-list-item--selected' : ''}
                `, role: config.isMenu ? 'menuitem' : '', tabindex: item.disabled ? '-1' : '0', "aria-disabled": item.disabled ? 'true' : 'false', "aria-selected": item.selected ? 'true' : 'false', "data-index": index },
            item.icon ? this.renderIcon(config, item) : null,
            this.renderText(item.text, item.secondaryText)));
    }
    /**
     * Render the text of the list item
     *
     * @param {string} text primary text for the list item
     * @param {string} secondaryText secondary text for the list item
     *
     * @returns {HTMLElement | string} the text for the list item
     */
    renderText(text, secondaryText) {
        if (!secondaryText) {
            return text;
        }
        return (h("span", { class: "mdc-list-item__text" },
            h("span", { class: "mdc-list-item__primary-text" }, text),
            h("span", { class: "mdc-list-item__secondary-text" }, secondaryText)));
    }
    /**
     * Render an icon for a list item
     *
     * @param {ListRendererConfig} config the config object, passed on from the `renderListItem` function
     * @param {ListItem} item the list item
     *
     * @returns {HTMLElement} the icon element
     */
    renderIcon(config, item) {
        const style = {};
        if (item.iconColor) {
            config.badgeIcons
                ? (style['--icon-background-color'] = item.iconColor)
                : (style['color'] = item.iconColor); // tslint:disable-line:no-string-literal
        }
        return (h("limel-icon", { badge: config.badgeIcons, class: "mdc-list-item__graphic", name: item.icon, style: style, size: config.isMenu ? 'small' : 'medium' }));
    }
    renderCheckboxListItem(config, item, index) {
        return (h("li", { class: `
                    mdc-list-item
                    ${item.disabled ? 'mdc-list-item--disabled' : ''}
                    ${!item.secondaryText ? 'mdc-list-item__text' : ''}
                `, role: "checkbox", "aria-checked": item.selected ? 'true' : 'false', tabindex: item.disabled ? '-1' : '0', "aria-disabled": item.disabled ? 'true' : 'false', "data-index": index }, this.renderCheckboxListItemContent(config, item, index)));
    }
    renderCheckboxListItemContent(config, item, index) {
        if (this.hasIcons) {
            return [
                item.icon ? this.renderIcon(config, item) : null,
                this.renderText(item.text, item.secondaryText),
                h("div", { class: "mdc-list-item__meta" },
                    h(CheckboxTemplate, { id: `c_${index}`, checked: item.selected, disabled: item.disabled })),
            ];
        }
        return [
            h("div", { class: "mdc-list-item__graphic" },
                h(CheckboxTemplate, { id: `c_${index}`, checked: item.selected, disabled: item.disabled })),
            this.renderText(item.text, item.secondaryText),
        ];
    }
}

export { ListRenderer as a };
