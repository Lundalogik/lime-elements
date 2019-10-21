import { r as registerInstance, d as createEvent, h, c as getElement } from './core-804afdbc.js';
import { f as ESCAPE, g as ESCAPE_KEY_CODE, T as TAB, b as TAB_KEY_CODE } from './keycodes-ab559a88.js';
import './tslib.es6-f504def8.js';
import './component-67e7368b.js';
import { a as MDCMenuSurface, C as Corner } from './index-15e9b129.js';
import { i as isDescendant } from './dom-ae431f93.js';

const MenuSurface = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * True if the menu surface is open, false otherwise
         */
        this.open = false;
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.dismiss = createEvent(this, "dismiss", 7);
    }
    connectedCallback() {
        this.setup();
    }
    disconnectedCallback() {
        this.teardown();
    }
    componentDidLoad() {
        this.setup();
    }
    render() {
        return (h("div", { class: {
                'mdc-menu-surface': true,
                'mdc-menu-surface--open': this.open,
            }, tabindex: "-1" }, h("slot", null)));
    }
    setup() {
        const menuElement = this.host.shadowRoot.querySelector('.mdc-menu-surface');
        if (!menuElement) {
            return;
        }
        this.menuSurface = new MDCMenuSurface(menuElement);
        this.menuSurface.setAnchorCorner(Corner.TOP_START);
        document.addEventListener('mousedown', this.handleDocumentClick, {
            capture: true,
        });
        document.addEventListener('wheel', this.handleDocumentScroll, {
            passive: true,
        });
        this.host.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('resize', this.handleResize, {
            passive: true,
        });
    }
    teardown() {
        this.menuSurface.destroy();
        document.removeEventListener('mousedown', this.handleDocumentClick, {
            capture: true,
        });
        document.removeEventListener('wheel', this.handleDocumentScroll);
        this.host.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.handleResize);
    }
    handleDocumentClick(event) {
        if (this.open && !isDescendant(event.target, this.host)) {
            this.dismiss.emit();
            this.preventClickEventPropagation();
        }
    }
    handleDocumentScroll(event) {
        if (this.open && !isDescendant(event.target, this.host)) {
            this.dismiss.emit();
        }
    }
    handleResize() {
        if (this.open) {
            this.dismiss.emit();
        }
    }
    preventClickEventPropagation() {
        // When the menu surface is open, we want to stop the `click` event from propagating
        // when clicking outside the surface itself. This is to prevent any dialog that might
        // be open from closing, etc. However, when dragging a scrollbar no `click` event is emitted,
        // only mousedown and mouseup. So we listen for `mousedown` and attach a one-time listener
        // for `click`, so we can capture and "kill" it.
        document.addEventListener('click', this.stopEvent, {
            capture: true,
            once: true,
        });
        // We also capture and "kill" the next `mouseup` event.
        document.addEventListener('mouseup', this.stopEvent, {
            capture: true,
            once: true,
        });
        // If the user dragged the scrollbar, no `click` event happens. So when we get the
        // `mouseup` event, remove the handler for `click` if it's still there.
        // Otherwise, we would catch the next click even though the menu is no longer open.
        document.addEventListener('mouseup', () => {
            document.removeEventListener('click', this.stopEvent, {
                capture: true,
            });
        }, {
            once: true,
        });
    }
    stopEvent(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    handleKeyDown(event) {
        const isEscape = event.key === ESCAPE || event.keyCode === ESCAPE_KEY_CODE;
        const isTab = event.key === TAB || event.keyCode === TAB_KEY_CODE;
        if (this.open && (isEscape || isTab)) {
            event.stopPropagation();
            this.dismiss.emit();
        }
    }
    get host() { return getElement(this); }
    static get style() { return ":host {\n  --mdc-theme-primary: var(--lime-primary-color, #26a69a);\n  --mdc-theme-secondary: var(--lime-secondary-color, #575756);\n  --mdc-theme-on-primary: var(--lime-on-primary-color, #fff);\n  --mdc-theme-on-secondary: var(--lime-on-secondary-color, #fff);\n}\n\n:root {\n  --mdc-theme-primary: #26a69a;\n  --mdc-theme-secondary: #575756;\n  --mdc-theme-background: #fff;\n  --mdc-theme-surface: #fff;\n  --mdc-theme-error: #b00020;\n  --mdc-theme-on-primary: #fff;\n  --mdc-theme-on-secondary: #fff;\n  --mdc-theme-on-surface: #000;\n  --mdc-theme-on-error: #fff;\n  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);\n  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);\n  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);\n  --mdc-theme-text-primary-on-dark: white;\n  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);\n  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);\n  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);\n}\n\n.mdc-theme--primary {\n  color: #26a69a !important;\n  /* \@alternate */\n  color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary {\n  color: #575756 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-theme--background {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-background, #fff);\n}\n\n.mdc-theme--surface {\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n}\n\n.mdc-theme--error {\n  color: #b00020 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-error, #b00020) !important;\n}\n\n.mdc-theme--on-primary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-primary, #fff) !important;\n}\n\n.mdc-theme--on-secondary {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-secondary, #fff) !important;\n}\n\n.mdc-theme--on-surface {\n  color: #000 !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000) !important;\n}\n\n.mdc-theme--on-error {\n  color: #fff !important;\n  /* \@alternate */\n  color: var(--mdc-theme-on-error, #fff) !important;\n}\n\n.mdc-theme--text-primary-on-background {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-background {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-background {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-light {\n  color: rgba(0, 0, 0, 0.87) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87)) !important;\n}\n\n.mdc-theme--text-secondary-on-light {\n  color: rgba(0, 0, 0, 0.54) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-light, rgba(0, 0, 0, 0.54)) !important;\n}\n\n.mdc-theme--text-hint-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-disabled-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-icon-on-light {\n  color: rgba(0, 0, 0, 0.38) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-light, rgba(0, 0, 0, 0.38)) !important;\n}\n\n.mdc-theme--text-primary-on-dark {\n  color: white !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-primary-on-dark, white) !important;\n}\n\n.mdc-theme--text-secondary-on-dark {\n  color: rgba(255, 255, 255, 0.7) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-secondary-on-dark, rgba(255, 255, 255, 0.7)) !important;\n}\n\n.mdc-theme--text-hint-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-hint-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-disabled-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-disabled-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--text-icon-on-dark {\n  color: rgba(255, 255, 255, 0.5) !important;\n  /* \@alternate */\n  color: var(--mdc-theme-text-icon-on-dark, rgba(255, 255, 255, 0.5)) !important;\n}\n\n.mdc-theme--primary-bg {\n  background-color: #26a69a !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-primary, #26a69a) !important;\n}\n\n.mdc-theme--secondary-bg {\n  background-color: #575756 !important;\n  /* \@alternate */\n  background-color: var(--mdc-theme-secondary, #575756) !important;\n}\n\n.mdc-typography {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n}\n\n.mdc-typography--headline1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.015625em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 300;\n  letter-spacing: -0.0083333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline3 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline4 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 1rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0073529412em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline5 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: normal;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--headline6 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 1.125rem;\n  font-weight: 400;\n  letter-spacing: 0.009375em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--subtitle2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.125rem;\n  font-weight: 500;\n  letter-spacing: 0.0071428571em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body1 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.5rem;\n  font-weight: 400;\n  letter-spacing: 0.03125em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--body2 {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.8125rem;\n  line-height: 1.625rem;\n  font-weight: 400;\n  letter-spacing: 0.0178571429em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--caption {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 400;\n  letter-spacing: 0.0333333333em;\n  text-decoration: inherit;\n  text-transform: inherit;\n}\n\n.mdc-typography--button {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.875rem;\n  line-height: 2.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  text-decoration: none;\n  text-transform: none;\n}\n\n.mdc-typography--overline {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-size: 0.6875rem;\n  line-height: 0.875rem;\n  font-weight: 500;\n  letter-spacing: 0.1666666667em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n.mdc-menu-surface {\n  display: none;\n  position: absolute;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100vh - 2rem);\n  margin: 0;\n  padding: 0;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  -webkit-transform-origin: top left;\n  transform-origin: top left;\n  opacity: 0;\n  overflow: auto;\n  will-change: transform, opacity;\n  z-index: 8;\n  -webkit-transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);\n  -webkit-box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  box-shadow: 0rem 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0rem 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0rem 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);\n  background-color: #fff;\n  /* \@alternate */\n  background-color: var(--mdc-theme-surface, #fff);\n  color: #000;\n  /* \@alternate */\n  color: var(--mdc-theme-on-surface, #000);\n  border-radius: 0.25rem;\n  /* \@noflip */\n  transform-origin-left: top left;\n  /* \@noflip */\n  transform-origin-right: top right;\n}\n.mdc-menu-surface:focus {\n  outline: none;\n}\n.mdc-menu-surface--open {\n  display: inline-block;\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: 1;\n}\n.mdc-menu-surface--animating-open {\n  display: inline-block;\n  -webkit-transform: scale(0.8);\n  transform: scale(0.8);\n  opacity: 0;\n}\n.mdc-menu-surface--animating-closed {\n  display: inline-block;\n  opacity: 0;\n  -webkit-transition: opacity 0.075s linear;\n  transition: opacity 0.075s linear;\n}\n[dir=rtl] .mdc-menu-surface, .mdc-menu-surface[dir=rtl] {\n  /* \@noflip */\n  transform-origin-left: top right;\n  /* \@noflip */\n  transform-origin-right: top left;\n}\n\n.mdc-menu-surface--anchor {\n  position: relative;\n  overflow: visible;\n}\n\n.mdc-menu-surface--fixed {\n  position: fixed;\n}\n\n.mdc-menu-surface {\n  width: 100%;\n  max-height: 100%;\n}"; }
};

export { MenuSurface as limel_menu_surface };
