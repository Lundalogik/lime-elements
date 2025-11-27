/**
 * Custom route switch component for Kompendium
 * Manages navigation state and passes current path to child routes
 */
export declare class KompendiumRouteSwitch {
  scrollTopOffset?: number;
  private currentPath;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  private handleHashChange;
  render(): any;
}
