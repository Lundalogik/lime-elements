import { KompendiumData } from '../../types';
export declare class App {
    /**
     * Path to `kompendium.json`
     */
    path: string;
    data: KompendiumData;
    private socket;
    constructor();
    protected componentWillLoad(): void;
    private createWebSocket;
    private onMessage;
    private fetchData;
    protected render(): HTMLElement;
}
