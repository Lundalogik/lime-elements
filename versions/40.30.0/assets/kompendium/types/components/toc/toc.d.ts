import { TocEntry } from './toc.types';
/**
 * Floating table-of-contents menu. Clicking the button reveals an overlay
 * listing the entries. Selecting an entry updates the URL hash with a slug
 * anchor (e.g. `#/component/my-component#basic-example`) so the page can
 * scroll to the target and the location can be shared.
 * @private
 */
export declare class Toc {
    /**
     * Entries to show in the menu. A flat or nested list of links.
     */
    entries: TocEntry[];
    private open;
    private userToggles;
    private host;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected onEntriesChange(newEntries: TocEntry[]): void;
    protected onOpenChange(isOpen: boolean, wasOpen: boolean): void;
    render(): HTMLElement;
    private renderEntry;
    private toggle;
    private close;
    private handleLinkClick;
    private toggleExpanded;
    private isEntryExpanded;
    private handleKeydown;
    private handleHashChange;
    private expandSectionForActiveAnchor;
}
