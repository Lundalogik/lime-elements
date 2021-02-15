import { JsonDocs } from '../stencil-public-runtime';
import { KompendiumConfig } from '../types';
export declare const kompendium: (config?: Partial<KompendiumConfig>) => ((docs: JsonDocs) => Promise<void>) | (() => any);
export declare function kompendiumGenerator(config: Partial<KompendiumConfig>): (docs: JsonDocs) => Promise<void>;
