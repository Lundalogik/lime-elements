import {
    Component,
    h,
    Prop,
    Element,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { MDCRipple } from '@material/ripple';
import { Tab } from './tab.types';
import { isEqual, difference } from 'lodash-es';
import { setActiveTab } from './tabs';
import { getIconColor, getIconName } from '../icon/get-icon-props';
import {
    findNavigationTarget,
    isNavigationKey,
    NavigationOptions,
    NO_NAVIGATION_TARGET,
} from '../../util/keyboard-navigation';

const NAVIGATION: NavigationOptions<Tab> = {
    orientation: 'horizontal',
    wrap: true,
};

/**
 * Tabs are great to organize information hierarchically in the interface and divide it into distinct categories. Using tabs, you can create groups of content that are related and at the same level in the hierarchy.
 * :::warning
 * Tab bars should be strictly used for navigation at the top levels.
 * They should never be used to perform actions, or navigate away from the view which contains them.
 * :::
 * An exception for using tab bars in a high level of hierarchy is their usage in modals. This is because modals are perceived as a separate place and not a part of the current context. Therefore you can use tab bars in a modal to group and organize its content.
 * A tab bar can contain an unlimited number of tabs. However, depending on the device width and width of the tabs, the number of tabs that are visible at the same time will vary. When there is limited horizontal space, the component shows a left-arrow and/or right-arrow button, which scrolls and reveals the additional tabs. The tab bar can also be swiped left and right on a touch-device.
 * The arrows are only a shortcut for people who use a mouse or a touch screen. Screen readers do not announce them, and the Tab key skips them. People who use a keyboard or a screen reader move between the tabs, and the tab bar keeps the selected tab in view.
 * The left and right arrow keys move to the previous and the next tab, and select it. Home and End move to the first and the last tab. Moving past the last tab continues at the first one, and the other way around. The Tab key moves on to what comes after the tab bar, and moving back with Shift and Tab lands on the selected tab.
 * :::tip Other things to consider
 * Never divide the content of a tab using a nested tab bar.
 * Never place two tab bars within the same screen.
 * Never use background color for icons in tabs.
 * Avoid having long labels for tabs.
 * A tab will never be removed or get disabled, even if there is no content under it.
 * :::
 *
 * @exampleComponent limel-example-tab-bar-basic
 * @exampleComponent limel-example-tab-bar-with-dynamic-tab-width
 * @exampleComponent limel-example-tab-bar-with-equal-tab-width
 */
@Component({
    tag: 'limel-tab-bar',
    styleUrl: 'tab-bar.scss',
    shadow: true,
})
export class TabBar {
    /**
     * List of tabs to display
     */
    @Prop({ mutable: true })
    public tabs: Tab[] = [];

    /**
     * Emitted when a tab has been changed
     */
    @Event()
    private changeTab: EventEmitter<Tab>;

    @Element()
    private host: HTMLLimelTabBarElement;

    private ripples = new Map<HTMLElement, MDCRipple>();
    private revealedTabId?: Tab['id'];
    private hasLoaded = false;

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.renderTab = this.renderTab.bind(this);
    }

    public async connectedCallback() {
        // Connecting after the first render means that the bar was moved, which
        // resets how far it is scrolled.
        if (!this.hasLoaded) {
            return;
        }

        this.updateRipples();
        this.revealedTabId = undefined;
        await this.revealActiveTab('auto');
    }

    public componentDidLoad() {
        this.hasLoaded = true;
        this.triggerIconColorWarning();
    }

    public async componentDidRender() {
        this.updateRipples();
        await this.revealActiveTab(this.hasLoaded ? undefined : 'auto');
    }

    public disconnectedCallback() {
        this.destroyRipples();
    }

    public render() {
        return (
            <div
                class="mdc-tab-bar"
                role="tablist"
                onKeyDown={this.handleKeyDown}
            >
                <limel-scroller>{this.tabs.map(this.renderTab)}</limel-scroller>
            </div>
        );
    }

    @Watch('tabs')
    protected tabsChanged(newTabs: Tab[] = [], oldTabs: Tab[] = []) {
        const newIds = newTabs.map((tab) => tab.id);
        const oldIds = oldTabs.map((tab) => tab.id);

        if (isEqual(newIds, oldIds)) {
            return;
        }

        this.revealedTabId = undefined;
    }

    private getTabElements(): HTMLElement[] {
        return [
            ...this.host.shadowRoot.querySelectorAll<HTMLElement>(
                'button[role="tab"]'
            ),
        ];
    }

    /**
     * Gives every tab MDC's ripple, which is the feedback when a tab is
     * pressed. Tabs that are gone lose theirs.
     */
    private updateRipples() {
        const tabs = this.getTabElements();

        for (const [tab, ripple] of this.ripples) {
            if (tabs.includes(tab)) {
                continue;
            }

            ripple.destroy();
            this.ripples.delete(tab);
        }

        for (const tab of tabs) {
            if (!this.ripples.has(tab)) {
                this.ripples.set(tab, new MDCRipple(tab));
            }
        }
    }

    private destroyRipples() {
        for (const ripple of this.ripples.values()) {
            ripple.destroy();
        }

        this.ripples.clear();
    }

    /**
     * A tab that is activated by the user has focus, and the scroller reveals
     * what has focus. This is for a tab that becomes active without it.
     *
     * @param behavior - `auto` to jump to the tab. Leave it out to let the
     * scroller glide there.
     */
    private async revealActiveTab(behavior?: ScrollBehavior) {
        const index = this.tabs.findIndex((tab) => tab.active);
        if (index === -1) {
            this.revealedTabId = undefined;

            return;
        }

        if (this.tabs[index].id === this.revealedTabId) {
            return;
        }

        this.revealedTabId = this.tabs[index].id;
        const element = this.getTabElements()[index];
        const scroller = this.host.shadowRoot.querySelector('limel-scroller');
        if (!element || !scroller || element.matches(':focus')) {
            return;
        }

        await scroller.componentOnReady();
        await scroller.reveal(element, behavior);
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (!isNavigationKey(event, NAVIGATION)) {
            return;
        }

        event.preventDefault();
        const current = this.getTabElements().indexOf(
            event.target as HTMLElement
        );
        this.activateTab(
            findNavigationTarget(this.tabs, event.key, current, NAVIGATION)
        );
    }

    private activateTab(index: number) {
        if (index === NO_NAVIGATION_TARGET) {
            return;
        }

        // Not every browser focuses a button that is clicked, and a key can
        // lead to the selected tab from another tab that has focus.
        this.getTabElements()[index].focus();

        if (index === this.tabs.findIndex((tab) => tab.active)) {
            return;
        }

        const newTabs = setActiveTab(this.tabs, index);
        const changedTabs = difference(newTabs, this.tabs).sort(
            this.sortByInactive
        );
        for (const tab of changedTabs) {
            this.changeTab.emit(tab);
        }

        this.tabs = newTabs;
    }

    private sortByInactive(a: Tab, b: Tab) {
        return Number(a.active) - Number(b.active);
    }

    private renderIcon(tab: Tab) {
        if (!tab.icon) {
            return;
        }

        const name = getIconName(tab.icon);

        const color = getIconColor(tab.icon, tab.iconColor);
        const style = { color: '' };

        if (color) {
            style.color = color;
        }

        return (
            <limel-icon
                class="mdc-tab__icon"
                name={name}
                style={style}
                size="small"
                aria-hidden="true"
            />
        );
    }

    private renderTab(tab: Tab, index: number) {
        return (
            <button
                class={{
                    'mdc-tab': true,
                    'mdc-tab--active': !!tab.active,
                }}
                role="tab"
                aria-selected={tab.active ? 'true' : 'false'}
                tabindex={tab.active ? 0 : -1}
                onClick={() => this.activateTab(index)}
            >
                <span class="mdc-tab__content">
                    {this.renderIcon(tab)}
                    <span class="mdc-tab__text-label">{tab.text}</span>
                    {tab.badge ? <limel-badge label={tab.badge} /> : ''}
                </span>
                <span
                    class={{
                        'mdc-tab-indicator': true,
                        'mdc-tab-indicator--active': !!tab.active,
                    }}
                >
                    <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
                </span>
                <span class="mdc-tab__ripple" />
            </button>
        );
    }

    private triggerIconColorWarning() {
        if (this.tabs.some((tab) => tab.iconColor)) {
            console.warn(
                "The `iconColor` prop is deprecated now! Use the new `Icon` interface and instead of `iconColor: 'color-name'` write `icon {name: 'icon-name', color: 'color-name'}`."
            );
        }
    }
}
