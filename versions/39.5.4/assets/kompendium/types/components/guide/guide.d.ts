import { KompendiumData } from '../../types';
export declare class Guide {
    /**
     */
    data: KompendiumData;
    route: string;
    private text;
    constructor();
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    private setRoute;
    render(): HTMLElement;
    private findGuide;
}
