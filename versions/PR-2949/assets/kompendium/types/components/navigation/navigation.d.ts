import { MenuItem } from '../../types';
/**
 * @private
 */
export declare class Navigation {
  /**
   * The menu to display
   */
  menu: MenuItem[];
  /**
   * Title to display at the top of the navigation
   */
  header: string;
  /**
   * Optional logo to display instead of the header
   */
  logo: string;
  /**
   * Index containing searchable documents
   */
  index: any;
  private route;
  private displayNavPanel;
  constructor();
  protected connectedCallback(): void;
  protected disconnectedCallback(): void;
  private setRoute;
  render(): HTMLElement[];
  private renderHeader;
  private toggleMenu;
  private renderChapters;
  private renderMenuItem;
  private isRouteActive;
  private stopPropagationOfNavClick;
}
