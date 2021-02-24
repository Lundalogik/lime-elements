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
    private route;
    private host;
    constructor();
    protected componentWillLoad(): void;
    protected componentDidUnload(): void;
    private setRoute;
    render(): HTMLElement;
    private renderHeader;
    private toggleMenu;
    private renderChapters;
    private renderMenuItem;
    private isRouteActive;
}
