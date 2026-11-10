import {
    Component,
    Element,
    forceUpdate,
    h,
    Host,
    Prop,
    Watch,
} from '@stencil/core';
import translate from '../../global/translations';
import { getRel, hasUnsafeProtocol } from '../../util/link-helper';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { Languages } from '../date-picker/date.types';
import { ICONS } from './icons';
import { NavigationButtonType } from './navigation-button.types';

// The tooltip finds the button by its id in the same shadow root, so the id
// only has to be unique there.
const BUTTON_ID = 'navigation-button';

const LABEL_KEYS: Record<NavigationButtonType, string> = {
    close: 'navigation-button.close',
    back: 'navigation-button.back',
    expand: 'navigation-button.expand',
    shrink: 'navigation-button.shrink',
    minimize: 'navigation-button.minimize',
    maximize: 'navigation-button.maximize',
    float: 'navigation-button.float',
    newTab: 'navigation-button.new-tab',
};

/**
 * A button for the navigation actions that most applications share, such as
 * closing a dialog, going back, showing a view in fullscreen, or opening
 * content in a panel on the side.
 *
 * These actions should look and feel the same everywhere in an application,
 * so that users recognize the buttons quickly and know what to expect when
 * they click them.
 *
 * ## Button or link
 *
 * The same navigation action can be two different things, depending on the
 * application. "Close" may hide a dialog on the current page, or it may take
 * the user to another page. Both should look the same, but they are not the
 * same thing to a browser or to a screen reader. That is why the component
 * can render as either, and the `href` property decides which:
 *
 * - **Without `href`, it is a `<button>`.** Use this when the click changes
 *   something on the current page, such as closing a dialog, minimizing a
 *   pane or leaving fullscreen. Listen to the `click` event and do the work
 *   there.
 * - **With `href`, it is a link (`<a>`).** Use this when the click takes the
 *   user to something that has its own URL, such as another page or view.
 *   The user can then do what they can do with any link: open it in a new
 *   tab or window, copy its address, or see where it leads before clicking.
 *
 * Screen readers announce the two differently, as "button" or as "link", so
 * the choice also tells the user what to expect. Do not use a button with a
 * click handler to go to a URL, and do not set an `href` only to run code
 * when the link is clicked.
 *
 * Each example shows its type twice: first as a button, then as a link.
 *
 * ## Label
 *
 * The button has no visible text, so it needs a name for screen readers,
 * which it also shows in a tooltip. It names itself after its `type`, in
 * its `language`, so a `type` is all it needs. Set a `label` when another
 * text tells the user better what the button does.
 *
 * @exampleComponent limel-example-navigation-button-close
 * @exampleComponent limel-example-navigation-button-back
 * @exampleComponent limel-example-navigation-button-expand
 * @exampleComponent limel-example-navigation-button-shrink
 * @exampleComponent limel-example-navigation-button-minimize
 * @exampleComponent limel-example-navigation-button-maximize
 * @exampleComponent limel-example-navigation-button-float
 * @exampleComponent limel-example-navigation-button-new-tab
 * @exampleComponent limel-example-navigation-button-hotkey
 * @exampleComponent limel-example-navigation-button-disabled
 */
@Component({
    tag: 'limel-navigation-button',
    shadow: { delegatesFocus: true },
    styleUrl: 'navigation-button.scss',
})
export class NavigationButton {
    /**
     * The URL that the user is taken to. Setting it renders the component as
     * a link (`<a>`); without it, the component is a `<button>`.
     *
     * Set it when the click takes the user to something that has its own
     * URL, and leave it out when the click changes something on the current
     * page. With `type="newTab"`, the link opens in a new browser tab.
     *
     * A URL that can run a script, such as a `javascript:` URL, is ignored,
     * and so is a value that is not a string.
     */
    @Prop({ reflect: true })
    public href?: string;

    /**
     * The accessible name of the button, which screen readers announce. The
     * button has no visible text, so the label is also shown in a tooltip
     * when the button is hovered or focused.
     *
     * Without a label, the button is named after its `type`, in the
     * `language` of the component, for example "Close" or "Open in new tab".
     * Set a label when another text tells the user better what the button
     * does, for example "Close customer details".
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * Defines the language of the name that the button gets when it has no
     * `label`.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * Additional text in the tooltip, below the label. For example what the
     * button acts on, or its keyboard shortcut. Screen readers announce it
     * as the description of the button.
     */
    @Prop({ reflect: true })
    public helperLabel?: string;

    /**
     * The keyboard shortcut of the action of the button, for example
     * `"escape"` or `"ctrl+f"`. It is shown in the tooltip, and screen
     * readers read it as a part of the description of the button.
     *
     * The button only shows the shortcut. It does not listen for the keys,
     * so it is up to you to handle them, for example by calling `click()` on
     * the element.
     */
    @Prop({ reflect: true })
    public hotkey?: string;

    /**
     * Defines how the button looks, and how it moves when the user points
     * at it. See the examples for when to use each type.
     */
    @Prop({ reflect: true })
    public type!: NavigationButtonType;

    /**
     * Set to `true` to disable the button. A disabled button cannot be
     * clicked or focused, and no `click` event reaches your listeners.
     *
     * A disabled link is still announced as a link by screen readers, but
     * as an unavailable one, and it does not lead anywhere.
     */
    @Prop({ reflect: true })
    public disabled = false;

    // The tooltip is next to the control, and not inside it. Inside, the text
    // of the tooltip would count as text of the control, and then the accessible
    // name would have to contain it.
    //
    // The control only needs its name. The tooltip gives it the description,
    // from the helper label.
    @Element()
    private readonly host: HTMLLimelNavigationButtonElement;

    // `tabindex` is not a prop, so a change of it does not render the
    // component.
    private readonly tabIndexObserver = new MutationObserver(() =>
        forceUpdate(this.host)
    );

    private hrefWarnedAbout?: string;

    public connectedCallback() {
        makeEnterClickable(this.host);
        this.tabIndexObserver.observe(this.host, {
            attributeFilter: ['tabindex'],
        });
    }

    public componentWillLoad() {
        this.warnAboutUnsafeHref();
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
        this.tabIndexObserver.disconnect();
    }

    // The watcher is active before the component has loaded, so without the
    // memory of the last warning, an `href` that is set right after the
    // element is created would be warned about twice.
    @Watch('href')
    protected warnAboutUnsafeHref() {
        const unsafeHref = this.getSafeHref() ? undefined : this.href;
        if (unsafeHref === this.hrefWarnedAbout) {
            return;
        }

        this.hrefWarnedAbout = unsafeHref;
        if (!unsafeHref) {
            return;
        }

        console.warn(
            'limel-navigation-button: the `href` is ignored, because it is not a string, or because a URL with its protocol can run a script.'
        );
    }

    public render() {
        const Tag = this.getSafeHref() ? 'a' : 'button';

        return (
            <Host onClickCapture={this.handleClick}>
                <Tag
                    class={{
                        'navigation-button': true,
                        [this.type]: !!this.type,
                    }}
                    id={BUTTON_ID}
                    aria-label={this.getLabel()}
                    {...this.getControlAttributes()}
                >
                    {this.renderIcon()}
                </Tag>
                {this.renderTooltip(Tag)}
            </Host>
        );
    }

    private readonly handleClick = (event: MouseEvent) => {
        this.filterClickWhenDisabled(event);
        this.passClickOnHostToLink(event);
    };

    private readonly filterClickWhenDisabled = (event: MouseEvent) => {
        if (!this.disabled) {
            return;
        }

        event.stopImmediatePropagation();
        event.preventDefault();
    };

    // `click()` on the element dispatches a click on the host, which does not
    // follow a link inside it. The click is passed on to the link, so that
    // listeners get a click that they can prevent, and the link is followed
    // if they do not.
    private readonly passClickOnHostToLink = (event: MouseEvent) => {
        const isOnHost = event.composedPath()[0] === this.host;
        if (this.disabled || !isOnHost || !this.getSafeHref()) {
            return;
        }

        event.stopImmediatePropagation();
        this.host.shadowRoot
            .querySelector<HTMLElement>(`#${BUTTON_ID}`)
            .click();
    };

    private getSafeHref(): string | undefined {
        if (this.href && !hasUnsafeProtocol(this.href)) {
            return this.href;
        }
    }

    private getControlAttributes() {
        return { ...this.getTabIndexAttribute(), ...this.getModeAttributes() };
    }

    // A `tabindex` on the host is how a consumer takes the button out of
    // the tab order, for example in a toolbar that moves focus with the
    // arrow keys. The control gets it too, for browsers that do not skip
    // the content of a host with a negative `tabindex`. A disabled control
    // gets none, because a `tabindex` would make a disabled link focusable.
    private getTabIndexAttribute() {
        if (this.disabled || !this.host.hasAttribute('tabindex')) {
            return {};
        }

        return { tabindex: this.host.getAttribute('tabindex') };
    }

    private getModeAttributes() {
        const href = this.getSafeHref();
        if (!href) {
            return { disabled: this.disabled };
        }

        if (this.disabled) {
            return this.getDisabledLinkAttributes();
        }

        const target = this.getLinkTarget();

        return { href, target, rel: getRel(target) };
    }

    // An `<a>` has no `disabled` attribute, and with an `href` it can still
    // be followed. Without one it is a placeholder for a link, which is how
    // HTML describes a link that is not available:
    // https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
    private getDisabledLinkAttributes() {
        return { role: 'link', 'aria-disabled': 'true' };
    }

    private getLinkTarget(): string | undefined {
        if (this.href && this.type === 'newTab') {
            return '_blank';
        }
    }

    private renderIcon() {
        const groups = ICONS[this.type];
        if (!groups) {
            return;
        }

        return (
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                {groups.map((paths) => this.renderIconGroup(paths))}
            </svg>
        );
    }

    // With a `pathLength` of 1, the stylesheet can draw a path in with
    // `stroke-dashoffset`, without knowing how long the path is.
    private renderIconGroup(paths: string[]) {
        return (
            <g>
                {paths.map((path) => (
                    <path key={path} d={path} pathLength="1" />
                ))}
            </g>
        );
    }

    // The tooltip finds its control once, when the tooltip is created. Setting
    // or clearing `href` replaces the control, so the tooltip has the tag of
    // the control as its key, and is replaced with it.
    private renderTooltip(key: string) {
        const label = this.getLabel();
        if (!label) {
            return;
        }

        return (
            <limel-tooltip
                key={key}
                elementId={BUTTON_ID}
                label={label}
                helperLabel={this.helperLabel}
                hotkey={this.hotkey}
            />
        );
    }

    private getLabel(): string | undefined {
        if (this.label) {
            return this.label;
        }

        const key = LABEL_KEYS[this.type];
        if (key) {
            return translate.get(key, this.language);
        }
    }
}
