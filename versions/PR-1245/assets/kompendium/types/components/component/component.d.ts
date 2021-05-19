import { JsonDocs } from '../../stencil-public-runtime';
import { MatchResults } from '@stencil/router';
export declare class KompendiumComponent {
  /**
   * The generated documentation data
   */
  docs: JsonDocs;
  /**
   * Component schemas
   */
  schemas: Array<Record<string, any>>;
  /**
   * Matched route parameters
   */
  match: MatchResults;
  private host;
  constructor();
  protected connectedCallback(): void;
  protected disconnectedCallback(): void;
  protected componentDidLoad(): void;
  private handleRouteChange;
  private scrollToElement;
  render(): HTMLElement;
  private renderDocs;
  private getId;
  private getRoute;
}
