import { KompendiumData, KompendiumDocument, MenuItem } from '../types';
export declare function createIndex(data: KompendiumData): any;
export declare function createDocuments(items: MenuItem[], data: KompendiumData): Generator<KompendiumDocument>;
