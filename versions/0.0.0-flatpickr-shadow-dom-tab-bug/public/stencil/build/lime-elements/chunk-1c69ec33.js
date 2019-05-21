const h = window.LimeElements.h;

import { a as CheckboxTemplate } from './chunk-33f42226.js';

const RadioButtonTemplate = props => {
    return (h("div", { class: "mdc-form-field" },
        h("div", { class: `
                        mdc-radio
                        ${props.disabled ? 'mdc-radio--disabled' : ''}
                    ` },
            h("input", { class: "mdc-radio__native-control", type: "radio", id: props.id, checked: props.checked, disabled: props.disabled, onChange: props.onChange }),
            h("div", { class: "mdc-radio__background" },
                h("div", { class: "mdc-radio__outer-circle" }),
                h("div", { class: "mdc-radio__inner-circle" }))),
        h("label", { class: `${props.disabled ? 'disabled' : ''}`, htmlFor: props.id }, props.label)));
};

class ListRenderer {
    constructor() {
        this.defaultConfig = {
            isMenu: false,
            isOpen: true,
            badgeIcons: false,
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
        return (h("ul", { class: classNames, "aria-hidden": (!config.isOpen).toString(), role: role, "aria-orientation": "vertical" }, items.map(this.renderListItem.bind(this, config))));
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
        if (['radio', 'checkbox'].includes(config.type)) {
            return this.renderVariantListItem(config, item, index);
        }
        const classNames = {
            'mdc-list-item': true,
            'mdc-list-item--disabled': item.disabled,
            'mdc-list-item__text': !item.secondaryText,
            'mdc-list-item--selected': item.selected,
        };
        return (h("li", { class: classNames, role: config.isMenu ? 'menuitem' : '', tabindex: item.disabled ? '-1' : '0', "aria-disabled": item.disabled ? 'true' : 'false', "aria-selected": item.selected ? 'true' : 'false', "data-index": index },
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
    renderVariantListItem(config, item, index) {
        let itemTemplate;
        if (config.type === 'radio') {
            itemTemplate = (h(RadioButtonTemplate, { id: `c_${index}`, checked: item.selected, disabled: item.disabled }));
        }
        else if (config.type === 'checkbox') {
            itemTemplate = (h(CheckboxTemplate, { id: `c_${index}`, checked: item.selected, disabled: item.disabled }));
        }
        const classNames = {
            'mdc-list-item': true,
            'mdc-list-item--disabled': item.disabled,
            'mdc-list-item__text': !item.secondaryText,
        };
        return (h("li", { class: classNames, role: config.type, "aria-checked": item.selected ? 'true' : 'false', tabindex: item.disabled ? '-1' : '0', "aria-disabled": item.disabled ? 'true' : 'false', "data-index": index }, this.renderVariantListItemContent(config, item, itemTemplate)));
    }
    renderVariantListItemContent(config, item, itemTemplate) {
        if (this.hasIcons) {
            return [
                item.icon ? this.renderIcon(config, item) : null,
                this.renderText(item.text, item.secondaryText),
                h("div", { class: "mdc-list-item__meta" }, itemTemplate),
            ];
        }
        return [
            h("div", { class: "mdc-list-item__graphic" }, itemTemplate),
            this.renderText(item.text, item.secondaryText),
        ];
    }
}

export { ListRenderer as a };
