export * from './components';
import '@limetech/stencil-router';
export * from './types';
import { KompendiumConfig } from './types';
export declare const kompendium: (config?: Partial<KompendiumConfig>) => ((docs: any) => Promise<void>) | (() => any);
