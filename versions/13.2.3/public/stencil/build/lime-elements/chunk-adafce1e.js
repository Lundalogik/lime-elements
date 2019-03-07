const h = window.LimeElements.h;

class ListRenderer {
    constructor() {
        this.defaultConfig = {
            isMenu: false,
            isOpen: true,
            selectable: false,
            badgeIcons: false,
        };
    }
    render(items, config = {}) {
        items = items || [];
        config = Object.assign({}, this.defaultConfig, config);
        const twoLines = items.some(item => {
            return 'secondaryText' in item && !!item.secondaryText;
        });
        const icons = config.badgeIcons &&
            items.some(item => {
                return 'icon' in item && !!item.icon;
            });
        const role = config.isMenu ? 'menu' : 'listbox';
        return (h("ul", { class: `
                    mdc-list
                    ${twoLines ? 'mdc-list--two-line' : ''}
                    ${config.isMenu ? 'mdc-menu__items' : ''}
                    ${config.selectable ? 'selectable' : ''}
                    ${icons ? 'mdc-list--avatar-list' : ''}
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
        return (h("li", { class: `
                    mdc-list-item
                    ${item.disabled ? 'mdc-list-item--disabled' : ''}
                    ${!item.secondaryText ? 'mdc-list-item__text' : ''}
                `, role: config.isMenu ? 'menuitem' : '', tabindex: item.disabled ? '-1' : '0', "aria-disabled": item.disabled ? 'true' : 'false', "data-index": index },
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
            style['--icon-background-color'] = item.iconColor;
        }
        return (h("limel-icon", { class: "mdc-list-item__graphic", name: item.icon, style: style, size: config.isMenu ? 'small' : 'medium' }));
    }
}

export { ListRenderer as a };
