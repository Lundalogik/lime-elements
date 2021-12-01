import { JsonDocs } from '../../stencil-public-runtime';
import { MatchResults } from '@stencil/router';
export declare class KompendiumDebug {
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
  render(): HTMLElement;
  private renderComponent;
}
