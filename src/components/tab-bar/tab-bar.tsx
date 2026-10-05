import {
    Component,
    h,
    Prop,
    Element,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { MDCTabBar, MDCTabBarActivatedEvent } from '@material/tab-bar';
import type { MDCTabScroller } from '@material/tab-scroller';
import { strings } from '@material/tab-bar/constants';
import { Tab } from './tab.types';
import { isEqual, difference, noop } from 'lodash-es';
import { setActiveTab } from './tabs';
import { getIconColor, getIconName } from '../icon/get-icon-props';

const { TAB_ACTIVATED_EVENT } = strings;

// MDC wants to scroll the tabs into view itself, and finds what to scroll by
// looking for the `mdc-tab-scroller` class. Scrolling is up to `limel-scroller`.
const tabScrollerForMdc = {
    scrollTo: noop,
    incrementScroll: noop,
    getScrollPosition: () => 0,
    getScrollContentWidth: () => 0,
    destroy: noop,
} as unknown as MDCTabScroller;

/**
 * Tabs are great to organize information hierarchically in the interface and divide it into distinct categories. Using tabs, you can create groups of content that are related and at the same level in the hierarchy.
 * :::warning
 * Tab bars should be strictly used for navigation at the top levels.
 * They should never be used to perform actions, or navigate away from the view which contains them.
 * :::
 * An exception for using tab bars in a high level of hierarchy is their usage in modals. This is because modals are perceived as a separate place and not a part of the current context. Therefore you can use tab bars in a modal to group and organize its content.
 * A tab bar can contain an unlimited number of tabs. However, depending on the device width and width of the tabs, the number of tabs that are visible at the same time will vary. When there is limited horizontal space, the component shows a left-arrow and/or right-arrow button, which scrolls and reveals the additional tabs. The tab bar can also be swiped left and right on a touch-device.
 * The arrows are only a shortcut for people who use a mouse or a touch screen. Screen readers do not announce them, and the Tab key skips them. People who use a keyboard or a screen reader move between the tabs, and the tab bar keeps the selected tab in view.
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

    private mdcTabBar: MDCTabBar;
    private setupMdc = false;
    private revealedTabId?: Tab['id'];
    private hasLoaded = false;

    constructor() {
        this.handleTabActivated = this.handleTabActivated.bind(this);
        this.renderTab = this.renderTab.bind(this);
    }

    public async connectedCallback() {
        this.setup();

        // Connecting after the first render means that the bar was moved, which
        // resets how far it is scrolled.
        if (!this.hasLoaded) {
            return;
        }

        this.revealedTabId = undefined;
        await this.revealActiveTab('auto');
    }

    public componentDidLoad() {
        this.hasLoaded = true;
        this.setup();
        this.triggerIconColorWarning();
    }

    public async componentDidRender() {
        await this.revealActiveTab(this.hasLoaded ? undefined : 'auto');
    }

    public componentDidUpdate() {
        if (!this.setupMdc) {
            return;
        }

        this.setup();
        this.setupMdc = false;
    }

    public disconnectedCallback() {
        this.tearDown();
    }

    public render() {
        return (
            <div class="mdc-tab-bar" role="tablist">
                <limel-scroller class="mdc-tab-scroller">
                    {this.tabs.map(this.renderTab)}
                </limel-scroller>
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

        this.setupMdc = true;
        this.revealedTabId = undefined;
        this.tearDown();
    }

    private setup() {
        const element = this.host.shadowRoot.querySelector('.mdc-tab-bar');
        if (!element) {
            return;
        }

        this.mdcTabBar = new MDCTabBar(
            element,
            undefined,
            undefined,
            () => tabScrollerForMdc
        );
        this.mdcTabBar.focusOnActivate = true;
        this.mdcTabBar.useAutomaticActivation = true;

        this.mdcTabBar.listen(TAB_ACTIVATED_EVENT, this.handleTabActivated);
    }

    private tearDown() {
        if (!this.mdcTabBar) {
            return;
        }

        this.mdcTabBar.unlisten(TAB_ACTIVATED_EVENT, this.handleTabActivated);
        this.mdcTabBar.destroy();
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
        const element =
            this.host.shadowRoot.querySelectorAll<HTMLElement>(
                'button[role="tab"]'
            )[index];
        const scroller = this.host.shadowRoot.querySelector('limel-scroller');
        if (!element || !scroller || element.matches(':focus')) {
            return;
        }

        await scroller.componentOnReady();
        await scroller.reveal(element, behavior);
    }

    private handleTabActivated(event: MDCTabBarActivatedEvent) {
        const index = event.detail.index;
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

    private renderTab(tab: Tab) {
        return (
            <button
                class={{
                    'mdc-tab': true,
                    'mdc-tab--active': !!tab.active,
                }}
                role="tab"
                aria-selected={tab.active ? 'true' : 'false'}
                tabindex={tab.active ? 0 : -1}
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
