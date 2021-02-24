import { KompendiumData } from '../../types';
export declare class Guide {
    /**
     */
    data: KompendiumData;
    route: string;
    private text;
    constructor();
    protected componentWillLoad(): void;
    protected componentDidUnload(): void;
    private setRoute;
    render(): HTMLElement;
    private findGuide;
}
