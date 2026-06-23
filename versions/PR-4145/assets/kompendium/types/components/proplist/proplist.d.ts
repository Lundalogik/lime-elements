export interface ProplistItem {
    key: string;
    value: string;
}
export declare class Proplist {
    /**
     * List of properties
     */
    items: ProplistItem[];
    render(): HTMLElement;
    private renderProperty;
}
