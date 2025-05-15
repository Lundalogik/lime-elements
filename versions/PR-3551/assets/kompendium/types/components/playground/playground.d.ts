import { JsonDocsComponent } from '../../stencil-public-runtime';
export declare class Playground {
    /**
     * The component to display
     */
    component: JsonDocsComponent;
    private activeTab;
    constructor();
    render(): HTMLElement;
    private renderTabs;
    private renderTab;
    private renderItems;
    private renderResult;
    private renderItem;
    private activateTab;
    private isTabActive;
}
