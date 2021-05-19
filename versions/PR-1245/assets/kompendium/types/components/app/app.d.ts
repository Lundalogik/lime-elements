import { KompendiumData } from '../../types';
export declare class App {
  /**
   * Path to `kompendium.json`
   */
  path: string;
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
