import { KompendiumData } from '../../types';
import { PropsFactory } from '../playground/playground.types';
export declare class App {
    /**
     * Path to `kompendium.json`
     */
    path: string;
    /**
     * Factory for creating props for example components
     */
    examplePropsFactory?: PropsFactory;
    data: KompendiumData;
    private index;
    private socket;
    constructor();
    protected componentWillLoad(): void;
    protected watchData(): void;
    private createWebSocket;
    private onMessage;
    private fetchData;
    protected render(): HTMLElement;
}
