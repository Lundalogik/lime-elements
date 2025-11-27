import { MatchResults } from './route-matching';
/**
 * Custom route component for Kompendium
 * Renders a component when the route matches
 */
export declare class KompendiumRoute {
  private el;
  private currentPath;
  url?: string;
  component?: string;
  componentProps?: Record<string, any>;
  exact?: boolean;
  routeRender?: (props: {
    match: MatchResults;
  }) => any;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  private handleHashChange;
  render(): any;
}
