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
import config from '../../global/config';
import { isEqual } from 'lodash-es';

const { TAB_ACTIVATED_EVENT } = strings;

@Component({
    tag: 'limel-tab-bar',
    styleUrl: 'tab-bar.scss',
    shadow: true,
})
export class TabBar {
    @Element()
    private element: HTMLElement;

    /**
     * List of tabs to display
     */
    @Prop()
    public tabs: Tab[];

    private mdcTabBar: MDCTabBar;
    private setupMdc = false;

    @Event()
    private changeTab: EventEmitter<Tab>;

    constructor() {
        this.handleTabActivated = this.handleTabActivated.bind(this);
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

    public componentDidUnload() {
        this.tearDown();
    }

    @Watch('tabs')
    protected tabsChanged(newTabs: Tab[], oldTabs: Tab[]) {
        const newIds = newTabs.map((tab) => tab.id);
        const oldIds = oldTabs.map((tab) => tab.id);

        if (isEqual(newIds, oldIds)) {
            return;
        }

        this.setupMdc = true;
        this.tearDown();
    }

    private setup() {
        const element = this.element.shadowRoot.querySelector('.mdc-tab-bar');
        if (!element) {
            return;
        }

        this.mdcTabBar = new MDCTabBar(element);

        // Workaround for shadow dom support for material
        (this
            .mdcTabBar as any).foundation_.adapter_.getFocusedTabIndex = () => {
            const tabElements = this.getTabElements();
            const activeElement = this.element.shadowRoot.activeElement;
            return tabElements.indexOf(activeElement);
        };

        this.setupListeners();
    }

    private tearDown() {
        this.mdcTabBar.unlisten(TAB_ACTIVATED_EVENT, this.handleTabActivated);
        this.mdcTabBar.destroy();
    }

    private getTabElements() {
        return [].slice.call(
            this.element.shadowRoot.querySelectorAll('.mdc-tab')
        );
    }

    private setupListeners() {
        this.mdcTabBar.listen(TAB_ACTIVATED_EVENT, this.handleTabActivated);
    }

    private handleTabActivated(event: MDCTabBarActivatedEvent) {
        const index = event.detail.index;
        const oldSelectedTab = this.tabs.find((tab) => tab.active === true);

        if (oldSelectedTab) {
            this.changeTab.emit({ ...oldSelectedTab, active: false });
        }

        this.changeTab.emit({ ...this.tabs[index], active: true });
    }

    public render() {
        const featFlag = config.featureSwitches.enableTabs;
        if (!featFlag) {
            return;
        }

        return (
            <div class="mdc-tab-bar" role="tablist">
                <div class="mdc-tab-scroller">
                    <div class="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll">
                        <div class="mdc-tab-scroller__scroll-content">
                            {this.tabs.map(this.renderTab)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderIcon(tab: Tab) {
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
