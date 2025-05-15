import { MenuItem } from '../../kompendium/config';
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
    private route;
    private host;
    constructor();
    protected componentWillLoad(): void;
    protected componentDidUnload(): void;
    private setRoute;
    render(): HTMLElement;
    private toggleMenu;
    private renderChapters;
    private renderMenuItem;
    private isRouteActive;
}
