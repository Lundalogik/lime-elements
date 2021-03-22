import {
    Component,
    h,
    Listen,
    Prop,
    Element,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { MDCTabBar, MDCTabBarActivatedEvent } from '@limetech/mdc-tab-bar';
import { strings } from '@limetech/mdc-tab-bar/constants';
import { Tab } from './tab.types';
import { isEqual, difference } from 'lodash-es';
import { setActiveTab } from './tabs';

const { TAB_ACTIVATED_EVENT } = strings;
const SCROLL_DISTANCE_ON_CLICK_PX = 150;
const HIDE_SCROLL_BUTTONS_WHEN_SCROLLED_LESS_THAN_PX = 40;

/**
 * Tabs are great to organize information hierarchically in the interface and divide it into distinct categories. Using tabs, you can create groups of content that are related and at the same level in the hierarchy.
 * :::warning
 * Tab bars should be strictly used for navigation at the top levels.
 * They should never be used to perform actions, or navigate away from the view which contains them.
 * :::
 * An exception for using tab bars in a high level of hierarchy is their usage in modals. This is because modals are perceived as a separate place and not a part of the current context. Therefore you can use tab bars in a modal to group and organize its content.
 * A tab bar can contain an unlimited number of tabs. However, depending on the device width and width of the tabs, the number of tabs that are visible at the same time will vary. When there is limited horizontal space, the component shows a left-arrow and/or right-arrow button, which scrolls and reveals the additional tabs. The tab bar can also be swiped left and right on a touch-device.
 *:::tip Other things to consider
 * * Never divide the content of a tab using a nested tab bar.
 * * Never place two tab bars within the same screen.
 * * Never use background color for icons in tabs.
 * * Avoid having long labels for tabs.
 * * A tab will never be removed or get disabled, even if there is no content under it.
 * :::
 *
 * @exampleComponent limel-example-tab-bar
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
    private scrollerElement: HTMLElement;
    private scrollArea: HTMLElement;
    private scrollContent: HTMLElement;

    constructor() {
        this.handleTabActivated = this.handleTabActivated.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleLeftScrollClick = this.handleLeftScrollClick.bind(this);
        this.handleRightScrollClick = this.handleRightScrollClick.bind(this);
        this.renderTab = this.renderTab.bind(this);
    }

    public connectedCallback() {
        this.setup();
    }

    public componentDidLoad() {
        this.setup();
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
                <div class="mdc-tab-scroller">
                    <div class="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll">
                        <div class="mdc-tab-scroller__scroll-content">
                            {this.tabs.map(this.renderTab)}
                        </div>
                    </div>
                    <div class="scroll-fade left" />
                    <div class="scroll-button left">
                        <limel-icon-button
                            icon="angle_left"
                            elevated={true}
                            tabindex="-1"
                            aria-hidden="true"
                            onClick={this.handleLeftScrollClick}
                        />
                    </div>
                    <div class="scroll-fade right" />
                    <div class="scroll-button right">
                        <limel-icon-button
                            icon="angle_right"
                            elevated={true}
                            tabindex="-1"
                            aria-hidden="true"
                            onClick={this.handleRightScrollClick}
                        />
                    </div>
                </div>
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
        this.tearDown();
    }

    @Listen('resize', { passive: true, target: 'window' })
    protected handleWindowResize() {
        this.handleScroll();
    }

    private setup() {
        const element = this.host.shadowRoot.querySelector('.mdc-tab-bar');
        if (!element) {
            return;
        }

        this.mdcTabBar = new MDCTabBar(element);
        this.scrollerElement = element.querySelector('.mdc-tab-scroller');
        this.scrollArea = element.querySelector(
            '.mdc-tab-scroller__scroll-area'
        );
        this.scrollContent = element.querySelector(
            '.mdc-tab-scroller__scroll-content'
        );

        // Workaround for shadow dom support for material
        // eslint-disable-next-line no-underscore-dangle
        (this
            .mdcTabBar as any).foundation_.adapter_.getFocusedTabIndex = () => {
            const tabElements = this.getTabElements();
            const activeElement = this.host.shadowRoot.activeElement;

            return tabElements.indexOf(activeElement);
        };

        this.setupListeners();
        this.handleScroll();
    }

    private tearDown() {
        if (this.scrollArea) {
            this.scrollArea.removeEventListener('scroll', this.handleScroll);
        }

        if (this.mdcTabBar) {
            this.mdcTabBar.unlisten(
                TAB_ACTIVATED_EVENT,
                this.handleTabActivated
            );
            this.mdcTabBar.destroy();
        }
    }

    private getTabElements() {
        return [].slice.call(this.host.shadowRoot.querySelectorAll('.mdc-tab'));
    }

    private setupListeners() {
        this.mdcTabBar.listen(TAB_ACTIVATED_EVENT, this.handleTabActivated);
        this.scrollArea.addEventListener('scroll', this.handleScroll, {
            passive: true,
        });
    }

    private handleTabActivated(event: MDCTabBarActivatedEvent) {
        const index = event.detail.index;
        const newTabs = setActiveTab(this.tabs, index);

        difference(newTabs, this.tabs).forEach((tab: Tab) => {
            this.changeTab.emit(tab);
        });

        this.tabs = newTabs;
    }

    private handleScroll() {
        const scrollLeft = this.scrollArea.scrollLeft;
        const scrollRight = Math.floor(
            this.scrollContent.getBoundingClientRect().width -
                this.scrollArea.getBoundingClientRect().width -
                scrollLeft
        );

        if (scrollLeft > HIDE_SCROLL_BUTTONS_WHEN_SCROLLED_LESS_THAN_PX) {
            this.scrollerElement.classList.add('scroll-left');
        } else {
            this.scrollerElement.classList.remove('scroll-left');
        }

        if (scrollRight > HIDE_SCROLL_BUTTONS_WHEN_SCROLLED_LESS_THAN_PX) {
            this.scrollerElement.classList.add('scroll-right');
        } else {
            this.scrollerElement.classList.remove('scroll-right');
        }
    }

    private handleLeftScrollClick() {
        this.scrollArea.scroll({
            left: this.scrollArea.scrollLeft - SCROLL_DISTANCE_ON_CLICK_PX,
            behavior: 'smooth',
        });
    }

    private handleRightScrollClick() {
        this.scrollArea.scroll({
            left: this.scrollArea.scrollLeft + SCROLL_DISTANCE_ON_CLICK_PX,
            behavior: 'smooth',
        });
    }

    private renderIcon(tab: Tab) {
        if (!tab.icon) {
            return;
        }

        const style = { color: '' };

        if (tab.iconColor) {
            style.color = tab.iconColor;
        }

        return (
            <limel-icon
                class="mdc-tab-bar__icon"
                name={tab.icon}
                style={style}
                size="small"
            />
        );
    }

    private renderTab(tab: Tab) {
        const classList = {
            'mdc-tab': true,
            'mdc-tab--active': !!tab.active,
        };

        const indicatorClassList = {
            'mdc-tab-indicator': true,
            'mdc-tab-indicator--active': !!tab.active,
        };

        return (
            <button
                class={classList}
                role="tab"
                aria-selected={tab.active ? 'true' : 'false'}
                tabindex={tab.active ? 0 : -1}
            >
                <span class="mdc-tab__content">
                    {this.renderIcon(tab)}
                    <span class="mdc-tab__text-label">{tab.text}</span>
                    {tab.badge ? <limel-badge label={tab.badge} /> : ''}
                </span>
                <span class={indicatorClassList}>
                    <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
                </span>
                <span class="mdc-tab__ripple" />
            </button>
        );
    }
}
