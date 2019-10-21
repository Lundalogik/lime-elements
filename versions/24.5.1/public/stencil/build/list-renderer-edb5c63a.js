import { h } from './core-804afdbc.js';
import { C as CheckboxTemplate } from './checkbox.template-1ba9144b.js';

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
        this.renderListItem = this.renderListItem.bind(this);
        this.renderDivider = this.renderDivider.bind(this);
    }
    render(items, config = {}) {
        items = items || [];
        this.config = Object.assign(Object.assign({}, this.defaultConfig), config);
        this.twoLines = items.some(item => {
            return 'secondaryText' in item && !!item.secondaryText;
        });
        this.hasIcons = items.some(item => {
            return 'icon' in item && !!item.icon;
        });
        this.avatarList = this.config.badgeIcons && this.hasIcons;
        const selectableListTypes = ['selectable', 'radio', 'checkbox'];
        let role;
        switch (this.config.type) {
            case 'checkbox':
                role = 'group';
                break;
            case 'radio':
                role = 'radiogroup';
                break;
            default:
                role = this.config.isMenu ? 'menu' : 'listbox';
        }
        this.applyTabIndexToItemAtIndex = this.getIndexForWhichToApplyTabIndex(items);
        const classNames = {
            'mdc-list': true,
            'mdc-list--two-line': this.twoLines,
            selectable: selectableListTypes.includes(this.config.type),
            'mdc-list--avatar-list': this.avatarList,
            'list--compact': this.twoLines &&
                ['small', 'x-small'].includes(this.config.iconSize),
        };
        return (h("ul", { class: classNames, "aria-hidden": (!this.config.isOpen).toString(), role: role, "aria-orientation": "vertical" }, items.map(this.renderListItem)));
    }
    /**
     * Determine which ListItem should have the `tab-index` attribute set,
     * and return the index at which that ListItem is located in `items`.
     * Returns `undefined` if no item should have the attribute set.
     * See https://github.com/material-components/material-components-web/tree/e66a43a75fef4f9179e24856649518e15e279a04/packages/mdc-list#accessibility
     *
     * @param {Array<ListItem | ListSeparator>} items the items of the list, including any `ListSeparator`:s
     *
     * @returns {number} the index as per the description
     */
    getIndexForWhichToApplyTabIndex(items) {
        let result;
        for (let i = 0, max = items.length; i < max; i += 1) {
            if ('separator' in items[i]) {
                // Ignore ListSeparator
            }
            else {
                const item = items[i];
                if (item.selected) {
                    result = i;
                    break;
                }
                if (result === undefined && !item.disabled) {
                    result = i;
                    // Do NOT break, as any later item with
                    // `selected=true` should get the tab-index instead!
                }
            }
        }
        return result;
    }
    /**
     * Render a single list item
     *
     * @param {ListItem | ListSeparator} item the item to render
     * @param {number} index the index the item had in the `items` array
     *
     * @returns {HTMLElement} the list item
     */
    renderListItem(item, index) {
        if ('separator' in item) {
            return h("li", { class: "mdc-list-divider", role: "separator" });
        }
        if (['radio', 'checkbox'].includes(this.config.type)) {
            return this.renderVariantListItem(this.config, item, index);
        }
        const classNames = {
            'mdc-list-item': true,
            'mdc-list-item--disabled': item.disabled,
            'mdc-list-item__text': !item.secondaryText,
            'mdc-list-item--selected': item.selected,
        };
        const attributes = {};
        if (index === this.applyTabIndexToItemAtIndex) {
            attributes.tabindex = '0';
        }
        return (h("li", Object.assign({ class: classNames, role: this.config.isMenu ? 'menuitem' : '', "aria-disabled": item.disabled ? 'true' : 'false', "aria-selected": item.selected ? 'true' : 'false', "data-index": index }, attributes),
            item.icon ? this.renderIcon(this.config, item) : null,
            this.renderText(item.text, item.secondaryText),
            this.twoLines && this.avatarList ? this.renderDivider() : null));
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
        return (h("limel-icon", { badge: config.badgeIcons, class: "mdc-list-item__graphic", name: item.icon, style: style, size: config.iconSize }));
    }
    renderDivider() {
        const classes = {
            'mdc-list-divider': true,
            'mdc-list-divider--inset': true,
        };
        if (this.config.iconSize) {
            classes[this.config.iconSize] = true;
        }
        return h("hr", { class: classes });
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
        const attributes = {};
        if (index === this.applyTabIndexToItemAtIndex) {
            attributes.tabindex = '0';
        }
        return (h("li", Object.assign({ class: classNames, role: config.type, "aria-checked": item.selected ? 'true' : 'false', "aria-disabled": item.disabled ? 'true' : 'false', "data-index": index }, attributes), this.renderVariantListItemContent(config, item, itemTemplate)));
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

export { ListRenderer as L };
