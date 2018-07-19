import {
    Component,
    Element,
    Watch,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import { ITab } from './tab';
import { MDCTabBar } from '@material/tabs'

@Component({
    tag: 'limel-tabs',
    styleUrl: 'tabs.scss',
    shadow: true,
})
export class Tabs {
    @Prop() public tabs: ITab[] = [];
    @Element() private element: HTMLElement;

    @State() private activeTab: ITab;
    @State() private mdcTabs;
    @Event() private change: EventEmitter;

    @Watch('tabs')
    validateTabs(newValue: ITab[]) {
        if (newValue.length === 0) {
            throw new Error('At least one tab must be supplied');
        }
    }

    public componentDidLoad() {
        this.activeTab = this.tabs[0];
        this.mdcTabs = new MDCTabBar(
            this.element.shadowRoot.querySelector('.mdc-tab-bar')
        );
        console.log(this.mdcTabs)
    }

    public componentDidUnload() {
        this.mdcTabs.destroy();
    }

    public render() {
        return (
            <nav class="mdc-tab-bar">
                {this.tabs.map((tab) => (
                    <a class={
                                `mdc-tab
                                ${this.activeTab === tab ? 'mdc-tab--active': ''}`
                            }
                            href={`#${tab.id}`}
                            onClick={(event) => this.onChange(event, tab) }>
                        {tab.label}
                    </a>
                ))}
                <span class="mdc-tab-bar__indicator"></span>
            </nav>
        );
    }

    private onChange = (_, tab) => {
        this.activeTab = tab;
        this.change.emit(this.activeTab);
    };
}
