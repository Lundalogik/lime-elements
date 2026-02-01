import { h } from "@stencil/core";
import { THEME_EVENT_NAME } from "./types";
const DEFAULT = 'system-default';
const LIGHT = 'force-light';
const DARK = 'force-dark';
const CHECKBOX_LIGHT = false;
const CHECKBOX_DARK = true;
const LOCALSTORAGE_KEY = 'kompendium-theme';
/**
 * @private
 */
export class DarkmodeSwitch {
    constructor() {
        this.theme = 'system-default';
        this.getSelectRef = (element) => {
            this.checkbox = element;
        };
        this.handleSystemThemeChange = (e) => {
            this.systemSettingIsDark = !!e.matches;
            if (this.theme === DEFAULT) {
                this.checkbox.checked = !this.checkbox.checked;
            }
        };
        this.handleThemeChange = () => {
            const checkboxValue = !!this.checkbox.checked;
            let newTheme = DEFAULT;
            if (this.systemSettingIsDark) {
                if (checkboxValue === CHECKBOX_LIGHT) {
                    newTheme = LIGHT;
                }
            }
            else {
                if (checkboxValue === CHECKBOX_DARK) {
                    newTheme = DARK;
                }
            }
            this.setTheme(newTheme);
            document.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, { detail: newTheme }));
        };
        this.setTheme = (value) => {
            this.theme = value;
            document.querySelector('html').dataset.theme = value;
            localStorage.setItem(LOCALSTORAGE_KEY, value);
        };
        const colorSchemeMediaQueryFallback = {
            addEventListener: () => { },
            matches: false,
        };
        this.colorSchemeMediaQuery =
            (window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)')) ||
                colorSchemeMediaQueryFallback;
    }
    connectedCallback() {
        this.colorSchemeMediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }
    disconnectedCallback() {
        this.colorSchemeMediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
    componentWillLoad() {
        this.systemSettingIsDark = this.colorSchemeMediaQuery.matches;
        this.setTheme((localStorage.getItem(LOCALSTORAGE_KEY) || DEFAULT));
    }
    render() {
        const props = {
            checked: this.theme === DARK ||
                (this.theme === DEFAULT && this.systemSettingIsDark),
        };
        return (h("div", { key: '72bb10f37127840f1e310943a35a6f653bd3859d', class: "mode-toggle" }, h("input", { key: '5869df8eadeb50a5e6c7fe41e0ec6f7dfe8be233', type: "checkbox", onChange: this.handleThemeChange, ref: this.getSelectRef, ...props }), h("div", { key: '4ca3d61f92b73c9239820eadf411fbb9f4eaab7f', class: "mode-visualization" }, h("div", { key: 'e4d99bd1a90298a2a6c634cd2d3cb859c3bbd1bc', class: "circle" }), h("div", { key: '4a7e9b0d7d5bfc4c85db8cd50e6200899d81a6fb', class: "ray one" }), h("div", { key: 'c489f612cabd963e3ebae26996dd7a71f242e0de', class: "ray two" }), h("div", { key: '83288239cf2c67c0ad314728c6c65ffee67f9c1e', class: "ray three" }), h("div", { key: '013b3c4c16e8f49d396a7a3e903108304ad17dfe', class: "ray four" }))));
    }
    static get is() { return "kompendium-darkmode-switch"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["darkmode-switch.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["darkmode-switch.css"]
        };
    }
    static get states() {
        return {
            "theme": {},
            "systemSettingIsDark": {}
        };
    }
}
//# sourceMappingURL=darkmode-switch.js.map
