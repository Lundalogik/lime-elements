import {
    Component,
    Element,
    h,
    Prop,
    EventEmitter,
    Event,
    Host,
    Watch,
} from '@stencil/core';
import { Tab } from '../tab-bar/tab.types';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';

/**
 * The `limel-tab-panel` component uses the `limel-tab-bar` component together
 * with custom slotted components and will display the content for the currently
 * active tab. Each slotted component must have an id equal to the id of the
 * corresponding tab it belongs to. These components should implement the
 * [TabPanelComponent](#/type/TabPanelComponent/) interface.
 *
 * The `limel-tab-panel` component will automatically set each tab configuration
 * on the corresponding slotted component as a property named `tab` so that the
 * component can take action upon that. Sometimes it might be desirable to not
 * load data or render anything until the tab is active.
 *
 * The slotted components can also emit the `changeTab` event to update anything
 * inside the actual tab, e.g. to change the icon, color or badge.
 *
 * @slot - Content to put inside the `limel-tab-panel`. Each slotted element
 * must have the `id` attribute equal to the id of the tab it belongs to.
 * @exampleComponent limel-example-tab-panel-basic
 * @exampleComponent limel-example-tab-panel-vertical
 */
@Component({
    tag: 'limel-tab-panel',
    styleUrl: 'tab-panel.scss',
    shadow: true,
})
export class TabPanel {
    /**
     * The tabs to display in the panel
     */
    @Prop({ mutable: true })
    public tabs: Tab[] = [];

    /**
     * Whether the tabs are laid out in a row, above the content, or in a
     * column, to the left of it.
     */
    @Prop({ reflect: true })
    public orientation: 'horizontal' | 'vertical' = 'horizontal';

    /**
     * Emitted when a tab has been changed
     */
    @Event()
    protected changeTab: EventEmitter<Tab>;

    @Element()
    private host: HTMLLimelTabPanelElement;

    private slotElements: HTMLElement[] = [];

    constructor() {
        this.handleChangeTabs = this.handleChangeTabs.bind(this);
        this.setSlotElements = this.setSlotElements.bind(this);
        this.setTabStatus = this.setTabStatus.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const slot = this.getSlot();
        if (!slot) {
            return;
        }

        slot.addEventListener('slotchange', this.setSlotElements);
        this.setSlotElements();
        for (const tab of this.tabs) {
            this.setTabStatus(tab);
        }
    }

    public disconnectedCallback() {
        const slot = this.getSlot();
        slot.removeEventListener('slotchange', this.setSlotElements);
    }

    @Watch('tabs')
    public tabsChanged() {
        this.hidePanels();
        for (const tab of this.tabs) {
            this.setTabStatus(tab);
        }
    }

    public render() {
        return (
            <Host onChangeTab={this.handleChangeTabs}>
                <div class="tab-panel">
                    <limel-tab-bar
                        tabs={this.tabs}
                        orientation={this.orientation}
                    />
                    <div class="tab-content">
                        <slot />
                    </div>
                </div>
            </Host>
        );
    }

    private setSlotElements() {
        const slot = this.getSlot();
        this.hidePanels();
        this.slotElements = Array.prototype.slice.call(slot.assignedElements());
        for (const tab of this.tabs) {
            this.setTabStatus(tab);
        }
    }

    private setTabStatus(tab: Tab) {
        const element = this.slotElements.find((e) => e.id === tab.id);
        if (!element) {
            return;
        }

        if (tab.active) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }

        element['tab'] = tab;
    }

    private handleChangeTabs(event: CustomEvent<Tab>) {
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });

        this.setTabStatus(event.detail);

        // Content inside the newly activated tab may need to redraw once
        // visible, so we use the resize event trick. /Ads
        setTimeout(dispatchResizeEvent, 0);
    }

    private getSlot(): HTMLSlotElement {
        return this.host.shadowRoot.querySelector('slot');
    }

    private hidePanels() {
        for (const element of this.slotElements) {
            element.style.display = 'none';
        }
    }
}
