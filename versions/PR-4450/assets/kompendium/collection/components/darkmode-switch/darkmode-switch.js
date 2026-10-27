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
        return (h("div", { key: 'b98a56a2891f00eeafec12b07bb62bab656c648c', class: "mode-toggle" }, h("input", { key: 'b4a36d6c2ea06d86d6e17565914e5aa2bd0e63ce', type: "checkbox", onChange: this.handleThemeChange, ref: this.getSelectRef, ...props }), h("div", { key: '216d6c2a317904d26d5f534eacecabe8ff0da266', class: "mode-visualization" }, h("div", { key: '918e2891556bf40477c7ea7e787481e29edee5de', class: "circle" }), h("div", { key: 'a6406616e04afc792af316c28094cd1e1e68ab81', class: "ray one" }), h("div", { key: 'a18504838fe0f18c08cbacc728f957ab2f4bbdf5', class: "ray two" }), h("div", { key: '7a688bdf87865b0d054d33799fb40610f7fdf0d2', class: "ray three" }), h("div", { key: '53a646d5e27d1c18104d779a1326f5dbc89c4323', class: "ray four" }))));
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
