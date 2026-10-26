import { JsonDocsComponent } from '../../stencil-public-runtime';
import { PropsFactory } from './playground.types';
export declare class Playground {
    /**
     * The component to display
     */
    component: JsonDocsComponent;
    /**
     * Schema for the component
     */
    schema: Record<string, any>;
    /**
     * Factory for creating props for example components
     * @returns {Record<string, unknown>} props
     */
    propsFactory?: PropsFactory;
    /**
     * Slug used as the URL anchor for linking to this example.
     */
    anchorSlug?: string;
    private activeTab;
    private theme;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): HTMLElement;
    private renderTabs;
    private renderTab;
    private renderItems;
    private renderResult;
    private renderItem;
    private renderDebugButton;
    private activateTab;
    private isTabActive;
    private themeListener;
}
