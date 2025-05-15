import { JsonDocs } from '../stencil-public-runtime';
import { KompendiumConfig } from './config';
export declare const kompendium: (config?: Partial<KompendiumConfig>) => ((docs: JsonDocs) => Promise<void>) | (() => any);
export declare function kompendiumGenerator(config: Partial<KompendiumConfig>): (docs: JsonDocs) => Promise<void>;
