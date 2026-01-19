import {
    Component,
    h,
    Prop,
    EventEmitter,
    Event,
    State,
    Watch,
} from '@stencil/core';
import { Icon, Tab, TabPanelComponent } from '@limetech/lime-elements';

const LOAD_TIME = 1000;

@Component({
    tag: 'limel-example-tab-panel-content',
    shadow: true,
    styleUrl: 'tab-panel-content.scss',
})
export class TabPanelContentExample implements TabPanelComponent {
    /**
     * The tab that this component belongs to
     */
    @Prop()
    public tab: Tab;

    /**
     * Emitted when the vote button is clicked to update the badge in the tab
     */
    @Event()
    public changeTab: EventEmitter<Tab>;

    @State()
    private votes = 0;

    @State()
    private loaded = false;

    public render() {
        if (!this.loaded) {
            return <limel-spinner />;
        }

        const icon = this.getIcon();
        const style = {
            backgroundColor: icon?.color,
            color: 'white',
        };

        return (
            <div class="container">
                <div class="text">
                    <limel-icon
                        badge={true}
                        size="large"
                        name={icon?.name}
                        style={style}
                    />
                    <p>
                        {this.tab.text} has received {this.votes} votes!
                    </p>
                </div>
                <limel-button
                    outlined={true}
                    icon="star"
                    label="Vote"
                    onClick={this.vote}
                />
            </div>
        );
    }

    /**
     * Load the tab contents the first time the tab is activated
     */
    @Watch('tab')
    protected watchTab() {
        if (!this.loaded && this.tab.active) {
            this.loadTabContent();
        }
    }

    /**
     * Simulate loading the tab content
     */
    private loadTabContent() {
        setTimeout(() => {
            this.loaded = true;
        }, LOAD_TIME);
    }

    private vote = () => {
        this.votes++;
        this.changeTab.emit({
            ...this.tab,
            badge: this.votes,
        });
    };

    private getIcon(): Icon | undefined {
        const icon = this.tab?.icon;
        if (!icon) {
            return undefined;
        }

        if (typeof icon === 'string') {
            return { name: icon };
        }

        if (typeof icon === 'object') {
            return icon;
        }

        return undefined;
    }
}
