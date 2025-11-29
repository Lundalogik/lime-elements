export * from './components';
export * from './types';
import { KompendiumConfig } from './types';
export declare const kompendium: (config?: Partial<KompendiumConfig>) => ((docs: any) => Promise<void>) | (() => any);
