import { TypeDescription } from '../../types';
import { MatchResults } from '../router/route-matching';
export declare class Type {
  /**
   */
  types: TypeDescription[];
  /**
   * Matched route parameters
   */
  match: MatchResults;
  private type;
  componentWillRender(): void;
  render(): HTMLElement;
  private findType;
}
