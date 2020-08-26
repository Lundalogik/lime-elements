import {
    Component,
    h,
    Prop,
    Element,
    EventEmitter,
    Event,
    Watch,
} from '@stencil/core';
import { MDCTabBar, MDCTabBarActivatedEvent } from '@limetech/mdc-tab-bar';
import { strings } from '@limetech/mdc-tab-bar/constants';
import { Tab } from './tab.types';
import { isEqual } from 'lodash-es';

const { TAB_ACTIVATED_EVENT } = strings;
const SCROLL_DISTANCE_ON_CLICK_PX = 150;
const HIDE_SCROLL_BUTTONS_WHEN_SCROLLED_LESS_THAN_PX = 40;

@Component({
    tag: 'limel-tab-bar',
    styleUrl: 'tab-bar.scss',
    shadow: true,
})
export class TabBar {
    /**
     * List of tabs to display
     */
    @Prop()
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

    // eslint-disable-next-line @stencil/own-methods-must-be-private
    public componentDidUnload() {
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
                    <div class="scroll-button left" tab-index="-1">
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
        const oldSelectedTab = this.tabs.find((tab) => tab.active === true);

        if (oldSelectedTab) {
            this.changeTab.emit({ ...oldSelectedTab, active: false });
        }

        this.changeTab.emit({ ...this.tabs[index], active: true });
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
