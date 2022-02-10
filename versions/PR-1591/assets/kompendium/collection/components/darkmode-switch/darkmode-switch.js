import { Component, h, State } from '@stencil/core';
import { THEME_EVENT_NAME } from './types';
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
    return (h("div", { class: "mode-toggle" },
      h("input", Object.assign({ type: "checkbox", onChange: this.handleThemeChange, ref: this.getSelectRef }, props)),
      h("div", { class: "mode-visualization" },
        h("div", { class: "circle" }),
        h("div", { class: "ray one" }),
        h("div", { class: "ray two" }),
        h("div", { class: "ray three" }),
        h("div", { class: "ray four" }))));
  }
  static get is() { return "kompendium-darkmode-switch"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["darkmode-switch.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["darkmode-switch.css"]
  }; }
  static get states() { return {
    "theme": {},
    "systemSettingIsDark": {}
  }; }
}
