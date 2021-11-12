import { JsonDocsComponent } from '../../stencil-public-runtime';
export declare class Playground {
  /**
   * The component to display
   */
  component: JsonDocsComponent;
  /**
   * Schema for the component
   */
  schema: Record<string, any>;
  private activeTab;
  constructor();
  render(): HTMLElement;
  private renderTabs;
  private renderTab;
  private renderItems;
  private renderResult;
  private renderItem;
  private renderDebugButton;
  private activateTab;
  private isTabActive;
}
