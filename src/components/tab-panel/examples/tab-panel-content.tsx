import {
    Component,
    h,
    Prop,
    EventEmitter,
    Event,
    State,
    Watch,
} from '@stencil/core';
import { Tab } from '@limetech/lime-elements';

const LOAD_TIME = 1000;

@Component({
    tag: 'limel-example-tab-panel-content',
    shadow: true,
    styleUrl: 'tab-panel-content.scss',
})
export class TabPanelContentExample {
    /**
     * The tab that this component belongs to
     */
    @Prop()
    public tab: Tab;

    /**
     * Emitted when the vote button is clicked to update the badge in the tab
     */
    @Event()
    private changeTab: EventEmitter<Tab>;

    @State()
    private votes = 0;

    @State()
    private loaded = false;

    constructor() {
        this.vote = this.vote.bind(this);
    }

    public render() {
        if (!this.loaded) {
            return <limel-spinner />;
        }

        const style = {
            backgroundColor: this.tab.iconColor,
            color: 'white',
        };

        return (
            <div class="container">
                <div class="text">
                    <limel-icon
                        badge={true}
                        size="large"
                        name={this.tab.icon}
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

    private vote() {
        this.votes++;
        this.changeTab.emit({
            ...this.tab,
            badge: this.votes,
        });
    }
}
