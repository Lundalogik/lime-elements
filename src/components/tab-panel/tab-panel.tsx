import {
    Component,
    Element,
    h,
    Prop,
    EventEmitter,
    Event,
    Host,
} from '@stencil/core';
import { Tab } from '../tab-bar/tab.types';

/**
 * The `tab-panel` component uses the `tab-bar` component together with custom
 * slotted components and will display the content for the currently active tab.
 * Each slotted component must have an id equal to the id of the corresponding
 * tab it belongs to.
 *
 * The `tab-panel` component will automatically set each tab configuration on
 * the corresponding slotted component as a property named `tab` so that the
 * component can take action upon that. Sometimes it might be desirable to not
 * load data or render anything until the tab is active.
 *
 * The slotted components can also emit the `changeTab` event to update anything
 * inside the actual tab, e.g. to change the icon, color or badge.
 *
 * @slot - Content to put inside the `tab-panel`. Each slotted element must
 * have the `id` attribute equal to the id of the tab it belongs to.
 *
 * @exampleComponent limel-example-tab-panel
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

    protected componentDidLoad() {
        const slot = this.getSlot();
        slot.addEventListener('slotchange', this.setSlotElements);
        this.setSlotElements();
        this.tabs.forEach(this.setTabStatus);
    }

    // eslint-disable-next-line @stencil/own-methods-must-be-private
    protected componentDidUnload() {
        const slot = this.getSlot();
        slot.removeEventListener('slotchange', this.setSlotElements);
    }

    public render() {
        return (
            <Host onChangeTab={this.handleChangeTabs}>
                <div class="tab-panel">
                    <limel-tab-bar tabs={this.tabs} />
                    <div class="tab-content">
                        <slot />
                    </div>
                </div>
            </Host>
        );
    }

    private setSlotElements() {
        const slot = this.getSlot();
        this.slotElements = [].slice.call(slot.assignedElements());
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

        element['tab'] = tab; // eslint-disable-line @typescript-eslint/dot-notation
    }

    private handleChangeTabs(event: CustomEvent<Tab>) {
        this.tabs = this.tabs.map((tab) => {
            if (tab.id === event.detail.id) {
                return event.detail;
            }

            return tab;
        });

        this.setTabStatus(event.detail);
    }

    private getSlot(): HTMLSlotElement {
        return this.host.shadowRoot.querySelector('slot');
    }
}
