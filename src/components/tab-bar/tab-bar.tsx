import {
    Component,
    h,
    Prop,
    Element,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { Tab } from './tab.types';
import { isEqual, difference } from 'lodash-es';
import { setActiveTab } from './tabs';
import { getIconColor, getIconName } from '../icon/get-icon-props';
import {
    findNavigationTarget,
    findTabStop,
    isNavigationKey,
    NavigationOptions,
    NO_NAVIGATION_TARGET,
} from '../../util/keyboard-navigation';

/**
 * Tabs are great to organize information hierarchically in the interface and divide it into distinct categories. Using tabs, you can create groups of content that are related and at the same level in the hierarchy.
 * :::warning
 * Tab bars should be strictly used for navigation at the top levels.
 * They should never be used to perform actions, or navigate away from the view which contains them.
 * :::
 * An exception for using tab bars in a high level of hierarchy is their usage in modals. This is because modals are perceived as a separate place and not a part of the current context. Therefore you can use tab bars in a modal to group and organize its content.
 * A tab bar can contain an unlimited number of tabs. However, depending on the device width and width of the tabs, the number of tabs that are visible at the same time will vary. When there is limited horizontal space, the component shows a left-arrow and/or right-arrow button, which scrolls and reveals the additional tabs. The tab bar can also be swiped left and right on a touch-device. A vertical tab bar does the same, upwards and downwards.
 * The arrows are only a shortcut for people who use a mouse or a touch screen. Screen readers do not announce them, and the Tab key skips them. People who use a keyboard or a screen reader move between the tabs, and the tab bar keeps the selected tab in view.
 * The left and right arrow keys move to the previous and the next tab, and select it. In a vertical tab bar, the up and down arrow keys do that instead. Home and End move to the first and the last tab. Moving past the last tab continues at the first one, and the other way around. The Tab key moves on to what comes after the tab bar, and moving back with Shift and Tab lands on the selected tab, or on the first tab when none is selected.
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
 * @exampleComponent limel-example-tab-bar-vertical
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
     * Whether the tabs are laid out in a row, above the content they belong
     * to, or in a column, next to it.
     */
    @Prop({ reflect: true })
    public orientation: 'horizontal' | 'vertical' = 'horizontal';

    /**
     * Emitted when a tab has been changed
     */
    @Event()
    private changeTab: EventEmitter<Tab>;

    @Element()
    private host: HTMLLimelTabBarElement;

    private revealedTabId?: Tab['id'];
    private hasLoaded = false;
    private isLaidOutAgain = false;

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public async connectedCallback() {
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
        this.triggerIconColorWarning();
    }

    public async componentDidRender() {
        const isLaidOutAgain = this.isLaidOutAgain;
        this.isLaidOutAgain = false;
        await this.revealActiveTab(
            !this.hasLoaded || isLaidOutAgain ? 'auto' : undefined,
            isLaidOutAgain
        );
    }

    public render() {
        const tabStop = findTabStop(
            this.tabs,
            this.tabs.findIndex((tab) => tab.active),
            this.getNavigationOptions()
        );

        return (
            <div
                role="tablist"
                aria-orientation={this.getOrientation()}
                onKeyDown={this.handleKeyDown}
            >
                <limel-scroller orientation={this.getOrientation()}>
                    {this.tabs.map((tab, index) =>
                        this.renderTab(tab, index, index === tabStop)
                    )}
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

        this.revealedTabId = undefined;
    }

    @Watch('orientation')
    protected orientationChanged() {
        this.revealedTabId = undefined;
        this.isLaidOutAgain = true;
    }

    private getOrientation(): 'horizontal' | 'vertical' {
        return this.orientation === 'vertical' ? 'vertical' : 'horizontal';
    }

    private getNavigationOptions(): NavigationOptions<Tab> {
        return { orientation: this.getOrientation(), wrap: true };
    }

    private getTabElements(): HTMLElement[] {
        return [
            ...this.host.shadowRoot.querySelectorAll<HTMLElement>(
                'button[role="tab"]'
            ),
        ];
    }

    /**
     * A tab that is activated by the user receives focus, and the scroller
     * reveals what receives focus. This is for a tab that becomes active
     * without it, or that keeps it while the bar is laid out again.
     *
     * @param behavior - `auto` to jump to the tab. Leave it out to let the
     * scroller glide there.
     * @param evenWithFocus - reveal the tab also when it has focus
     */
    private async revealActiveTab(
        behavior?: ScrollBehavior,
        evenWithFocus = false
    ) {
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
        if (!element || !scroller) {
            return;
        }

        if (element.matches(':focus') && !evenWithFocus) {
            return;
        }

        await scroller.componentOnReady();
        await scroller.reveal(element, behavior);
    }

    private handleKeyDown(event: KeyboardEvent) {
        const options = this.getNavigationOptions();
        if (!isNavigationKey(event, options)) {
            return;
        }

        event.preventDefault();
        const current = this.getTabElements().indexOf(
            event.target as HTMLElement
        );
        this.activateTab(
            findNavigationTarget(this.tabs, event.key, current, options)
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
                name={name}
                style={style}
                size="small"
                aria-hidden="true"
            />
        );
    }

    private renderTab(tab: Tab, index: number, isTabStop: boolean) {
        return (
            <button
                role="tab"
                aria-selected={tab.active ? 'true' : 'false'}
                tabindex={isTabStop ? 0 : -1}
                onClick={() => this.activateTab(index)}
            >
                <span class="content">
                    {this.renderIcon(tab)}
                    <span class="text">{tab.text}</span>
                    {tab.badge ? <limel-badge label={tab.badge} /> : ''}
                </span>
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
